<template>
  <div class="tv-details-view">
    <!-- Back to TV Series Link -->
    <div class="container nav-back-wrap">
      <button type="button" class="btn-back" @click="$router.back()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="back-icon">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Back to browse</span>
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="container">
      <ErrorState 
        title="TV Series Not Found"
        :message="error"
        retry-text="Retry"
        @retry="fetchShowDetails"
      >
        <template #extra-actions>
          <RouterLink to="/tv" class="btn btn-secondary">
            Return to TV Series Catalog
          </RouterLink>
        </template>
      </ErrorState>
    </div>

    <!-- Loading Skeleton -->
    <div v-else-if="isLoading" class="details-skeleton-wrap container">
      <div class="skeleton-backdrop skeleton" />
      <div class="skeleton-body">
        <div class="skeleton-poster skeleton" />
        <div class="skeleton-text-group">
          <div class="skeleton skeleton-title" />
          <div class="skeleton skeleton-meta" />
          <div class="skeleton skeleton-synopsis" />
        </div>
      </div>
    </div>

    <!-- TV Show Content -->
    <article v-else-if="show" class="tv-details-content">
      <!-- Backdrop Hero -->
      <section class="backdrop-hero">
        <div class="backdrop-image-box">
          <img 
            v-if="show.backdropUrl" 
            :src="show.backdropUrl" 
            :alt="show.title" 
            class="backdrop-img"
          />
          <div class="backdrop-gradient-h" />
          <div class="backdrop-gradient-v" />
        </div>

        <div class="container hero-container">
          <div class="details-header-grid">
            <!-- Poster -->
            <div class="poster-column">
              <div class="poster-frame">
                <MediaPoster 
                  :src="show.posterUrl" 
                  :alt="show.title" 
                  aspect-ratio="poster"
                />
              </div>
            </div>

            <!-- Meta details -->
            <div class="meta-column">
              <div class="meta-badges-row">
                <span class="type-badge">Television Series</span>
                <span class="tvmaze-tag">TVmaze ID: {{ show.rawId }}</span>
                <RatingBadge 
                  v-if="show.rating" 
                  :rating="show.rating" 
                  size="md" 
                  :show-scale="true" 
                />
              </div>

              <h1 class="show-title">{{ show.title }}</h1>

              <!-- Facts Row -->
              <div class="facts-row">
                <span v-if="show.year" class="fact-item">{{ show.year }}</span>
                <span v-if="show.status" class="fact-divider">&bull;</span>
                <span v-if="show.status" class="fact-item status-pill">{{ show.status }}</span>
                <span v-if="show.network" class="fact-divider">&bull;</span>
                <span v-if="show.network" class="fact-item">{{ show.network }}</span>
                <span v-if="show.runtime" class="fact-divider">&bull;</span>
                <span v-if="show.runtime" class="fact-item">{{ show.runtime }}</span>
                <span v-if="show.language" class="fact-divider">&bull;</span>
                <span v-if="show.language" class="fact-item fact-lang">{{ show.language }}</span>
              </div>

              <!-- Genres -->
              <div v-if="show.genres && show.genres.length" class="genre-pills-row">
                <GenrePill 
                  v-for="g in show.genres" 
                  :key="g" 
                  :name="g" 
                  size="sm" 
                />
              </div>

              <!-- Summary -->
              <div class="synopsis-box">
                <h3 class="synopsis-heading">Synopsis</h3>
                <p class="synopsis-text">{{ show.overview }}</p>
              </div>

              <!-- Official Site & Actions -->
              <div class="details-actions">
                <WatchlistButton :media="show" variant="button" />

                <a 
                  v-if="show.officialSite" 
                  :href="show.officialSite" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn btn-secondary"
                >
                  <span>Official Website</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="external-icon">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Body Container -->
      <div class="container details-body-sections">
        <!-- Cast Carousel -->
        <section v-if="castList.length" class="detail-section" aria-labelledby="heading-tv-cast">
          <SectionHeader 
            id="heading-tv-cast"
            title="Starring Cast" 
            eyebrow="Performers" 
          />

          <SectionCarousel>
            <div 
              v-for="c in castList" 
              :key="c.id" 
              class="cast-card"
            >
              <div class="cast-photo-box">
                <img 
                  v-if="c.profileUrl" 
                  :src="c.profileUrl" 
                  :alt="c.name" 
                  class="cast-photo"
                  loading="lazy"
                />
                <div v-else class="cast-photo-fallback">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="person-icon">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
              <div class="cast-info">
                <span class="cast-actor-name" :title="c.name">{{ c.name }}</span>
                <span class="cast-character-name" :title="c.character">{{ c.character }}</span>
              </div>
            </div>
          </SectionCarousel>
        </section>

        <!-- Seasons & Episodes Section -->
        <section class="detail-section seasons-section" aria-labelledby="heading-tv-episodes">
          <SectionHeader 
            id="heading-tv-episodes"
            title="Episodes Guide" 
            eyebrow="Seasons & Broadcasts" 
          />

          <!-- Loading Episodes Indicator -->
          <div v-if="isLoadingEpisodes" class="episodes-loading">
            <div v-for="n in 4" :key="n" class="skeleton episode-skeleton-card" />
          </div>

          <div v-else-if="seasons.length > 0">
            <!-- Season Selector Tabs -->
            <div class="season-tabs" role="tablist" aria-label="Seasons">
              <button 
                v-for="s in seasons" 
                :key="s.number"
                type="button" 
                role="tab"
                class="season-tab-btn"
                :class="{ 'is-active': selectedSeason === s.number }"
                :aria-selected="selectedSeason === s.number"
                @click="selectedSeason = s.number"
              >
                <span>Season {{ s.number }}</span>
                <span class="tab-count">({{ s.episodeCount }} ep)</span>
              </button>
            </div>

            <!-- Episodes List for Selected Season -->
            <div v-if="currentSeasonEpisodes.length" class="episodes-list">
              <article 
                v-for="ep in currentSeasonEpisodes" 
                :key="ep.id"
                class="episode-card"
              >
                <!-- Thumbnail -->
                <div class="episode-thumb-box">
                  <img 
                    v-if="ep.imageUrl" 
                    :src="ep.imageUrl" 
                    :alt="ep.name" 
                    class="ep-img"
                    loading="lazy"
                  />
                  <div v-else class="ep-img-fallback">
                    <span>Ep {{ ep.number }}</span>
                  </div>
                </div>

                <!-- Info -->
                <div class="episode-info">
                  <div class="episode-header-row">
                    <h4 class="episode-title">
                      <span class="ep-number-tag">E{{ ep.number }}</span>
                      <span class="ep-name">{{ ep.name }}</span>
                    </h4>
                    <div class="episode-meta">
                      <span v-if="ep.airdate" class="ep-airdate">{{ ep.airdate }}</span>
                      <span v-if="ep.runtime" class="ep-runtime">{{ ep.runtime }}</span>
                    </div>
                  </div>

                  <p class="episode-summary">{{ ep.summary }}</p>
                </div>
              </article>
            </div>

            <EmptyState 
              v-else
              title="No Episode Data"
              message="No episode information is available for this season yet."
            />
          </div>

          <EmptyState 
            v-else
            title="No Episodes Available"
            message="TVmaze has not registered season data for this series."
          />
        </section>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getShowDetails, getShowEpisodes, getShowSeasons } from '@/services/tvmaze'
