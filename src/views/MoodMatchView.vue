<template>
  <div class="mood-match-view container">
    <!-- Header -->
    <header class="mood-header">
      <span class="mood-eyebrow">Signature Recommendation Engine</span>
      <h1 class="mood-title">Mood Match</h1>
      <p class="mood-subtitle">
        How do you want to feel tonight? Select your emotional state, and our deterministic cinematic algorithm will curate films aligned with your mindset.
      </p>
    </header>

    <!-- TMDB Config Banner if missing token -->
    <ConfigBanner v-if="!hasToken" @configured="handleTokenConfigured" />

    <!-- Step 1: Select Mood -->
    <section class="mood-selection-section" aria-labelledby="heading-select-mood">
      <div class="step-label-row">
        <span class="step-indicator">Step 1</span>
        <h2 id="heading-select-mood" class="step-heading">Select Your Emotional Frequency</h2>
      </div>

      <div class="mood-grid">
        <MoodCard
          v-for="mood in moodOptions"
          :key="mood.id"
          :mood="mood"
          :is-selected="selectedMood?.id === mood.id"
          @select="selectMood"
        />
      </div>
    </section>

    <!-- Step 2: Era Selection & Search Trigger -->
    <section class="controls-section" aria-labelledby="heading-era-controls">
      <div class="controls-card">
        <div class="control-group">
          <label for="era-select" class="control-label">Release Era Preference</label>
          <div class="select-wrapper">
            <select id="era-select" v-model="selectedEra" class="era-select">
              <option value="any">Any Era (Modern & Classics)</option>
              <option value="modern">Modern Cinema (2020 — Present)</option>
              <option value="2010s">The 2010s Decade</option>
              <option value="2000s">The 2000s Decade</option>
              <option value="classics">Golden Classics (Pre-2000)</option>
            </select>
          </div>
        </div>

        <div class="control-group">
          <label for="quality-select" class="control-label">Critic Threshold</label>
          <div class="select-wrapper">
            <select id="quality-select" v-model="minRating" class="era-select">
              <option value="7">High Quality (7.0+ Rating)</option>
              <option value="7.5">Exceptional (7.5+ Rating)</option>
              <option value="6.5">Crowd Pleaser (6.5+ Rating)</option>
            </select>
          </div>
        </div>

        <div class="action-btn-group">
          <button 
            type="button" 
            class="btn btn-primary btn-match"
            :disabled="!selectedMood || isLoading"
            @click="findMovies(true)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="match-icon">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 8 8 12 12 16 12 8" />
              <line x1="12" y1="8" x2="16" y2="12" />
            </svg>
            <span v-if="!isLoading">Find My Movies</span>
            <span v-else>Curating Selection...</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Curated Recommendations Results -->
    <section v-if="hasSearched" class="recommendations-results" aria-labelledby="heading-results">
      <div class="results-header-box">
        <div class="results-header-info">
          <span class="results-eyebrow">Curated Program</span>
          <h2 id="heading-results" class="results-title">
            Films for {{ selectedMood?.name }}
          </h2>
          <p class="results-mood-desc">
            {{ selectedMood?.explanation }}
          </p>
        </div>

        <!-- Reshuffle Action Button -->
        <button 
          type="button" 
          class="btn btn-secondary btn-reshuffle"
          :disabled="isLoading"
          @click="reshuffleSelection"
          title="Discover another page of matching suggestions"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="reshuffle-icon">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
          <span>Reshuffle Selection</span>
        </button>
      </div>

      <!-- Loading Skeletons -->
      <div v-if="isLoading" class="results-loading">
        <SkeletonGrid :count="6" :columns="6" />
      </div>

      <!-- Error State -->
      <ErrorState 
        v-else-if="error"
        title="Could not match films"
        :message="error"
        @retry="findMovies(false)"
      />

      <!-- Empty State -->
      <EmptyState 
        v-else-if="!isLoading && curatedMovies.length === 0"
        title="No Matching Films Found"
        message="Try loosening your critic threshold or selecting 'Any Era' to discover more titles."
        action-text="Reset Era & Try Again"
        @action="resetAndRetry"
      />

      <!-- Movies Grid -->
      <div v-else class="curated-grid">
        <MovieCard 
          v-for="movie in curatedMovies" 
          :key="movie.entityId" 
          :movie="movie" 
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue'
import { discoverMovies, hasTmdbToken } from '@/services/tmdb'
import { normalizeTmdbMovie } from '@/services/normalize'

