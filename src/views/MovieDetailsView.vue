<template>
  <div class="movie-details-view">
    <!-- Back to Movies link -->
    <div class="container nav-back-wrap">
      <button type="button" class="btn-back" @click="$router.back()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="back-icon">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Back to browse</span>
      </button>
    </div>

    <!-- Error State (e.g. 404 or network error) -->
    <div v-if="error" class="container">
      <ErrorState 
        title="Movie Not Found"
        :message="error"
        retry-text="Retry"
        @retry="fetchMovie"
      >
        <template #extra-actions>
          <RouterLink to="/movies" class="btn btn-secondary">
            Return to Movie Catalog
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

    <!-- Movie Details Content -->
    <article v-else-if="movie" class="movie-details-content">
      <!-- Backdrop Banner -->
      <section class="backdrop-hero">
        <div class="backdrop-image-box">
          <img 
            v-if="movie.backdropUrl" 
            :src="movie.backdropUrl" 
            :alt="movie.title" 
            class="backdrop-img"
          />
          <div class="backdrop-gradient-h" />
          <div class="backdrop-gradient-v" />
        </div>

        <div class="container hero-container">
          <div class="details-header-grid">
            <!-- Left: Poster Card -->
            <div class="poster-column">
              <div class="poster-frame">
                <MediaPoster 
                  :src="movie.posterUrl" 
                  :alt="movie.title"
                  aspect-ratio="poster"
                />
              </div>
            </div>

            <!-- Right: Metadata & Synopsis -->
            <div class="meta-column">
              <div class="meta-badges-row">
                <span class="type-badge">Motion Picture</span>
                <RatingBadge 
                  v-if="movie.rating" 
                  :rating="movie.rating" 
                  size="md" 
                  :show-scale="true" 
                />
                <span v-if="movie.voteCount" class="vote-count">({{ movie.voteCount.toLocaleString() }} votes)</span>
              </div>

              <h1 class="movie-title">{{ movie.title }}</h1>

              <p v-if="movie.tagline" class="movie-tagline">"{{ movie.tagline }}"</p>

              <!-- Facts Row -->
              <div class="facts-row">
                <span v-if="movie.year" class="fact-item">{{ movie.year }}</span>
                <span v-if="movie.runtime" class="fact-divider">&bull;</span>
                <span v-if="movie.runtime" class="fact-item">{{ movie.runtime }}</span>
                <span v-if="movie.language" class="fact-divider">&bull;</span>
                <span v-if="movie.language" class="fact-item fact-lang">{{ movie.language }}</span>
                <span v-if="directorName" class="fact-divider">&bull;</span>
                <span v-if="directorName" class="fact-item">Dir. {{ directorName }}</span>
              </div>

              <!-- Genres -->
              <div v-if="movie.genres && movie.genres.length" class="genre-pills-row">
                <GenrePill 
                  v-for="g in movie.genres" 
                  :key="g" 
                  :name="g" 
                  size="sm" 
                />
              </div>

              <!-- Synopsis -->
              <div class="synopsis-box">
                <h3 class="synopsis-heading">Overview</h3>
                <p class="synopsis-text">{{ movie.overview }}</p>
              </div>

              <!-- Key Crew Details -->
              <div v-if="directorName || writerName" class="crew-summary">
                <div v-if="directorName" class="crew-item">
                  <span class="crew-role">Director</span>
                  <span class="crew-name">{{ directorName }}</span>
                </div>
                <div v-if="writerName" class="crew-item">
                  <span class="crew-role">Writing</span>
                  <span class="crew-name">{{ writerName }}</span>
                </div>
              </div>

              <!-- Action CTAs -->
              <div class="details-actions">
                <button 
                  v-if="trailerKey" 
                  type="button" 
                  class="btn btn-primary"
                  @click="isTrailerOpen = true"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" class="btn-icon-play">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Watch Trailer</span>
                </button>

                <WatchlistButton :media="movie" variant="button" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Body Container -->
      <div class="container details-body-sections">
        <!-- Cast Carousel -->
        <section v-if="castList.length" class="detail-section" aria-labelledby="heading-cast">
          <SectionHeader 
            id="heading-cast"
            title="Top Cast" 
            eyebrow="Performances" 
          />

          <SectionCarousel>
            <div 
              v-for="person in castList" 
              :key="person.id" 
              class="cast-card"
            >
              <div class="cast-photo-box">
                <img 
                  v-if="person.profileUrl" 
                  :src="person.profileUrl" 
                  :alt="person.name" 
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
                <span class="cast-actor-name" :title="person.name">{{ person.name }}</span>
                <span class="cast-character-name" :title="person.character">{{ person.character }}</span>
              </div>
            </div>
          </SectionCarousel>
        </section>

        <!-- Recommended Movies -->
        <section v-if="recommendations.length" class="detail-section" aria-labelledby="heading-recommended">
          <SectionHeader 
            id="heading-recommended"
            title="Recommended Cinema" 
            eyebrow="Because You Viewed This" 
          />

          <SectionCarousel>
            <div 
              v-for="rec in recommendations" 
              :key="rec.entityId" 
              class="related-card-wrap"
            >
              <MovieCard :movie="rec" />
            </div>
          </SectionCarousel>
        </section>

        <!-- Similar Movies -->
        <section v-if="similarMovies.length" class="detail-section" aria-labelledby="heading-similar">
          <SectionHeader 
            id="heading-similar"
            title="Similar Titles" 
            eyebrow="Genre & Theme Kinship" 
          />

          <SectionCarousel>
            <div 
              v-for="sim in similarMovies" 
              :key="sim.entityId" 
              class="related-card-wrap"
            >
              <MovieCard :movie="sim" />
            </div>
          </SectionCarousel>
        </section>
      </div>
    </article>

    <!-- Trailer Modal -->
    <TrailerModal 
      :is-open="isTrailerOpen" 
      :video-key="trailerKey" 
      :title="movie?.title" 
      @close="isTrailerOpen = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMovieDetails, getTmdbProfileUrl } from '@/services/tmdb'
