<template>
  <button
    type="button"
    class="watchlist-btn"
    :class="[
      `variant-${variant}`,
      { 'is-saved': isSaved, 'is-watched': isWatchedStatus }
    ]"
    :aria-label="ariaLabel"
    :title="ariaLabel"
    @click.stop.prevent="handleToggle"
  >
    <!-- Bookmark / Saved Icon -->
    <svg 
      v-if="!isSaved" 
      class="btn-icon" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
    <svg 
      v-else 
      class="btn-icon icon-saved" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      stroke="currentColor" 
      stroke-width="1.5"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>

    <span v-if="variant !== 'icon'" class="btn-text">
      {{ buttonText }}
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useWatchlistStore } from '@/stores/watchlist'

const props = defineProps({
  media: {
    type: Object,
    required: true
  },
  variant: {
    type: String,
    default: 'button', // 'button', 'icon', 'compact'
    validator: (v) => ['button', 'icon', 'compact'].includes(v)
  }
})

const watchlistStore = useWatchlistStore()

const isSaved = computed(() => {
  return watchlistStore.isInWatchlist(props.media?.entityId)
})

const isWatchedStatus = computed(() => {
  return watchlistStore.isWatched(props.media?.entityId)
})

const buttonText = computed(() => {
  if (isSaved.value) {
    return isWatchedStatus.value ? 'Watched' : 'In Watchlist'
  }
  return 'Watchlist'
})

const ariaLabel = computed(() => {
  if (isSaved.value) {
    return `Remove ${props.media?.title || 'item'} from Watchlist`
  }
  return `Add ${props.media?.title || 'item'} to Watchlist`
})

function handleToggle() {
  if (!props.media) return
  watchlistStore.toggleWatchlist(props.media)
}
</script>

<style scoped>
.watchlist-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  transition: all var(--transition-fast);
  cursor: pointer;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  user-select: none;
}

/* Variant Button */
.variant-button {
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--border-medium);
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
}

.variant-button:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.variant-button.is-saved {
  background: var(--accent-gold-muted);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

/* Variant Icon (for poster overlay) */
.variant-icon {
  width: 34px;
  height: 34px;
  background: rgba(14, 14, 18, 0.85);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-pill);
  backdrop-filter: blur(6px);
}

.variant-icon:hover {
  background: rgba(26, 26, 32, 0.95);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.08);
}

.variant-icon.is-saved {
  background: rgba(214, 181, 122, 0.2);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

/* Variant Compact */
.variant-compact {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-subtle);
  font-size: 0.8rem;
  font-weight: 500;
}

.variant-compact:hover {
  background: rgba(255, 255, 255, 0.1);
}

.variant-compact.is-saved {
  color: var(--accent-gold);
  border-color: var(--accent-gold-border);
}

.btn-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.icon-saved {
  color: var(--accent-gold);
}
</style>
