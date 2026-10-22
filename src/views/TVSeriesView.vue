<template>
  <div class="tv-series-view container">
    <!-- Header -->
    <header class="explorer-header">
      <div class="header-badge-row">
        <span class="explorer-eyebrow">Second Independent API</span>
        <span class="tvmaze-tag">Powered by TVmaze API (No Key Required)</span>
      </div>
      <h1 class="explorer-title">Television Series Explorer</h1>
      <p class="explorer-subtitle">
        Explore ongoing dramas, acclaimed limited series, broadcast networks, and current airing schedules directly via TVmaze.
      </p>
    </header>

    <!-- Search Section -->
    <div class="search-section">
      <SearchInput 
        v-model="searchInput"
        :is-loading="isSearching"
        placeholder="Search television shows by name (e.g. Severance, Succession, Fargo)..."
        aria-label="Search TV shows"
        @clear="clearSearch"
      />

      <div v-if="searchQuery" class="search-mode-indicator">
        <span>Showing results for: <strong>"{{ searchQuery }}"</strong></span>
        <button type="button" class="btn-clear-link" @click="clearSearch">Clear Search</button>
      </div>
    </div>

    <!-- Active Search Results -->
    <section v-if="searchQuery" class="tv-results-section" aria-labelledby="heading-tv-search-results">
      <SectionHeader 
        id="heading-tv-search-results"
        :title="`Search Results (${searchResults.length})`" 
        eyebrow="TVmaze Search"
      />

      <div v-if="isSearching" class="tv-grid-loading">
        <SkeletonGrid :count="8" :columns="6" />
      </div>

      <ErrorState 
        v-else-if="searchError"
        title="TV Search Error"
        :message="searchError"
        @retry="performSearch"
      />

      <EmptyState 
        v-else-if="!isSearching && searchResults.length === 0"
        title="No Television Shows Found"
        :message="`No series matched '${searchQuery}'. Try another title or check spelling.`"
        action-text="Clear Search"
        @action="clearSearch"
      />

      <div v-else class="shows-grid">
        <TVShowCard 
          v-for="show in searchResults" 
          :key="show.entityId" 
          :show="show" 
        />
      </div>
    </section>

    <!-- Browsable TV Shows Catalog (when not searching) -->
    <div v-else class="catalog-sections">
      <!-- Section 1: Top Rated Series -->
      <section class="tv-catalog-section" aria-labelledby="heading-tv-top-rated">
        <SectionHeader 
          id="heading-tv-top-rated"
          title="Acclaimed Series" 
          eyebrow="High TVmaze Rating"
        />

        <div v-if="isLoadingCatalog" class="tv-grid-loading">
          <SkeletonGrid :count="6" :columns="6" />
        </div>

        <ErrorState 
          v-else-if="catalogError"
          title="Unable to load TV catalog"
          :message="catalogError"
          @retry="loadCatalog"
        />

        <div v-else class="shows-grid">
          <TVShowCard 
            v-for="show in topRatedCatalog" 
            :key="show.entityId" 
            :show="show" 
          />
        </div>
      </section>

      <!-- Section 2: Today's TV Airing Schedule -->
      <section class="tv-schedule-section" aria-labelledby="heading-tv-schedule">
        <SectionHeader 
          id="heading-tv-schedule"
          title="Airing Today on Television" 
          eyebrow="Live Schedule"
          description="Real-time broadcast schedule data provided by TVmaze. Showing US network airings for today."
        />

        <div v-if="isLoadingSchedule" class="schedule-loading">
          <div v-for="n in 6" :key="n" class="skeleton schedule-item-skeleton" />
        </div>

        <ErrorState 
          v-else-if="scheduleError"
          title="Unable to load television schedule"
          :message="scheduleError"
          @retry="loadSchedule"
        />

        <div v-else-if="scheduleEpisodes.length" class="schedule-list-grid">
          <article 
            v-for="item in scheduleEpisodes" 
            :key="item.id" 
            class="schedule-card"
          >
            <div class="schedule-time-badge">
              <span>{{ item.airtime || 'TBD' }}</span>
            </div>

            <div class="schedule-info">
              <RouterLink 
                :to="{ name: 'tv-details', params: { id: item.show.id } }"
                class="schedule-show-title"
              >
                {{ item.show.name }}
              </RouterLink>
              <div class="schedule-ep-name">
                <span class="ep-num">S{{ item.season }}E{{ item.number }}</span>
                <span class="ep-name-text">{{ item.name || 'Episode' }}</span>
              </div>
              <div class="schedule-network">
                {{ item.show.network?.name || item.show.webChannel?.name || 'Broadcast' }}
              </div>
            </div>
          </article>
        </div>

        <EmptyState 
          v-else
          title="No Scheduled Episodes Found"
          message="No broadcast listings were returned for today."
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { searchTvShows, getShowsCatalog, getTvSchedule } from '@/services/tvmaze'
import { normalizeTvmazeShow } from '@/services/normalize'

