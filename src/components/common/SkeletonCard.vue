<template>
  <div class="skeleton-card" :class="`aspect-${aspectRatio}`">
    <div class="skeleton skeleton-media" />
    <div class="skeleton-details">
      <div class="skeleton skeleton-title" />
      <div class="skeleton-meta">
        <div class="skeleton skeleton-tag" />
        <div class="skeleton skeleton-rating" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  aspectRatio: {
    type: String,
    default: 'poster',
    validator: (v) => ['poster', 'backdrop'].includes(v)
  }
})
</script>

<style scoped>
.skeleton-card {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.aspect-poster .skeleton-media {
  aspect-ratio: 2 / 3;
}

.aspect-backdrop .skeleton-media {
  aspect-ratio: 16 / 9;
}

.skeleton-media {
  width: 100%;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-xs);
}

.skeleton-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 4px 0;
}

.skeleton-title {
  height: 14px;
  width: 80%;
  border-radius: var(--radius-sm);
}

.skeleton-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
}

.skeleton-tag {
  height: 10px;
  width: 35%;
  border-radius: var(--radius-sm);
}

.skeleton-rating {
  height: 10px;
  width: 25%;
  border-radius: var(--radius-sm);
}
</style>
