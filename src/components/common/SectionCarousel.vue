<template>
  <div class="carousel-wrapper" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <!-- Prev Arrow -->
    <button 
      type="button" 
      class="carousel-nav nav-prev"
      :class="{ 'is-disabled': isAtStart, 'is-visible': canScroll && isHovered }"
      :disabled="isAtStart"
      aria-label="Scroll left"
      @click="scrollLeft"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="arrow-icon">
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>

    <!-- Scroll Track -->
    <div 
      ref="trackRef" 
      class="carousel-track"
      @scroll="handleScroll"
    >
      <slot />
    </div>

    <!-- Next Arrow -->
    <button 
      type="button" 
      class="carousel-nav nav-next"
      :class="{ 'is-disabled': isAtEnd, 'is-visible': canScroll && isHovered }"
      :disabled="isAtEnd"
      aria-label="Scroll right"
      @click="scrollRight"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="arrow-icon">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const trackRef = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)
const canScroll = ref(false)
const isHovered = ref(false)

function checkScrollBounds() {
  const el = trackRef.value
  if (!el) return
  isAtStart.value = el.scrollLeft <= 5
  isAtEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5
  canScroll.value = el.scrollWidth > el.clientWidth + 10
}

function handleScroll() {
  checkScrollBounds()
}

function scrollLeft() {
  const el = trackRef.value
  if (!el) return
  const scrollAmount = el.clientWidth * 0.75
  el.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
}

function scrollRight() {
  const el = trackRef.value
  if (!el) return
  const scrollAmount = el.clientWidth * 0.75
  el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}

onMounted(() => {
  nextTick(() => {
    checkScrollBounds()
  })
  window.addEventListener('resize', checkScrollBounds)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScrollBounds)
})
</script>

<style scoped>
.carousel-wrapper {
  position: relative;
  width: 100%;
}

.carousel-track {
  display: flex;
  gap: var(--space-md);
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding-bottom: var(--space-sm);
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE */
  -webkit-overflow-scrolling: touch;
}

.carousel-track::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.carousel-track > * {
  scroll-snap-align: start;
  flex-shrink: 0;
}

.carousel-nav {
  position: absolute;
  top: 42%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: var(--radius-pill);
  background: rgba(14, 14, 18, 0.88);
  border: 1px solid var(--border-medium);
  backdrop-filter: blur(8px);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: all var(--transition-fast);
}

.carousel-nav.is-visible {
  opacity: 1;
  pointer-events: auto;
}

.carousel-nav:hover:not(:disabled) {
  background: rgba(28, 28, 34, 0.98);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  transform: translateY(-50%) scale(1.08);
}

.carousel-nav.is-disabled {
  opacity: 0 !important;
  pointer-events: none;
}

.nav-prev {
  left: -20px;
}

.nav-next {
  right: -20px;
}

.arrow-icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .carousel-nav {
    display: none; /* Mobile swipe preferred */
  }
}
</style>