import SearchInput from '@/components/common/SearchInput.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'
import TVShowCard from '@/components/tv/TVShowCard.vue'
import SkeletonGrid from '@/components/common/SkeletonGrid.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'

// State
const searchInput = ref('')
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const searchError = ref(null)

const catalogShows = ref([])
const isLoadingCatalog = ref(true)
const catalogError = ref(null)

const scheduleEpisodes = ref([])
const isLoadingSchedule = ref(true)
const scheduleError = ref(null)

let searchDebounceTimer = null
let searchAbortController = null

// Filter catalog shows for high rating
const topRatedCatalog = computed(() => {
  return catalogShows.value
    .filter(s => s.rating && s.rating >= 8.0)
    .slice(0, 18)
})

// Debounced search
watch(searchInput, (val) => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    searchQuery.value = val.trim()
    if (searchQuery.value) {
      performSearch()
    } else {
      searchResults.value = []
    }
  }, 350)
})

function clearSearch() {
  searchInput.value = ''
  searchQuery.value = ''
  searchResults.value = []
}

async function performSearch() {
  if (!searchQuery.value) return

  if (searchAbortController) searchAbortController.abort()
  searchAbortController = new AbortController()

  isSearching.value = true
  searchError.value = null

  try {
    const raw = await searchTvShows(searchQuery.value, { signal: searchAbortController.signal })
    // raw is Array<{ score, show }>
    searchResults.value = raw
      .map(entry => normalizeTvmazeShow(entry.show))
      .filter(Boolean)
  } catch (err) {
    if (err.name === 'AbortError') return
    searchError.value = err.message || 'Error occurred while searching TVmaze.'
  } finally {
    isSearching.value = false
  }
}

async function loadCatalog() {
  isLoadingCatalog.value = true
  catalogError.value = null
  try {
    const shows = await getShowsCatalog(0)
    catalogShows.value = shows.map(normalizeTvmazeShow).filter(Boolean)
  } catch (err) {
    catalogError.value = err.message || 'Unable to retrieve TV catalog from TVmaze.'
  } finally {
    isLoadingCatalog.value = false
  }
}

async function loadSchedule() {
  isLoadingSchedule.value = true
  scheduleError.value = null
  try {
    const today = new Date().toISOString().split('T')[0]
    const episodes = await getTvSchedule(today, 'US')
    // Select prime time and interesting episodes with images or valid show
    scheduleEpisodes.value = (episodes || [])
      .filter(ep => ep.show && ep.show.id)
      .slice(0, 12)
  } catch (err) {
    scheduleError.value = err.message || 'Unable to retrieve today television schedule.'
  } finally {
    isLoadingSchedule.value = false
  }
}

onMounted(() => {
  loadCatalog()
  loadSchedule()
})
</script>

<style scoped>
.tv-series-view {
  min-height: 100vh;
  padding-top: var(--space-2xl);
  padding-bottom: var(--space-4xl);
}

.explorer-header {
  margin-bottom: var(--space-xl);
}

.header-badge-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.explorer-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-gold);
}

.tvmaze-tag {
  font-size: 0.725rem;
  font-weight: 600;
  background: rgba(214, 181, 122, 0.15);
  color: var(--accent-gold);
  border: 1px solid var(--accent-gold-border);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
}

.explorer-title {
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 6px 0 8px;
}

.explorer-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 650px;
}

.search-section {
  margin-bottom: var(--space-2xl);
}

.search-mode-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.search-mode-indicator strong {
  color: var(--accent-gold);
}

.btn-clear-link {
  color: var(--accent-gold);
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.8rem;
}

.catalog-sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-4xl);
}

.shows-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--space-xl) var(--space-md);
}

@media (max-width: 1280px) {
  .shows-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .shows-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .shows-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-md) var(--space-xs);
  }
}

@media (max-width: 480px) {
  .shows-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Schedule Section */
.schedule-loading {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-md);
}

.schedule-item-skeleton {
  height: 80px;
  border-radius: var(--radius-md);
}

.schedule-list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
}

.schedule-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.schedule-card:hover {
  background: var(--bg-card-hover);
  border-color: rgba(255, 255, 255, 0.2);
}

.schedule-time-badge {
  padding: 6px 10px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-gold);
}

.schedule-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.schedule-show-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.schedule-show-title:hover {
  color: var(--accent-gold);
}

.schedule-ep-name {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ep-num {
  font-weight: 600;
  color: var(--accent-gold);
}

.schedule-network {
  font-size: 0.725rem;
  color: var(--text-muted);
}
</style>
