<template>
  <Teleport to="body">
    <Transition name="mobile-menu">
      <div 
        v-if="isOpen" 
        class="mobile-nav-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        @click="close"
      >
        <div class="mobile-nav-drawer" @click.stop>
          <div class="drawer-header">
            <a href="#top" class="drawer-brand" @click.prevent="navigate('top')">
              <span class="brand-text">VANTA</span>
              <span class="brand-sub">CINEMA</span>
            </a>

            <button 
              type="button" 
              class="close-btn" 
              aria-label="Close navigation menu"
              @click="close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="close-icon">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav class="drawer-links">
            <a 
              href="#top" 
              class="drawer-link" 
              @click.prevent="navigate('top')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="link-icon">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <span>Discover</span>
            </a>

            <a 
              href="#movies-section" 
              class="drawer-link" 
              @click.prevent="navigate('movies-section')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="link-icon">
                <rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/>
                <line x1="7" x2="7" y1="2" y2="22"/>
                <line x1="17" x2="17" y1="2" y2="22"/>
                <line x1="2" x2="22" y1="12" y2="12"/>
                <line x1="2" x2="7" y1="7" y2="7"/>
                <line x1="2" x2="7" y1="17" y2="17"/>
                <line x1="17" x2="22" y1="17" y2="17"/>
                <line x1="17" x2="22" y1="7" y2="7"/>
              </svg>
              <span>Movies</span>
              <span class="badge-tag">API 1 &bull; TMDB</span>
            </a>

            <a 
              href="#tv-section" 
              class="drawer-link" 
              @click.prevent="navigate('tv-section')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="link-icon">
                <rect width="20" height="15" x="2" y="7" rx="2" ry="2" />
                <polyline points="17 2 12 7 7 2" />
              </svg>
              <span>TV Series</span>
              <span class="badge-tag">API 2 &bull; TVmaze</span>
            </a>

            <a 
              href="#universities-section" 
              class="drawer-link" 
              @click.prevent="navigate('universities-section')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="link-icon">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              <span>Universities</span>
              <span class="badge-tag badge-tag-green">API 3 &bull; Details</span>
            </a>

            <a 
              href="#mood-section" 
              class="drawer-link" 
              @click.prevent="navigate('mood-section')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="link-icon">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
              <span>Mood Match</span>
            </a>

            <a 
              href="#watchlist-section" 
              class="drawer-link" 
              @click.prevent="navigate('watchlist-section')"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="link-icon">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
              </svg>
              <span>Watchlist</span>
              <span v-if="watchlistCount > 0" class="badge-count">{{ watchlistCount }}</span>
            </a>
          </nav>

          <div class="drawer-footer">
            <p class="tagline">Every story starts with discovery.</p>
            <div class="attribution-tags">
              <span>TMDB</span>
              <span>&bull;</span>
              <span>TVmaze</span>
              <span>&bull;</span>
              <span>Universities API</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  watchlistCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'navigate'])

function close() {
  emit('close')
}

function navigate(sectionId) {
  emit('navigate', sectionId)
}

watch(() => props.isOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.mobile-nav-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 500;
  display: flex;
  justify-content: flex-end;
}

.mobile-nav-drawer {
  width: 82%;
  max-width: 320px;
  height: 100%;
  background: var(--bg-elevated);
  border-left: 1px solid var(--border-medium);
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.7);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-subtle);
}

.drawer-brand {
  display: flex;
  align-items: baseline;
  gap: 6px;
  cursor: pointer;
}

.brand-text {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--text-primary);
}

.brand-sub {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--accent-gold);
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.close-icon {
  width: 20px;
  height: 20px;
}

.drawer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: var(--space-lg) 0;
  flex: 1;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.drawer-link:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.06);
}

.link-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.badge-tag {
  margin-left: auto;
  font-size: 0.65rem;
  padding: 2px 6px;
  background: rgba(214, 181, 122, 0.15);
  color: var(--accent-gold);
  border-radius: var(--radius-sm);
  font-weight: 600;
  text-transform: uppercase;
}

.badge-tag-green {
  background: rgba(74, 222, 128, 0.15);
  color: #4ADE80;
}

.badge-count {
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  background: var(--accent-gold);
  color: var(--bg-base);
  border-radius: var(--radius-pill);
}

.drawer-footer {
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tagline {
  font-size: 0.78rem;
  font-style: italic;
  color: var(--text-muted);
}

.attribution-tags {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  color: var(--text-muted);
}

/* Transitions */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.25s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-active .mobile-nav-drawer {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-menu-enter-from .mobile-nav-drawer {
  transform: translateX(100%);
}

.mobile-menu-leave-to .mobile-nav-drawer {
  transform: translateX(100%);
}
</style>
