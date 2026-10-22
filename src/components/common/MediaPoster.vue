<template>
  <div 
    class="media-poster-wrapper" 
    :class="[`aspect-${aspectRatio}`, { 'is-loaded': isLoaded, 'has-error': hasError || !src }]"
  >
    <!-- Actual Image -->
    <img 
      v-if="src && !hasError"
      :src="src" 
      :alt="alt || 'Media poster'"
      :loading="lazy ? 'lazy' : 'eager'"
      decoding="async"
      class="media-poster-img"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Fallback when image is missing or failed to load -->
    <div v-else class="poster-fallback" :aria-label="alt || 'Artwork unavailable'">
      <div class="fallback-icon-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="fallback-icon">
          <rect width="18" height="18" x="3" y="3" rx="2"/>
          <path d="m9 8 6 4-6 4Z"/>
        </svg>
      </div>
      <span class="fallback-title">{{ alt || 'Artwork Unavailable' }}</span>
    </div>

    <!-- Image shimmer while loading -->
    <div v-if="src && !isLoaded && !hasError" class="poster-shimmer" />

    <!-- Overlay slot (for rating badge, watchlist icon, etc.) -->
    <div class="poster-overlay">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: null
  },
  alt: {
    type: String,
    default: ''
  },
  aspectRatio: {
    type: String,
    default: 'poster', // 'poster' (2:3), 'backdrop' (16:9), 'avatar' (1:1)
    validator: (v) => ['poster', 'backdrop', 'avatar'].includes(v)
  },
  lazy: {
    type: Boolean,
    default: true
  }
})

const isLoaded = ref(false)
const hasError = ref(false)

watch(() => props.src, () => {
  isLoaded.value = false
  hasError.value = false
})

function handleLoad() {
  isLoaded.value = true
}

function handleError() {
  hasError.value = true
  isLoaded.value = false
}
</script>

<style scoped>
.media-poster-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: var(--bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-poster);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.aspect-poster {
  aspect-ratio: 2 / 3;
}

.aspect-backdrop {
  aspect-ratio: 16 / 9;
}

.aspect-avatar {
  aspect-ratio: 1 / 1;
  border-radius: var(--radius-pill);
}

.media-poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.35s ease-in-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.is-loaded .media-poster-img {
  opacity: 1;
}

.poster-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    #141418 0%,
    #1F1F26 50%,
    #141418 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.8s infinite;
}

.poster-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  text-align: center;
  background: radial-gradient(circle at center, #1C1C22 0%, #121215 100%);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
}

.fallback-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-xs);
  color: var(--accent-gold);
}

.fallback-icon {
  width: 22px;
  height: 22px;
}

.fallback-title {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poster-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.poster-overlay > * {
  pointer-events: auto;
}
</style>
