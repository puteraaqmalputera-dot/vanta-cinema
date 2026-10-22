<template>
  <Transition name="fade">
    <button
      v-if="isVisible"
      type="button"
      class="back-to-top-btn"
      aria-label="Scroll back to top of page"
      title="Back to Top"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="top-icon">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isVisible = ref(false)

function checkScroll() {
  isVisible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped>
.back-to-top-btn {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-pill);
  background: rgba(20, 20, 24, 0.9);
  border: 1px solid var(--accent-gold-border);
  color: var(--accent-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  cursor: pointer;
  z-index: 90;
  transition: all var(--transition-fast);
}

.back-to-top-btn:hover {
  background: var(--bg-card);
  border-color: var(--accent-gold);
  color: #FFF;
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.7);
}

.top-icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 640px) {
  .back-to-top-btn {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
}
</style>
