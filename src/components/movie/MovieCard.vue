<template>
  <article class="movie-card" :class="{ 'is-compact': compact }">
    <RouterLink 
      :to="{ name: 'movie-details', params: { id: movie.rawId || movie.id } }"
      class="card-link"
      :aria-label="`View details for ${movie.title}`"
    >
      <div class="poster-container">
        <MediaPoster 
          :src="movie.posterUrl" 
          :alt="movie.title"
          aspect-ratio="poster"
        >
          <!-- Top Badges / Actions -->
          <div class="card-overlay-top">
            <RatingBadge 
              v-if="movie.rating" 
              :rating="movie.rating" 
              size="xs" 
            />
            <div class="spacer" />
            <WatchlistButton 
              :media="normalizedMedia" 
              variant="icon" 
            />
          </div>

          <!-- Bottom subtle gradient on hover -->
          <div class="card-gradient-bottom" />
        </MediaPoster>
      </div>

      <div class="card-info">
        <h3 class="card-title" :title="movie.title">{{ movie.title }}</h3>
        <div class="card-meta">
          <span v-if="movie.year && movie.year !== 'N/A'" class="meta-year">{{ movie.year }}</span>
          <span v-if="movie.language" class="meta-lang">{{ movie.language }}</span>
          <span v-if="primaryGenre" class="meta-genre">{{ primaryGenre }}</span>
        </div>
      </div>
    </RouterLink>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import MediaPoster from '@/components/common/MediaPoster.vue'
import RatingBadge from '@/components/common/RatingBadge.vue'
import WatchlistButton from '@/components/common/WatchlistButton.vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const normalizedMedia = computed(() => {
  if (props.movie.entityId) return props.movie
  // In case raw movie object is passed
  const id = String(props.movie.id)
  return {
    entityId: `tmdb:movie:${id}`,
    provider: 'tmdb',
    mediaType: 'movie',
    rawId: id,
    title: props.movie.title,
    posterUrl: props.movie.posterUrl,
    rating: props.movie.rating,
    year: props.movie.year
  }
})

const primaryGenre = computed(() => {
  if (!props.movie.genres || !props.movie.genres.length) return ''
  return props.movie.genres[0]
})
</script>

<style scoped>
.movie-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.card-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
  outline: none;
}

.poster-container {
  position: relative;
  width: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease;
}

.card-link:hover .poster-container,
.card-link:focus-visible .poster-container {
  transform: translateY(-4px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(214, 181, 122, 0.35);
}

.card-link:focus-visible {
  outline: none;
}

.card-overlay-top {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
}

.spacer {
  flex: 1;
}

.card-gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, transparent 0%, rgba(9, 9, 11, 0.6) 100%);
  opacity: 0;
  transition: opacity 0.28s ease;
  pointer-events: none;
}

.card-link:hover .card-gradient-bottom {
  opacity: 1;
}

.card-info {
  display: flex;
  flex-direction: column;
  padding: 10px 2px 4px;
}

.card-title {
  font-family: var(--font-sans);
  font-size: 0.925rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--transition-fast);
}

.card-link:hover .card-title {
  color: var(--accent-gold);
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.meta-year {
  color: var(--text-secondary);
}

.meta-lang {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 1px 4px;
  border-radius: 2px;
  text-transform: uppercase;
}

.meta-genre {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