import { normalizeTvmazeShow, normalizeTvmazeEpisode } from '@/services/normalize'

import MediaPoster from '@/components/common/MediaPoster.vue'
import RatingBadge from '@/components/common/RatingBadge.vue'
import GenrePill from '@/components/common/GenrePill.vue'
import WatchlistButton from '@/components/common/WatchlistButton.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'
import SectionCarousel from '@/components/common/SectionCarousel.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const route = useRoute()

const show = ref(null)
const rawDetails = ref(null)
const episodes = ref([])
const seasons = ref([])
const selectedSeason = ref(1)

const isLoading = ref(true)
const isLoadingEpisodes = ref(true)
const error = ref(null)

const castList = computed(() => {
  const cast = rawDetails.value?._embedded?.cast || []
  return cast.slice(0, 16).map(c => ({
    id: c.person?.id || Math.random(),
    name: c.person?.name || 'Unknown Actor',
    character: c.character?.name || '',
    profileUrl: c.person?.image?.medium || null
  }))
})

// Current season episodes grouped
const currentSeasonEpisodes = computed(() => {
  return episodes.value.filter(ep => ep.season === selectedSeason.value)
})

async function fetchShowDetails() {
  const id = route.params.id
  if (!id) return

  isLoading.value = true
  error.value = null
  show.value = null
  rawDetails.value = null

  try {
    const data = await getShowDetails(id)
    rawDetails.value = data
    show.value = normalizeTvmazeShow(data)

    if (show.value?.title) {
      document.title = `${show.value.title} — VANTA CINEMA`
    }

    // Now fetch episodes & seasons
    loadEpisodesAndSeasons(id)
  } catch (err) {
    error.value = err.message || 'Unable to retrieve TV series details.'
  } finally {
    isLoading.value = false
  }
}

