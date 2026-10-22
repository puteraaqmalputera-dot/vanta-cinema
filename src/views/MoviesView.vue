<template>
  <div class="movies-view container">
    <!-- Header -->
    <header class="explorer-header">
      <span class="explorer-eyebrow">The Catalog</span>
      <h1 class="explorer-title">Movie Explorer</h1>
      <p class="explorer-subtitle">
        Search across thousands of motion pictures or refine discovery with genres, ratings, and eras.
      </p>
    </header>

    <!-- Configuration helper banner if TMDB token is missing -->
    <ConfigBanner v-if="!hasToken" @configured="handleTokenConfigured" />

    <!-- Search Bar -->
    <div class="search-section">
      <SearchInput 
        v-model="searchInput"
        :is-loading="isLoading && isSearchMode"
        placeholder="Search movies by title, director, or keyword..."
        aria-label="Search movie catalog"
        @clear="clearSearch"
      />

      <div v-if="isSearchMode" class="search-mode-indicator">
        <span class="mode-text">
          Searching for: <strong>"{{ searchQuery }}"</strong>
        </span>
        <span class="mode-hint">
          (Keyword search mode. To filter the entire database by genre and rating, clear search).
        </span>
      </div>
    </div>

    <!-- Filter Controls (Active in Discover mode) -->
    <FilterControls 
      v-if="!isSearchMode"
      :genres="genreList"
      :genre="selectedGenre"
      :year="selectedYear"
      :min-rating="selectedMinRating"
      :sort-by="selectedSort"
      @update:genre="handleGenreChange"
      @update:year="handleYearChange"
      @update:min-rating="handleRatingChange"
      @update:sort-by="handleSortChange"
      @clear="resetAllFilters"
    />

    <!-- Active Filter Summary & Result Count -->
    <div class="results-meta-row">
      <div class="results-count">
        <span v-if="isLoading && movies.length === 0">Loading results...</span>
        <span v-else-if="totalResults > 0">
          Showing <strong>{{ movies.length }}</strong> of <strong>{{ totalResults.toLocaleString() }}</strong> titles
        </span>
        <span v-else-if="!isLoading">0 titles found</span>
      </div>

      <div v-if="hasActiveFilterSettings && !isSearchMode" class="reset-link-wrap">
        <button type="button" class="btn-text-link" @click="resetAllFilters">
          Reset all filters
        </button>
      </div>
    </div>

    <!-- Error State -->
    <ErrorState 
      v-if="error && movies.length === 0"
      title="Unable to retrieve movies"
      :message="error"
      @retry="executeFetch(true)"
    />

    <!-- Skeletons Loading Grid -->
    <div v-else-if="isLoading && movies.length === 0" class="movie-grid-loading">
      <SkeletonGrid :count="12" :columns="6" />
    </div>

    <!-- Empty State -->
    <EmptyState 
      v-else-if="!isLoading && movies.length === 0"
      title="No matching motion pictures"
      :message="isSearchMode 
        ? `No results found for '${searchQuery}'. Check spelling or try a broader search term.` 
        : 'No movies match your current combination of filters. Try loosening your rating or year criteria.'"
      action-text="Reset All Filters"
      @action="resetAllFilters"
    />

    <!-- Results Grid -->
    <div v-else class="results-container">
      <div class="movies-grid">
        <MovieCard 
          v-for="movie in movies" 
          :key="movie.entityId" 
          :movie="movie" 
        />
      </div>

      <!-- Pagination / Load More -->
      <div v-if="currentPage < totalPages" class="load-more-section">
        <button 
          type="button" 
          class="btn btn-secondary load-more-btn"
          :disabled="isLoadingMore"
          @click="loadNextPage"
        >
          <span v-if="!isLoadingMore">Load More Titles (Page {{ currentPage + 1 }} of {{ totalPages }})</span>
          <span v-else>Loading next page...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  searchMovies, 
  discoverMovies, 
  getMovieGenres, 
  hasTmdbToken 
} from '@/services/tmdb'
import { normalizeTmdbMovie } from '@/services/normalize'

import SearchInput from '@/components/common/SearchInput.vue'
import FilterControls from '@/components/common/FilterControls.vue'
import MovieCard from '@/components/movie/MovieCard.vue'
import SkeletonGrid from '@/components/common/SkeletonGrid.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfigBanner from '@/components/common/ConfigBanner.vue'

const route = useRoute()
const router = useRouter()
const hasToken = ref(hasTmdbToken())

// Search and filter reactive state
const searchInput = ref(route.query.q || '')
const searchQuery = ref(route.query.q || '')
const selectedGenre = ref(route.query.genre || '')
const selectedYear = ref(route.query.year || '')
const selectedMinRating = ref(route.query.rating || '')
const selectedSort = ref(route.query.sort || 'popularity.desc')

// Data state
const movies = ref([])
const genreList = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const totalResults = ref(0)
const isLoading = ref(true)
const isLoadingMore = ref(false)
const error = ref(null)

let activeAbortController = null
let debounceTimer = null

const isSearchMode = computed(() => !!searchQuery.value.trim())

const hasActiveFilterSettings = computed(() => {
  return !!selectedGenre.value || !!selectedYear.value || !!selectedMinRating.value || selectedSort.value !== 'popularity.desc'
})

