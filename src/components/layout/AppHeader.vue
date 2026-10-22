<template>
  <header class="app-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="header-container container">
      <!-- Brand Logo -->
      <a href="#top" class="brand-link" aria-label="VANTA CINEMA Homepage" @click.prevent="navigateSection('top')">
        <span class="brand-wordmark">VANTA</span>
        <span class="brand-accent">CINEMA</span>
      </a>

      <!-- Desktop Navigation (All-in-One Smooth Anchor Navigation) -->
      <nav class="desktop-nav" aria-label="Main Navigation">
        <a 
          href="#top" 
          class="nav-link"
          :class="{ 'is-active': activeSection === 'top' }"
          @click.prevent="navigateSection('top')"
        >
          Discover
        </a>

        <a 
          href="#movies-section" 
          class="nav-link"
          :class="{ 'is-active': activeSection === 'movies-section' }"
          @click.prevent="navigateSection('movies-section')"
        >
          <span>Movies</span>
          <span class="tag-pill tag-tmdb">API 1</span>
        </a>

        <a 
          href="#tv-section" 
          class="nav-link"
          :class="{ 'is-active': activeSection === 'tv-section' }"
          @click.prevent="navigateSection('tv-section')"
        >
          <span>TV Series</span>
          <span class="tag-pill tag-tv">API 2</span>
        </a>

        <a 
          href="#universities-section" 
          class="nav-link"
          :class="{ 'is-active': activeSection === 'universities-section' }"
          @click.prevent="navigateSection('universities-section')"
        >
          <span>Universities</span>
          <span class="tag-pill tag-uni">API 3</span>
        </a>

        <a 
          href="#mood-section" 
          class="nav-link"
          :class="{ 'is-active': activeSection === 'mood-section' }"
          @click.prevent="navigateSection('mood-section')"
        >
          Mood Match
        </a>

        <a 
          href="#watchlist-section" 
          class="nav-link nav-watchlist"
          :class="{ 'is-active': activeSection === 'watchlist-section' }"
          @click.prevent="navigateSection('watchlist-section')"
        >
          <span>Watchlist</span>
          <span v-if="watchlistStore.totalCount > 0" class="watchlist-count-badge">
            {{ watchlistStore.totalCount }}
          </span>
        </a>
      </nav>

      <!-- Header Utilities -->
      <div class="header-utilities">
        <!-- Search Affordance -->
        <a 
          href="#movies-section" 
          class="search-trigger-btn"
          aria-label="Search movies"
          title="Search movies"
          @click.prevent="navigateSection('movies-section')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="utility-icon">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span class="search-label">Search</span>
        </a>

        <!-- Mobile Menu Toggle Button -->
        <button
          type="button"
          class="mobile-toggle-btn"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Toggle mobile menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="utility-icon">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <MobileNavigation 
      :is-open="isMobileMenuOpen" 
      :watchlist-count="watchlistStore.totalCount"
      @navigate="handleMobileNavigate"
      @close="isMobileMenuOpen = false" 
    />
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWatchlistStore } from '@/stores/watchlist'
import MobileNavigation from './MobileNavigation.vue'

const router = useRouter()
const route = useRoute()
const watchlistStore = useWatchlistStore()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const activeSection = ref('top')

function handleScroll() {
  isScrolled.value = window.scrollY > 20

  // Update active section based on scroll position
  const sections = ['top', 'movies-section', 'tv-section', 'universities-section', 'mood-section', 'watchlist-section']
  for (const sId of sections) {
    const el = document.getElementById(sId)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 140 && rect.bottom >= 140) {
        activeSection.value = sId
        break
      }
    }
  }
}

function navigateSection(sectionId) {
  if (route.name === 'discover') {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      activeSection.value = sectionId
    }
  } else {
    router.push({ name: 'discover', hash: `#${sectionId}` }).then(() => {
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    })
  }
}

function handleMobileNavigate(sectionId) {
  isMobileMenuOpen.value = false
  navigateSection(sectionId)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: rgba(9, 9, 11, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border-subtle);
  z-index: 100;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.app-header.is-scrolled {
  background: rgba(9, 9, 11, 0.95);
  border-bottom-color: var(--border-medium);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

/* Brand */
.brand-link {
  display: flex;
  align-items: baseline;
  gap: 6px;
  text-decoration: none;
}

.brand-wordmark {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: var(--text-primary);
}

.brand-accent {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--accent-gold);
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.nav-link {
  position: relative;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
  padding: 8px 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-link.is-active {
  color: var(--text-primary);
  font-weight: 600;
}

.nav-link.is-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-gold);
  border-radius: var(--radius-pill);
}

.tag-pill {
  font-size: 0.625rem;
  padding: 1px 5px;
  border-radius: var(--radius-sm);
  font-weight: 700;
  text-transform: uppercase;
}

.tag-tmdb {
  background: rgba(214, 181, 122, 0.15);
  color: var(--accent-gold);
}

.tag-tv {
  background: rgba(56, 189, 248, 0.15);
  color: #38BDF8;
}

.tag-uni {
  background: rgba(74, 222, 128, 0.15);
  color: #4ADE80;
}

.nav-watchlist {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.watchlist-count-badge {
  font-size: 0.7rem;
  font-weight: 700;
  background: var(--accent-gold);
  color: var(--bg-base);
  padding: 1px 6px;
  border-radius: var(--radius-pill);
  min-width: 18px;
  text-align: center;
}

/* Utilities */
.header-utilities {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.search-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-pill);
  color: var(--text-secondary);
  font-size: 0.85rem;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.search-trigger-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  color: var(--text-primary);
}

.search-label {
  font-size: 0.825rem;
}

.utility-icon {
  width: 17px;
  height: 17px;
}

.mobile-toggle-btn {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  color: var(--text-primary);
}

@media (max-width: 960px) {
  .desktop-nav {
    display: none;
  }

  .mobile-toggle-btn {
    display: flex;
  }

  .search-label {
    display: none;
  }

  .search-trigger-btn {
    padding: 9px;
    border-radius: var(--radius-md);
  }
}
</style>
