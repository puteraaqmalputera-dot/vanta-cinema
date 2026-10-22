<template>
  <div class="skeleton-grid" :style="{ '--columns': columns }">
    <SkeletonCard 
      v-for="n in count" 
      :key="n" 
      :aspect-ratio="aspectRatio" 
    />
  </div>
</template>

<script setup>
import SkeletonCard from './SkeletonCard.vue'

defineProps({
  count: {
    type: Number,
    default: 12
  },
  columns: {
    type: Number,
    default: 6
  },
  aspectRatio: {
    type: String,
    default: 'poster'
  }
})
</script>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
  gap: var(--space-lg) var(--space-md);
  width: 100%;
}

@media (max-width: 1280px) {
  .skeleton-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .skeleton-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .skeleton-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-md) var(--space-xs);
  }
}

@media (max-width: 480px) {
  .skeleton-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