// Debounce search input (~350ms)
watch(searchInput, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchQuery.value = newVal.trim()
    syncUrlQuery()
    executeFetch(true)
  }, 350)
})

function clearSearch() {
  searchInput.value = ''
  searchQuery.value = ''
  syncUrlQuery()
  executeFetch(true)
}

function handleGenreChange(val) {
  selectedGenre.value = val
  syncUrlQuery()
  executeFetch(true)
}

function handleYearChange(val) {
  selectedYear.value = val
  syncUrlQuery()
  executeFetch(true)
}

function handleRatingChange(val) {
  selectedMinRating.value = val
  syncUrlQuery()
  executeFetch(true)
}

function handleSortChange(val) {
  selectedSort.value = val
  syncUrlQuery()
  executeFetch(true)
}

function resetAllFilters() {
  searchInput.value = ''
  searchQuery.value = ''
  selectedGenre.value = ''
  selectedYear.value = ''
  selectedMinRating.value = ''
  selectedSort.value = 'popularity.desc'
  syncUrlQuery()
  executeFetch(true)
}

// Synchronize state with URL query parameters for back/forward navigation
function syncUrlQuery() {
  const query = {}
  if (searchQuery.value) query.q = searchQuery.value
  if (selectedGenre.value) query.genre = selectedGenre.value
  if (selectedYear.value) query.year = selectedYear.value
  if (selectedMinRating.value) query.rating = selectedMinRating.value
  if (selectedSort.value && selectedSort.value !== 'popularity.desc') query.sort = selectedSort.value

  router.replace({ query })
}

// Watch router query for browser back/forward buttons
watch(() => route.query, (newQ) => {
  if (newQ.q !== searchQuery.value) {
    searchInput.value = newQ.q || ''
    searchQuery.value = newQ.q || ''
  }
  selectedGenre.value = newQ.genre || ''
  selectedYear.value = newQ.year || ''
  selectedMinRating.value = newQ.rating || ''
  selectedSort.value = newQ.sort || 'popularity.desc'
})

async function executeFetch(isReset = false) {
  if (!hasToken.value) {
    isLoading.value = false
    return
  }

  if (activeAbortController) {
    activeAbortController.abort()
  }
  activeAbortController = new AbortController()

  if (isReset) {
    currentPage.value = 1
    movies.value = []
    isLoading.value = true
  } else {
    isLoadingMore.value = true
  }
  error.value = null

  try {
    let response
    if (isSearchMode.value) {
      // Keyword search mode
      response = await searchMovies(searchQuery.value, currentPage.value, {
        signal: activeAbortController.signal
      })
    } else {
      // Structured Discover mode
      response = await discoverMovies({
        page: currentPage.value,
        sortBy: selectedSort.value,
        genreId: selectedGenre.value || null,
        year: selectedYear.value || null,
        minRating: selectedMinRating.value ? Number(selectedMinRating.value) : null,
        options: { signal: activeAbortController.signal }
      })
    }

    const normalized = (response.results || []).map(normalizeTmdbMovie).filter(Boolean)
    
    if (isReset) {
      movies.value = normalized
    } else {
      movies.value = [...movies.value, ...normalized]
    }

    totalPages.value = Math.min(response.total_pages || 1, 500) // TMDB caps at 500
    totalResults.value = response.total_results || 0
  } catch (err) {
    if (err.name === 'AbortError') return
    error.value = err.message
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

function loadNextPage() {
  if (currentPage.value < totalPages.value && !isLoadingMore.value) {
    currentPage.value++
    executeFetch(false)
  }
}

async function loadGenres() {
  if (!hasToken.value) return
  try {
    const res = await getMovieGenres()
    genreList.value = res.genres || []
  } catch {
    // ignore
  }
}

function handleTokenConfigured() {
  hasToken.value = hasTmdbToken()
  if (hasToken.value) {
    loadGenres()
    executeFetch(true)
  }
}

onMounted(() => {
  hasToken.value = hasTmdbToken()
  if (hasToken.value) {
    loadGenres()
    executeFetch(true)
  } else {
    isLoading.value = false
  }
})
</script>

<style scoped>
.movies-view {
  min-height: 100vh;
  padding-top: var(--space-2xl);
  padding-bottom: var(--space-4xl);
}

.explorer-header {
  margin-bottom: var(--space-xl);
}

.explorer-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-gold);
}

.explorer-title {
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 4px 0 8px;
}

.explorer-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 600px;
}

.search-section {
  margin-bottom: var(--space-lg);
}

.search-mode-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 0.85rem;
  flex-wrap: wrap;
}

.mode-text {
  color: var(--text-primary);
}

.mode-text strong {
  color: var(--accent-gold);
}

.mode-hint {
  color: var(--text-muted);
}

.results-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.btn-text-link {
  color: var(--accent-gold);
  font-size: 0.85rem;
  text-decoration: underline;
  cursor: pointer;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--space-xl) var(--space-md);
}

@media (max-width: 1280px) {
  .movies-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .movies-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .movies-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-md) var(--space-xs);
  }
}

@media (max-width: 480px) {
  .movies-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.load-more-section {
  display: flex;
  justify-content: center;
  margin-top: var(--space-3xl);
}

.load-more-btn {
  padding: 12px 28px;
  font-size: 0.95rem;
}
</style>
