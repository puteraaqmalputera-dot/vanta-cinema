<template>
  <div class="watchlist-view container">
    <!-- Header -->
    <header class="watchlist-header">
      <div class="header-titles">
        <span class="watchlist-eyebrow">Personal Vault</span>
        <h1 class="watchlist-title">Your Watchlist</h1>
        <p class="watchlist-desc">
          Films and television series saved directly to this browser. No account or subscription required.
        </p>
      </div>

      <!-- Clear All Action -->
      <div v-if="watchlistStore.totalCount > 0" class="header-actions">
        <button 
          type="button" 
          class="btn btn-secondary btn-clear-watchlist"
          @click="confirmClearAll"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="trash-icon">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Clear Vault</span>
        </button>
      </div>
    </header>

    <!-- Filters Bar (Status: All / To Watch / Watched & Type: All / Movies / TV) -->
    <div v-if="watchlistStore.totalCount > 0" class="watchlist-filters-bar">
      <!-- Status Tabs -->
      <div class="filter-tabs-group" role="tablist" aria-label="Watchlist Status Filters">
        <button 
          type="button" 
          role="tab"
          class="tab-pill" 
          :class="{ 'is-active': activeStatusFilter === 'all' }"
          :aria-selected="activeStatusFilter === 'all'"
          @click="activeStatusFilter = 'all'"
        >
          <span>All Items</span>
          <span class="pill-count">{{ watchlistStore.totalCount }}</span>
        </button>

        <button 
          type="button" 
          role="tab"
          class="tab-pill" 
          :class="{ 'is-active': activeStatusFilter === 'to_watch' }"
          :aria-selected="activeStatusFilter === 'to_watch'"
          @click="activeStatusFilter = 'to_watch'"
        >
          <span>To Watch</span>
          <span class="pill-count">{{ watchlistStore.toWatchCount }}</span>
        </button>

        <button 
          type="button" 
          role="tab"
          class="tab-pill" 
          :class="{ 'is-active': activeStatusFilter === 'watched' }"
          :aria-selected="activeStatusFilter === 'watched'"
          @click="activeStatusFilter = 'watched'"
        >
          <span>Watched</span>
          <span class="pill-count">{{ watchlistStore.watchedCount }}</span>
        </button>
      </div>

      <!-- Type Filter -->
      <div class="media-type-filter">
        <label for="type-select" class="sr-only">Filter by media type</label>
        <select id="type-select" v-model="activeTypeFilter" class="type-select">
          <option value="all">All Media (Movies & TV)</option>
          <option value="movie">Movies Only</option>
          <option value="tv">TV Series Only</option>
        </select>
      </div>
    </div>

    <!-- Empty Watchlist State -->
    <EmptyState 
      v-if="watchlistStore.totalCount === 0"
      title="Your Watchlist is Empty"
      message="You haven't saved any movies or television shows yet. Explore the catalog and click the bookmark icon on any title to save it here."
      action-text="Discover Movies"
      action-to="/movies"
    >
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-bookmark-icon">
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
        </svg>
      </template>
    </EmptyState>

    <!-- Empty Filtered Results State -->
    <EmptyState 
      v-else-if="filteredItems.length === 0"
      title="No Matching Saved Titles"
      message="No items match your active status or media type filter combination."
      action-text="Show All Saved Items"
      @action="resetFilters"
    />

    <!-- Watchlist Items List -->
    <div v-else class="watchlist-items-grid">
      <WatchlistItem 
        v-for="item in filteredItems" 
        :key="item.entityId" 
        :item="item" 
      />
    </div>

    <!-- LocalStorage Notice / Help -->
    <div v-if="watchlistStore.totalCount > 0" class="local-storage-notice">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="notice-icon">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      <span>
        Your watchlist is saved securely in this browser's <code>localStorage</code>. It persists across refreshes and restarts without tracking cookies or remote databases.
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWatchlistStore } from '@/stores/watchlist'
import WatchlistItem from '@/components/watchlist/WatchlistItem.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const watchlistStore = useWatchlistStore()

const activeStatusFilter = ref('all') // 'all', 'to_watch', 'watched'
const activeTypeFilter = ref('all') // 'all', 'movie', 'tv'

const filteredItems = computed(() => {
  return watchlistStore.items.filter(item => {
    // Status filter
    if (activeStatusFilter.value === 'to_watch' && item.watched) return false
    if (activeStatusFilter.value === 'watched' && !item.watched) return false

    // Type filter
    if (activeTypeFilter.value !== 'all' && item.mediaType !== activeTypeFilter.value) return false

    return true
  })
})

function resetFilters() {
  activeStatusFilter.value = 'all'
  activeTypeFilter.value = 'all'
}

function confirmClearAll() {
  if (confirm('Are you sure you want to remove all saved titles from your local watchlist?')) {
    watchlistStore.clearAll()
  }
}
</script>

<style scoped>
.watchlist-view {
  min-height: 100vh;
  padding-top: var(--space-2xl);
  padding-bottom: var(--space-4xl);
}

.watchlist-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
  flex-wrap: wrap;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.watchlist-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-gold);
}

.watchlist-title {
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--text-primary);
}

.watchlist-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  max-width: 600px;
}

.btn-clear-watchlist {
  font-size: 0.85rem;
  padding: 8px 14px;
  color: #F87171;
  border-color: rgba(224, 82, 82, 0.3);
  background: rgba(224, 82, 82, 0.08);
}

.btn-clear-watchlist:hover {
  background: rgba(224, 82, 82, 0.2);
  border-color: #F87171;
  color: #FEF2F2;
}

.trash-icon {
  width: 15px;
  height: 15px;
}

/* Filters Bar */
.watchlist-filters-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-subtle);
  flex-wrap: wrap;
}

.filter-tabs-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-pill);
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-pill:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.tab-pill.is-active {
  background: var(--accent-gold-muted);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  font-weight: 600;
}

.pill-count {
  font-size: 0.75rem;
  padding: 1px 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-pill);
}

.tab-pill.is-active .pill-count {
  background: var(--accent-gold);
  color: var(--bg-base);
}

.type-select {
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  color: var(--text-primary);
  font-size: 0.85rem;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  outline: none;
  cursor: pointer;
}

.type-select:focus {
  border-color: var(--accent-gold);
}

/* Items Grid */
.watchlist-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: var(--space-md);
}

@media (max-width: 480px) {
  .watchlist-items-grid {
    grid-template-columns: 1fr;
  }
}

.empty-bookmark-icon {
  width: 32px;
  height: 32px;
}

.local-storage-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: var(--space-3xl);
  padding: var(--space-md) var(--space-lg);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  font-size: 0.825rem;
  color: var(--text-muted);
}

.notice-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--accent-gold);
}

.local-storage-notice code {
  color: var(--text-secondary);
}
</style>