import { normalizeTmdbMovie } from '@/services/normalize'

import MediaPoster from '@/components/common/MediaPoster.vue'
import RatingBadge from '@/components/common/RatingBadge.vue'
import GenrePill from '@/components/common/GenrePill.vue'
import WatchlistButton from '@/components/common/WatchlistButton.vue'
import TrailerModal from '@/components/common/TrailerModal.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'
import SectionCarousel from '@/components/common/SectionCarousel.vue'
import MovieCard from '@/components/movie/MovieCard.vue'
import ErrorState from '@/components/common/ErrorState.vue'

const route = useRoute()

const movie = ref(null)
const rawData = ref(null)
const isLoading = ref(true)
const error = ref(null)
const isTrailerOpen = ref(false)

const directorName = computed(() => {
  const crew = rawData.value?.credits?.crew || []
  const director = crew.find(c => c.job === 'Director')
  return director ? director.name : ''
})

const writerName = computed(() => {
  const crew = rawData.value?.credits?.crew || []
  const writer = crew.find(c => c.job === 'Screenplay' || c.job === 'Writer')
  return writer ? writer.name : ''
})

const trailerKey = computed(() => {
  const videos = rawData.value?.videos?.results || []
  // Priority: 1. Official YouTube Trailer, 2. Any YouTube Trailer, 3. Any YouTube Teaser
  const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official)
    || videos.find(v => v.site === 'YouTube' && v.type === 'Trailer')
    || videos.find(v => v.site === 'YouTube')
  return trailer ? trailer.key : null
})

const castList = computed(() => {
  const cast = rawData.value?.credits?.cast || []
  return cast.slice(0, 16).map(c => ({
    id: c.id,
    name: c.name,
    character: c.character,
    profileUrl: getTmdbProfileUrl(c.profile_path, 'w185')
  }))
})

const recommendations = computed(() => {
  const list = rawData.value?.recommendations?.results || []
  return list.map(normalizeTmdbMovie).filter(Boolean).slice(0, 12)
})

const similarMovies = computed(() => {
  const list = rawData.value?.similar?.results || []
  return list.map(normalizeTmdbMovie).filter(Boolean).slice(0, 12)
})

async function fetchMovie() {
  const id = route.params.id
  if (!id) return

  isLoading.value = true
  error.value = null
  movie.value = null
  rawData.value = null

  try {
    const data = await getMovieDetails(id)
    rawData.value = data
    movie.value = normalizeTmdbMovie(data)
    if (movie.value?.title) {
      document.title = `${movie.value.title} — VANTA CINEMA`
    }
  } catch (err) {
    error.value = err.message || 'Unable to retrieve film details.'
  } finally {
    isLoading.value = false
  }
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchMovie()
  }
})

onMounted(() => {
  fetchMovie()
})
</script>

<style scoped>
.movie-details-view {
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

.vote-count {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.movie-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.movie-tagline {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-style: italic;
  color: var(--accent-gold);
  opacity: 0.9;
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

.crew-summary {
  display: flex;
  gap: var(--space-xl);
  padding-top: var(--space-xs);
  border-top: 1px solid var(--border-subtle);
  margin-top: 6px;
}

.crew-item {
  display: flex;
  flex-direction: column;
}

.crew-role {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.crew-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.details-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  flex-wrap: wrap;
}

.btn-icon-play {
  width: 14px;
  height: 14px;
  color: var(--bg-base);
}

/* Cast & Related Sections */
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

.related-card-wrap {
  width: 190px;
}

@media (max-width: 900px) {
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
  .crew-summary,
  .details-actions {
    justify-content: center;
  }

  .movie-title {
    font-size: 2.2rem;
  }
}
</style>
