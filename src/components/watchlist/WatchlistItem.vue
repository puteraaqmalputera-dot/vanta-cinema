<template>
  <div class="watchlist-item" :class="{ 'is-watched': item.watched }">
    <!-- Clickable thumbnail navigating to details -->
    <RouterLink 
      :to="item.mediaType === 'movie' ? { name: 'movie-details', params: { id: item.rawId } } : { name: 'tv-details', params: { id: item.rawId } }"
      class="item-poster-link"
      :aria-label="`View details for ${item.title}`"
    >
      <div class="poster-box">
        <MediaPoster 
          :src="item.posterUrl" 
          :alt="item.title"
          aspect-ratio="poster"
        >
          <div class="type-pill">
            {{ item.mediaType === 'movie' ? 'Movie' : 'TV Series' }}
          </div>
          <div v-if="item.watched" class="watched-overlay-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="check-icon">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Watched</span>
          </div>
        </MediaPoster>
      </div>
    </RouterLink>

    <!-- Item Content -->
    <div class="item-content">
      <div class="item-header">
        <RouterLink 
          :to="item.mediaType === 'movie' ? { name: 'movie-details', params: { id: item.rawId } } : { name: 'tv-details', params: { id: item.rawId } }"
          class="item-title-link"
        >
          <h3 class="item-title">{{ item.title }}</h3>
        </RouterLink>

        <div class="item-badges">
          <RatingBadge v-if="item.rating" :rating="item.rating" size="xs" />
          <span v-if="item.year && item.year !== 'N/A'" class="item-year">{{ item.year }}</span>
        </div>
      </div>

      <p v-if="item.overview" class="item-overview">{{ item.overview }}</p>

      <!-- Action Row -->
      <div class="item-actions">
        <!-- Toggle Watched -->
        <button 
          type="button" 
          class="btn-action btn-toggle-watched"
          :class="{ 'is-active': item.watched }"
          @click="watchlistStore.toggleWatched(item.entityId)"
          :title="item.watched ? 'Mark as to watch' : 'Mark as watched'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-icon">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{{ item.watched ? 'Watched' : 'Mark Watched' }}</span>
        </button>

        <!-- Remove -->
        <button 
          type="button" 
          class="btn-action btn-remove"
          @click="watchlistStore.removeFromWatchlist(item.entityId)"
          title="Remove from watchlist"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="action-icon">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span>Remove</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWatchlistStore } from '@/stores/watchlist'
import MediaPoster from '@/components/common/MediaPoster.vue'
import RatingBadge from '@/components/common/RatingBadge.vue'

defineProps({
  item: {
    type: Object,
    required: true
  }
})

const watchlistStore = useWatchlistStore()
</script>

<style scoped>
.watchlist-item {
  display: flex;
  gap: var(--space-md);
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  transition: all var(--transition-fast);
}

.watchlist-item:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: var(--bg-card-hover);
}

.watchlist-item.is-watched {
  opacity: 0.8;
  border-color: rgba(74, 222, 128, 0.25);
}

.poster-box {
  width: 100px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
}

@media (max-width: 640px) {
  .poster-box {
    width: 80px;
  }
}

.type-pill {
  position: absolute;
  top: 6px;
  left: 6px;
  background: rgba(9, 9, 11, 0.85);
  border: 1px solid var(--border-medium);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
}

.watched-overlay-badge {
  position: absolute;
  bottom: 6px;
  left: 6px;
  right: 6px;
  background: rgba(22, 101, 52, 0.9);
  color: #DCFCE7;
  padding: 3px;
  border-radius: var(--radius-sm);
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
}

.check-icon {
  width: 11px;
  height: 11px;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.item-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

.item-title-link:hover .item-title {
  color: var(--accent-gold);
}

.item-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.item-year {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.item-overview {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: var(--space-xs) 0;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex-wrap: wrap;
  padding-top: 6px;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.785rem;
  font-weight: 500;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-medium);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.btn-action:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.btn-toggle-watched.is-active {
  background: rgba(74, 222, 128, 0.15);
  border-color: rgba(74, 222, 128, 0.4);
  color: #4ADE80;
}

.btn-remove:hover {
  background: rgba(224, 82, 82, 0.15);
  border-color: rgba(224, 82, 82, 0.4);
  color: #F87171;
}

.action-icon {
  width: 14px;
  height: 14px;
}
</style>