async function loadEpisodesAndSeasons(showId) {
  isLoadingEpisodes.value = true
  try {
    const [epList, seasonList] = await Promise.all([
      getShowEpisodes(showId),
      getShowSeasons(showId).catch(() => [])
    ])

    const normalizedEps = (epList || []).map(normalizeTvmazeEpisode).filter(Boolean)
    episodes.value = normalizedEps

    // Build seasons summary
    if (seasonList && seasonList.length > 0) {
      seasons.value = seasonList.map(s => {
        const count = normalizedEps.filter(ep => ep.season === s.number).length
        return {
          number: s.number,
          episodeCount: count || s.episodeOrder || 0
        }
      }).filter(s => s.episodeCount > 0)
    } else {
      // Derive seasons from episodes
      const uniqueSeasons = [...new Set(normalizedEps.map(e => e.season))].sort((a, b) => a - b)
      seasons.value = uniqueSeasons.map(sNum => ({
        number: sNum,
        episodeCount: normalizedEps.filter(e => e.season === sNum).length
      }))
    }

    if (seasons.value.length > 0) {
      selectedSeason.value = seasons.value[0].number
    }
  } catch (err) {
    console.warn('Failed to load episodes for show', err)
  } finally {
    isLoadingEpisodes.value = false
  }
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchShowDetails()
  }
})

onMounted(() => {
  fetchShowDetails()
})
</script>

<style scoped>
.tv-details-view {
  min-height: 100vh;
  padding-bottom: var(--space-4xl);
}