import MoodCard from '@/components/mood/MoodCard.vue'
import MovieCard from '@/components/movie/MovieCard.vue'
import SkeletonGrid from '@/components/common/SkeletonGrid.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfigBanner from '@/components/common/ConfigBanner.vue'

const hasToken = ref(hasTmdbToken())

// Mood Definitions with SVG icon components
const moodOptions = [
  {
    id: 'feel-good',
    name: 'Feel Good',
    tagline: 'Warmth, laughs, and pure optimism',
    description: 'Whimsical journeys, heartwarming comedies, and uplifting animation that restore faith in humanity.',
    explanation: 'Selected comedy, animation, and family cinema calibrated for warmth, smiles, and comforting resolutions.',
    color: '#FBBF24',
    genreIds: '35,16,10751',
    sortBy: 'popularity.desc',
    iconComponent: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
        h('circle', { cx: '12', cy: '12', r: '10' }),
        h('path', { d: 'M8 14s1.5 2 4 2 4-2 4-2' }),
        h('line', { x1: '9', y1: '9', x2: '9.01', y2: '9' }),
        h('line', { x1: '15', y1: '9', x2: '15.01', y2: '9' })
      ])
    }
  },
  {
    id: 'mind-bending',
    name: 'Mind-Bending',
    tagline: 'Twists, paradoxes, and deep curiosity',
    description: 'Intellectual science fiction, reality-bending mysteries, and cerebral psychological thrillers.',
    explanation: 'Calibrated for complex plots, metaphysical questions, and narrative twists that provoke hours of post-viewing discussion.',
    color: '#818CF8',
    genreIds: '878,9648,53',
    sortBy: 'vote_average.desc',
    iconComponent: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
        h('path', { d: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z' }),
        h('path', { d: 'M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z' })
      ])
    }
  },
  {
    id: 'dark-intense',
    name: 'Dark & Intense',
    tagline: 'High stakes, noir tensions, and grit',
    description: 'Riveting crime sagas, relentless psychological thrillers, and uncompromising dramatic tension.',
    explanation: 'Targeted noir crime, high-wire thrillers, and psychological depth that keep pulse rates elevated.',
    color: '#E05252',
    genreIds: '80,53,27',
    sortBy: 'popularity.desc',
    iconComponent: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
        h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
      ])
    }
  },
  {
    id: 'romantic',
    name: 'Romantic',
    tagline: 'Intimacy, longing, and chemistry',
    description: 'Poetic romances, poignant relationship dramas, and unforgettable soulmate connections.',
    explanation: 'Curated romance and relationship dramas celebrating emotional vulnerability and cinematic intimacy.',
    color: '#F472B6',
    genreIds: '10749,18',
    sortBy: 'vote_average.desc',
    iconComponent: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
        h('path', { d: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' })
      ])
    }
  },
  {
    id: 'adrenaline-rush',
    name: 'Adrenaline Rush',
    tagline: 'High velocity, spectacle, and daring feats',
    description: 'Electrifying action choreography, globe-trotting quests, and cinematic thrills.',
    explanation: 'Pulsating action choreography, breathless setpieces, and heroic adventures for maximum sensory impact.',
    color: '#FB923C',
    genreIds: '28,12',
    sortBy: 'popularity.desc',
    iconComponent: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
        h('circle', { cx: '12', cy: '12', r: '10' }),
        h('polyline', { points: '12 6 12 12 16 14' })
      ])
    }
  },
  {
    id: 'weekend-chill',
    name: 'Weekend Chill',
    tagline: 'Cozy immersion, musicality, and ease',
    description: 'Fascinating documentaries, sublime musical journeys, and relaxed, aesthetic storytelling.',
    explanation: 'Engaging real-world documentaries and easy-flowing comedy designed to unwind after a demanding week.',
    color: '#4ADE80',
    genreIds: '99,10402,35',
    sortBy: 'popularity.desc',
    iconComponent: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
        h('path', { d: 'M9 18V5l12-2v13' }),
        h('circle', { cx: '6', cy: '18', r: '3' }),
        h('circle', { cx: '18', cy: '16', r: '3' })
      ])
    }
  }
]

