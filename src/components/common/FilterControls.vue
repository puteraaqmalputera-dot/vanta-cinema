<template>
  <div class="filter-controls-container">
    <div class="filter-row">
      <!-- Genre Selector -->
      <div class="filter-group">
        <label for="filter-genre" class="filter-label">Genre</label>
        <div class="select-wrapper">
          <select 
            id="filter-genre" 
            class="filter-select" 
            :value="genre"
            @change="$emit('update:genre', $event.target.value)"
          >
            <option value="">All Genres</option>
            <option v-for="g in genres" :key="g.id" :value="String(g.id)">
              {{ g.name }}
            </option>
          </select>
          <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <!-- Release Year Selector -->
      <div class="filter-group">
        <label for="filter-year" class="filter-label">Release Year</label>
        <div class="select-wrapper">
          <select 
            id="filter-year" 
            class="filter-select"
            :value="year"
            @change="$emit('update:year', $event.target.value)"
          >
            <option value="">Any Year</option>
            <option v-for="y in availableYears" :key="y" :value="String(y)">
              {{ y }}
            </option>
          </select>
          <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <!-- Rating Threshold Selector -->
      <div class="filter-group">
        <label for="filter-rating" class="filter-label">Min Rating</label>
        <div class="select-wrapper">
          <select 
            id="filter-rating" 
            class="filter-select"
            :value="minRating"
            @change="$emit('update:minRating', $event.target.value)"
          >
            <option value="">Any Rating</option>
            <option value="8">8.0+ Exceptional</option>
            <option value="7">7.0+ High Quality</option>
            <option value="6">6.0+ Good</option>
            <option value="5">5.0+ Average</option>
          </select>
          <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <!-- Sort Option -->
      <div class="filter-group">
        <label for="filter-sort" class="filter-label">Sort By</label>
        <div class="select-wrapper">
          <select 
            id="filter-sort" 
            class="filter-select"
            :value="sortBy"
            @change="$emit('update:sortBy', $event.target.value)"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="primary_release_date.desc">Newest Releases</option>
            <option value="primary_release_date.asc">Oldest Releases</option>
            <option value="vote_count.desc">Most Reviewed</option>
          </select>
          <svg class="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <!-- Clear Action Button -->
      <div v-if="hasActiveFilters" class="filter-group filter-clear-wrap">
        <button 
          type="button" 
          class="btn-clear-filters"
          @click="$emit('clear')"
          title="Reset all filters"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="clear-icon">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
          </svg>
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  genres: {
    type: Array,
    default: () => []
  },
  genre: {
    type: String,
    default: ''
  },
  year: {
    type: String,
    default: ''
  },
  minRating: {
    type: String,
    default: ''
  },
  sortBy: {
    type: String,
    default: 'popularity.desc'
  }
})

defineEmits(['update:genre', 'update:year', 'update:minRating', 'update:sortBy', 'clear'])

const hasActiveFilters = computed(() => {
  return !!props.genre || !!props.year || !!props.minRating || props.sortBy !== 'popularity.desc'
})

// Generate list of years from current year down to 1970
const availableYears = computed(() => {
  const current = new Date().getFullYear()
  const list = []
  for (let y = current; y >= 1970; y--) {
    list.push(y)
  }
  return list
})
</script>

<style scoped>
.filter-controls-container {
  width: 100%;
  margin-bottom: var(--space-xl);
  padding: var(--space-md);
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-md);
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.filter-select {
  width: 100%;
  appearance: none;
  background-color: var(--bg-elevated);
  border: 1px solid var(--border-medium);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  padding: 10px 36px 10px 14px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-select:hover {
  border-color: rgba(255, 255, 255, 0.25);
}

.filter-select:focus-visible {
  border-color: var(--accent-gold);
  outline: none;
  box-shadow: 0 0 0 2px var(--accent-gold-muted);
}

.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.filter-clear-wrap {
  justify-content: flex-end;
}

.btn-clear-filters {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(224, 82, 82, 0.1);
  border: 1px solid rgba(224, 82, 82, 0.3);
  color: #F87171;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-clear-filters:hover {
  background: rgba(224, 82, 82, 0.2);
  border-color: #F87171;
  color: #FEF2F2;
}

.clear-icon {
  width: 15px;
  height: 15px;
}

@media (max-width: 640px) {
  .filter-row {
    grid-template-columns: 1fr;
  }
}
</style>
