<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="isOpen" 
        class="modal-backdrop" 
        role="dialog" 
        aria-modal="true"
        :aria-label="title ? `Trailer for ${title}` : 'Video Player'"
        @click="handleBackdropClick"
      >
        <div class="modal-dialog" ref="dialogRef">
          <!-- Header Bar -->
          <div class="modal-header">
            <h3 class="modal-title">{{ title || 'Official Trailer' }}</h3>
            <button 
              type="button" 
              class="modal-close-btn" 
              aria-label="Close trailer dialog"
              @click="closeModal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="close-icon">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Video Container -->
          <div class="modal-video-box">
            <iframe
              v-if="videoKey"
              :src="`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`"
              title="Official Trailer"
              class="modal-iframe"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
            <div v-else class="modal-no-video">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-video-icon">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              <p>Trailer is currently unavailable for this title.</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  videoKey: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const dialogRef = ref(null)

function closeModal() {
  emit('close')
}

function handleBackdropClick(event) {
  if (dialogRef.value && !dialogRef.value.contains(event.target)) {
    closeModal()
  }
}

function handleKeyDown(event) {
  if (event.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

watch(() => props.isOpen, (open) => {
  if (open) {
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
  } else {
    window.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(12px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
}

.modal-dialog {
  width: 100%;
  max-width: 960px;
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-subtle);
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: var(--space-md);
}

.modal-close-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-pill);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.06);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: var(--text-primary);
  transform: rotate(90deg);
}

.close-icon {
  width: 20px;
  height: 20px;
}

.modal-video-box {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}

.modal-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.modal-no-video {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  gap: var(--space-sm);
  padding: var(--space-lg);
  text-align: center;
}

.empty-video-icon {
  width: 48px;
  height: 48px;
}

/* Modal transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-dialog {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from .modal-dialog {
  transform: scale(0.95);
}
</style>
