<template>
  <article class="tv-show-card">
    <RouterLink 
      :to="{ name: 'tv-details', params: { id: show.rawId || show.id } }"
      class="card-link"
      :aria-label="`View TV show details for ${show.title}`"
    >
      <div class="poster-container">
        <MediaPoster 
          :src="show.posterUrl" 
          :alt="show.title"
          aspect-ratio="poster"
        >
          <!-- Top Overlay: Rating and Watchlist Button -->
          <div class="card-overlay-top">
            <RatingBadge 
              v-if="show.rating" 
              :rating="show.rating" 
              size="xs" 
            />
            <div class="spacer" />
            <WatchlistButton 
              :media="normalizedMedia" 
              variant="icon" 
            />
          </div>

          <!-- TVmaze badge tag -->
          <div class="tv-badge">
            <span>TVmaze</span>
          </div>

          <div class="card-gradient-bottom" />
        </MediaPoster>
      </div>

      <div class="card-info">
        <h3 class="card-title" :title="show.title">{{ show.title }}</h3>
        <div class="card-meta">
          <span v-if="show.year && show.year !== 'N/A'" class="meta-year">{{ show.year }}</span>
          <span v-if="show.network" class="meta-network" :title="show.network">{{ show.network }}</span>
          <span v-if="show.status" class="meta-status">{{ show.status }}</span>
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
  show: {
    type: Object,
    required: true
  }
})

const normalizedMedia = computed(() => {
  if (props.show.entityId) return props.show
  const id = String(props.show.id)
  return {
    entityId: `tvmaze:show:${id}`,
    provider: 'tvmaze',
    mediaType: 'tv',
    rawId: id,
    title: props.show.title,
    posterUrl: props.show.posterUrl,
    rating: props.show.rating,
    year: props.show.year
  }
})
</script>

<style scoped>
.tv-show-card {
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

.tv-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(9, 9, 11, 0.85);
  border: 1px solid var(--border-medium);
  backdrop-filter: blur(4px);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--accent-gold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 2;
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

.meta-network {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.meta-status {
  font-size: 0.7rem;
  color: var(--accent-gold);
  background: rgba(214, 181, 122, 0.1);
  padding: 1px 5px;
  border-radius: 2px;
}
</style>