// State
const selectedMood = ref(moodOptions[0])
const selectedEra = ref('any')
const minRating = ref('7')
const curatedMovies = ref([])
const hasSearched = ref(false)
const isLoading = ref(false)
const error = ref(null)
const pagePoolIndex = ref(1)

function selectMood(mood) {
  selectedMood.value = mood
}

function handleTokenConfigured() {
  hasToken.value = hasTmdbToken()
}

async function findMovies(resetPage = true) {
  if (!selectedMood.value || !hasToken.value) return

  if (resetPage) {
    pagePoolIndex.value = 1
  }

  isLoading.value = true
  error.value = null
  hasSearched.value = true

  try {
    const params = {
      page: pagePoolIndex.value,
      sortBy: selectedMood.value.sortBy,
      genreId: selectedMood.value.genreIds,
      minRating: Number(minRating.value)
    }

    // Era constraints
    if (selectedEra.value === 'modern') {
      params.year = 2024
    } else if (selectedEra.value === '2010s') {
      params.year = 2017
    } else if (selectedEra.value === '2000s') {
      params.year = 2005
    } else if (selectedEra.value === 'classics') {
      params.year = 1994
    }

    const res = await discoverMovies(params)
    const normalized = (res.results || []).map(normalizeTmdbMovie).filter(Boolean)
    curatedMovies.value = normalized.slice(0, 12)
  } catch (err) {
    error.value = err.message || 'Unable to generate mood recommendations.'
  } finally {
    isLoading.value = false
  }
}

function reshuffleSelection() {
  // Cycle page between 1 and 4 for fresh recommendations
  pagePoolIndex.value = (pagePoolIndex.value % 4) + 1
  findMovies(false)
}

function resetAndRetry() {
  selectedEra.value = 'any'
  minRating.value = '6.5'
  findMovies(true)
}

onMounted(() => {
  hasToken.value = hasTmdbToken()
})
</script>

<style scoped>
.mood-match-view {
  min-height: 100vh;
  padding-top: var(--space-2xl);
  padding-bottom: var(--space-4xl);
}

.mood-header {
  margin-bottom: var(--space-2xl);
}

.mood-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-gold);
}

.mood-title {
  font-size: 2.6rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 4px 0 8px;
}

.mood-subtitle {
  font-size: 1.05rem;
  color: var(--text-secondary);
  max-width: 680px;
}

.step-label-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: var(--space-lg);
}

.step-indicator {
  padding: 2px 8px;
  background: var(--accent-gold);
  color: var(--bg-base);
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
}

.step-heading {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
}

@media (max-width: 900px) {
  .mood-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 580px) {
  .mood-grid {
    grid-template-columns: 1fr;
  }
}

/* Controls */
.controls-section {
  margin-bottom: var(--space-3xl);
}

.controls-card {
  display: flex;
  align-items: flex-end;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  flex-wrap: wrap;
}

.control-group {
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.select-wrapper {
  position: relative;
}

.era-select {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
}

.era-select:focus {
  border-color: var(--accent-gold);
}

.action-btn-group {
  display: flex;
  align-items: center;
}

.btn-match {
  padding: 11px 24px;
  font-size: 0.95rem;
}

.match-icon {
  width: 16px;
  height: 16px;
}

/* Results */
.recommendations-results {
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-subtle);
}

.results-header-box {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
  flex-wrap: wrap;
}

.results-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-gold);
}

.results-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 2px 0 4px;
}

.results-mood-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  max-width: 700px;
}

.btn-reshuffle {
  padding: 9px 18px;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.reshuffle-icon {
  width: 15px;
  height: 15px;
}

.curated-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--space-xl) var(--space-md);
}

@media (max-width: 1280px) {
  .curated-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .curated-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .curated-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-md) var(--space-xs);
  }
}

@media (max-width: 480px) {
  .curated-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
