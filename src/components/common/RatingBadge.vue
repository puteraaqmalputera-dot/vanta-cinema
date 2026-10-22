<template>
  <div 
    v-if="rating !== null && rating !== undefined" 
    class="rating-badge" 
    :class="[`badge-${size}`, { 'badge-gold': isHighRating }]"
    :aria-label="`Rating ${rating} out of 10`"
  >
    <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
    <span class="score">{{ formattedRating }}</span>
    <span v-if="showScale" class="scale">/10</span>
  </div>
  <div v-else-if="showFallback" class="rating-badge badge-unrated" :class="`badge-${size}`">
    <span>NR</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  rating: {
    type: [Number, String],
    default: null
  },
  size: {
    type: String,
    default: 'sm', // 'xs', 'sm', 'md', 'lg'
    validator: (v) => ['xs', 'sm', 'md', 'lg'].includes(v)
  },
  showScale: {
    type: Boolean,
    default: false
  },
  showFallback: {
    type: Boolean,
    default: false
  }
})

const numericRating = computed(() => {
  if (typeof props.rating === 'number') return props.rating
  const parsed = parseFloat(props.rating)
  return isNaN(parsed) ? null : parsed
})

const formattedRating = computed(() => {
  if (numericRating.value === null) return 'NR'
  return numericRating.value.toFixed(1)
})

const isHighRating = computed(() => {
  return numericRating.value !== null && numericRating.value >= 7.5
})
</script>

<style scoped>
.rating-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(14, 14, 18, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-weight: 600;
  line-height: 1;
  user-select: none;
}

.star-icon {
  width: 12px;
  height: 12px;
  color: var(--accent-gold);
  flex-shrink: 0;
}

.badge-gold {
  border-color: rgba(214, 181, 122, 0.4);
}

.badge-gold .star-icon {
  color: var(--accent-gold);
}

.badge-xs {
  padding: 2px 6px;
  font-size: 0.725rem;
}
.badge-xs .star-icon {
  width: 10px;
  height: 10px;
}

.badge-sm {
  padding: 3px 8px;
  font-size: 0.8rem;
}

.badge-md {
  padding: 5px 10px;
  font-size: 0.875rem;
}
.badge-md .star-icon {
  width: 14px;
  height: 14px;
}

.badge-lg {
  padding: 6px 14px;
  font-size: 1.05rem;
}
.badge-lg .star-icon {
  width: 16px;
  height: 16px;
}

.scale {
  color: var(--text-muted);
  font-size: 0.75em;
  font-weight: 400;
}

.badge-unrated {
  color: var(--text-muted);
  border-color: var(--border-subtle);
}
</style>