.nav-back-wrap {
  padding-top: var(--space-md);
  padding-bottom: var(--space-sm);
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.btn-back:hover {
  color: var(--accent-gold);
}

.back-icon {
  width: 16px;
  height: 16px;
}

/* Skeleton */
.details-skeleton-wrap {
  padding-top: var(--space-xl);
}

.skeleton-backdrop {
  width: 100%;
  height: 380px;
  margin-bottom: var(--space-xl);
}

.skeleton-body {
  display: flex;
  gap: var(--space-xl);
}

.skeleton-poster {
  width: 260px;
  aspect-ratio: 2 / 3;
  flex-shrink: 0;
}

.skeleton-text-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.skeleton-title {
  height: 36px;
  width: 60%;
}

.skeleton-meta {
  height: 20px;
  width: 40%;
}

.skeleton-synopsis {
  height: 120px;
  width: 90%;
}

/* Backdrop Hero */
.backdrop-hero {
  position: relative;
  width: 100%;
  min-height: 520px;
  display: flex;
  align-items: flex-end;
  padding-bottom: var(--space-2xl);
  margin-bottom: var(--space-3xl);
  overflow: hidden;
}

.backdrop-image-box {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.backdrop-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
  opacity: 0.35;
}

.backdrop-gradient-h {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #09090B 0%, rgba(9, 9, 11, 0.7) 40%, rgba(9, 9, 11, 0.2) 100%);
}

.backdrop-gradient-v {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(9, 9, 11, 0.3) 0%, rgba(9, 9, 11, 0.8) 70%, #09090B 100%);
}

.hero-container {
  position: relative;
  z-index: 1;
  width: 100%;
}

.details-header-grid {
  display: flex;
  gap: var(--space-2xl);
  align-items: flex-end;
}

.poster-column {
  width: 280px;
  flex-shrink: 0;
}

.poster-frame {
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8);
  border: 1px solid var(--border-medium);
}

.meta-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.meta-badges-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.type-badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent-gold);
  background: var(--accent-gold-muted);
  border: 1px solid var(--accent-gold-border);
  padding: 3px 8px;
  border-radius: var(--radius-pill);
}

.tvmaze-tag {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.06);
  padding: 3px 8px;
  border-radius: var(--radius-pill);
}

.show-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.facts-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.fact-divider {
  color: var(--text-muted);
}

.status-pill {
  color: var(--accent-gold);
  background: rgba(214, 181, 122, 0.1);
  padding: 1px 6px;
  border-radius: 2px;
  font-weight: 600;
}

.fact-lang {
  background: rgba(255, 255, 255, 0.08);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
}

.genre-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 4px 0;
}

.synopsis-box {
  margin-top: 6px;
  max-width: 800px;
}

.synopsis-heading {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.synopsis-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #D1D1D8;
}

.details-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  flex-wrap: wrap;
}

.external-icon {
  width: 14px;
  height: 14px;
}

/* Cast */
.details-body-sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-4xl);
}

.cast-card {
  width: 130px;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.cast-photo-box {
  width: 100%;
  aspect-ratio: 1 / 1.25;
  background: #141418;
}

.cast-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cast-photo-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.person-icon {
  width: 32px;
  height: 32px;
}

.cast-info {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cast-actor-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cast-character-name {
  font-size: 0.72rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Seasons & Episodes */
.season-tabs {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  overflow-x: auto;
  padding-bottom: var(--space-md);
  margin-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-subtle);
}

.season-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-pill);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

.season-tab-btn:hover {
  color: var(--text-primary);
  background: var(--bg-card-hover);
}

.season-tab-btn.is-active {
  background: var(--accent-gold-muted);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  font-weight: 600;
}

.tab-count {
  font-size: 0.75rem;
  opacity: 0.8;
}

.episodes-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.episode-card {
  display: flex;
  gap: var(--space-lg);
  padding: var(--space-md);
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.episode-card:hover {
  background: var(--bg-card-hover);
  border-color: rgba(255, 255, 255, 0.2);
}

.episode-thumb-box {
  width: 180px;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #141418;
  flex-shrink: 0;
}

.ep-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ep-img-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
}

.episode-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.episode-header-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.episode-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
}

.ep-number-tag {
  color: var(--accent-gold);
  font-weight: 700;
}

.episode-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.episode-summary {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.episode-skeleton-card {
  height: 100px;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-sm);
}

@media (max-width: 768px) {
  .details-header-grid {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .poster-column {
    width: 200px;
  }

  .meta-badges-row,
  .facts-row,
  .genre-pills-row,
  .details-actions {
    justify-content: center;
  }

  .show-title {
    font-size: 2.2rem;
  }

  .episode-card {
    flex-direction: column;
  }

  .episode-thumb-box {
    width: 100%;
  }
}
</style>
