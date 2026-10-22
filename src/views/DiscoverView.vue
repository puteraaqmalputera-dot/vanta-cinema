<template>
  <div class="discover-view" id="top">
    <!-- Configuration helper banner if TMDB token is missing -->
    <div class="container config-container" v-if="!hasToken">
      <ConfigBanner @configured="loadContent" />
    </div>

    <!-- ======================================================== -->
    <!-- SECTION 1: CINEMATIC HERO SPOTLIGHT (TMDB - UNIQUE API)   -->
    <!-- ======================================================== -->
    <section class="hero-section" aria-label="Featured Cinema Hero">
      <!-- Loading Hero Skeleton -->
      <div v-if="isLoadingTrending && !heroMovie" class="hero-skeleton skeleton" />

      <!-- Loaded Hero Slider -->
      <div v-else-if="heroMovie" class="hero-content-wrapper">
        <!-- Background Backdrop -->
        <div class="hero-backdrop-container">
          <img 
            :src="heroMovie.backdropUrl || heroMovie.posterUrl" 
            :alt="heroMovie.title"
            class="hero-backdrop-image"
          />
          <div class="hero-overlay-horizontal" />
          <div class="hero-overlay-vertical" />
        </div>

        <!-- Foreground Hero Details -->
        <div class="hero-foreground container">
          <div class="hero-details">
            <div class="hero-badge-row">
              <span class="spotlight-badge">API 1 &bull; TMDB Unique</span>
              <RatingBadge 
                v-if="heroMovie.rating" 
                :rating="heroMovie.rating" 
                size="md" 
                :show-scale="true" 
              />
              <span v-if="heroMovie.year" class="hero-meta-year">{{ heroMovie.year }}</span>
            </div>

            <h1 class="hero-title">{{ heroMovie.title }}</h1>

            <p class="hero-synopsis">{{ heroMovie.overview }}</p>

            <div class="hero-actions">
              <RouterLink 
                :to="{ name: 'movie-details', params: { id: heroMovie.rawId } }" 
                class="btn btn-primary hero-btn-main"
              >
                <span>View Details</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-arrow">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </RouterLink>

              <button 
                v-if="heroTrailerKey" 
                type="button" 
                class="btn btn-secondary"
                @click="openHeroTrailer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" class="btn-play-icon">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Watch Trailer</span>
              </button>

              <WatchlistButton :media="heroMovie" variant="button" />
            </div>
          </div>

          <!-- Hero Slide Selector Controls -->
          <div v-if="trendingMovies.length > 1" class="hero-controls">
            <button 
              type="button" 
              class="hero-nav-btn" 
              aria-label="Previous hero slide"
              @click="prevSlide"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div class="hero-dots">
              <button
                v-for="(_, idx) in heroSlides"
                :key="idx"
                type="button"
                class="hero-dot"
                :class="{ 'is-active': activeSlideIndex === idx }"
                :aria-label="`Slide ${idx + 1}`"
                @click="setSlide(idx)"
              />
            </div>

            <button 
              type="button" 
              class="hero-nav-btn" 
              aria-label="Next hero slide"
              @click="nextSlide"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Container -->
    <main class="container discover-main">
      
      <!-- ======================================================== -->
      <!-- SECTION 2: MOVIES SHOWCASE (TMDB - API 1 UNIQUE)         -->
      <!-- ======================================================== -->
      <section id="movies-section" class="content-section" aria-labelledby="heading-trending">
        <SectionHeader 
          id="heading-trending"
          title="Trending Movies This Week" 
          eyebrow="API 1 — TMDB API (Compulsory Unique)" 
          link-to="/movies" 
          link-text="Open Full Movie Explorer"
        />

        <div v-if="isLoadingTrending" class="carousel-skeleton-wrap">
          <SkeletonGrid :count="6" :columns="6" />
        </div>

        <ErrorState 
          v-else-if="trendingError"
          title="Unable to load trending films"
          :message="trendingError"
          @retry="loadTrending"
        />

        <SectionCarousel v-else-if="trendingMovies.length">
          <div 
            v-for="movie in trendingMovies" 
            :key="movie.entityId" 
            class="carousel-item-wrap"
          >
            <MovieCard :movie="movie" />
          </div>
        </SectionCarousel>
      </section>

      <!-- Popular Movies Sub-row -->
      <section class="content-section" aria-labelledby="heading-popular">
        <SectionHeader 
          id="heading-popular"
          title="Popular Motion Pictures" 
          eyebrow="Audience Favorites &bull; TMDB" 
          link-to="/movies?sort=popularity.desc" 
          link-text="View All Popular"
        />

        <div v-if="isLoadingPopular" class="carousel-skeleton-wrap">
          <SkeletonGrid :count="6" :columns="6" />
        </div>

        <ErrorState 
          v-else-if="popularError"
          title="Unable to load popular films"
          :message="popularError"
          @retry="loadPopular"
        />

        <SectionCarousel v-else-if="popularMovies.length">
          <div 
            v-for="movie in popularMovies" 
            :key="movie.entityId" 
            class="carousel-item-wrap"
          >
            <MovieCard :movie="movie" />
          </div>
        </SectionCarousel>
      </section>

      <!-- Browse by Genre Chips -->
      <section class="content-section genre-browse-section" aria-labelledby="heading-genres">
        <SectionHeader 
          id="heading-genres"
          title="Browse Cinema by Genre" 
          eyebrow="Curated Styles" 
          link-to="/movies" 
          link-text="Open Catalog"
        />

        <div class="genre-chips-wrap">
          <GenrePill 
            v-for="genre in popularGenres" 
            :key="genre.id"
            :name="genre.name"
            :clickable="true"
            size="md"
            @click="navigateToGenre(genre.id)"
          />
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- SECTION 3: TV SERIES & AIRING SCHEDULE (TVmaze - API 2)  -->
      <!-- ======================================================== -->
      <section id="tv-section" class="content-section tv-spotlight-section" aria-labelledby="heading-tv-spotlight">
        <SectionHeader 
          id="heading-tv-spotlight"
          title="Television Series Spotlight" 
          eyebrow="API 2 — TVmaze API (Shared 2nd API)" 
          link-to="/tv" 
          link-text="Open Full TV Explorer"
        />

        <div v-if="isLoadingTv" class="carousel-skeleton-wrap">
          <SkeletonGrid :count="6" :columns="6" />
        </div>

        <ErrorState 
          v-else-if="tvError"
          title="Unable to load television spotlight"
          :message="tvError"
          @retry="loadTvSpotlight"
        />

        <SectionCarousel v-else-if="tvShows.length">
          <div 
            v-for="show in tvShows" 
            :key="show.entityId" 
            class="carousel-item-wrap"
          >
            <TVShowCard :show="show" />
          </div>
        </SectionCarousel>

        <!-- Live TV Airing Today Schedule Grid -->
        <div class="home-schedule-wrap">
          <div class="home-schedule-header">
            <h3 class="home-schedule-title">
              <span class="live-dot" />
              <span>Airing Today on US Broadcasts (Live Schedule)</span>
            </h3>
            <span class="schedule-provider">Powered by TVmaze Schedule</span>
          </div>

          <div v-if="isLoadingSchedule" class="schedule-loading-grid">
            <div v-for="n in 4" :key="n" class="skeleton schedule-item-skeleton" />
          </div>

          <div v-else-if="scheduleEpisodes.length" class="home-schedule-grid">
            <article 
              v-for="item in scheduleEpisodes" 
              :key="item.id" 
              class="home-schedule-card"
            >
              <div class="schedule-time">{{ item.airtime || 'TBD' }}</div>
              <div class="schedule-details">
                <RouterLink 
                  :to="{ name: 'tv-details', params: { id: item.show.id } }"
                  class="schedule-title"
                >
                  {{ item.show.name }}
                </RouterLink>
                <div class="schedule-sub">
                  <span class="ep-tag">S{{ item.season }}E{{ item.number }}</span>
                  <span class="ep-text">{{ item.name }}</span>
                </div>
                <div class="schedule-net">
                  {{ item.show.network?.name || item.show.webChannel?.name || 'Broadcast' }}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- SECTION 4: UNIVERSITY DIRECTORY (API 3 - SHARED)         -->
      <!-- ======================================================== -->
      <section id="universities-section" class="content-section universities-integrated-section" aria-labelledby="heading-uni-integrated">
        <SectionHeader 
          id="heading-uni-integrated"
          title="University & Academic Directory" 
          eyebrow="API 3 — Hipo Universities API (Shared 3rd API)" 
          description="Providing verified higher education details: University Name, Country, and Official Website links."
          link-to="/universities" 
          link-text="Open Full Directory"
        />

        <!-- University Filters (Country Pills & Search) -->
        <div class="uni-home-filters">
          <!-- Quick Country Pills -->
          <div class="country-pills-row" role="tablist" aria-label="Country Filter Options">
            <button
              v-for="c in quickCountries"
              :key="c.value"
              type="button"
              class="country-pill"
              :class="{ 'is-active': selectedUniCountry === c.value }"
              :aria-selected="selectedUniCountry === c.value"
              @click="changeUniCountry(c.value)"
            >
              <span>{{ c.label }}</span>
            </button>
          </div>

          <!-- University Name Search Bar -->
          <div class="uni-search-row">
            <SearchInput 
              v-model="uniSearchInput"
              :is-loading="isLoadingUni"
              placeholder="Search university by name (e.g. Malaya, Harvard, Oxford, Tokyo)..."
              aria-label="Search university directory"
              @clear="clearUniSearch"
            />
          </div>
        </div>

        <!-- University Results Status -->
        <div class="uni-results-meta">
          <span v-if="isLoadingUni">Fetching university details...</span>
          <span v-else>
            Displaying <strong>{{ universitiesList.length }}</strong> universities in 
            <strong>{{ selectedUniCountry === 'all' ? 'Worldwide' : selectedUniCountry }}</strong>
          </span>
          <div class="uni-live-badge">
            <span class="live-dot" />
            <span>Live Hipo API Connected</span>
          </div>
        </div>

        <!-- Loading Skeletons -->
        <div v-if="isLoadingUni" class="universities-home-grid">
          <div v-for="n in 6" :key="n" class="skeleton skeleton-uni-box" />
        </div>

        <!-- Error State with Retry -->
        <ErrorState 
          v-else-if="uniError"
          title="Unable to load university directory"
          :message="uniError"
          @retry="loadUniversities"
        />

        <!-- Empty State with Reset -->
        <EmptyState 
          v-else-if="!isLoadingUni && universitiesList.length === 0"
          title="No Universities Found"
          :message="`No institution matched '${uniSearchQuery}' in ${selectedUniCountry}.`"
          action-text="Reset to Malaysia"
          @action="resetUniFilters"
        />

        <!-- Universities Grid -->
        <div v-else class="universities-home-grid">
          <UniversityCard 
            v-for="uni in universitiesList.slice(0, 9)" 
            :key="uni.id" 
            :university="uni" 
          />
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- SECTION 5: MOOD MATCH ENGINE (SIGNATURE INTERACTIVE)     -->
      <!-- ======================================================== -->
      <section id="mood-section" class="content-section mood-interactive-section" aria-labelledby="heading-mood-match">
        <SectionHeader 
          id="heading-mood-match"
          title="Mood Match Cinema Engine" 
          eyebrow="Interactive Recommendation System" 
          description="Select your emotional wavelength to curate matched films using rule-based discovery."
        />

        <div class="mood-cards-row">
          <MoodCard
            v-for="mood in moodOptions"
            :key="mood.id"
            :mood="mood"
            :is-selected="activeMood?.id === mood.id"
            @select="selectHomeMood"
          />
        </div>

        <!-- Action Bar -->
        <div class="mood-action-bar">
          <div class="mood-chosen-text">
            <span>Current Mood: </span>
            <strong :style="{ color: activeMood?.color }">{{ activeMood?.name }}</strong>
            <span class="mood-explanation-snippet">&bull; {{ activeMood?.explanation }}</span>
          </div>

          <button 
            type="button" 
            class="btn btn-primary btn-find-mood"
            :disabled="isLoadingMood"
            @click="findHomeMoodMovies(true)"
          >
            <span v-if="!isLoadingMood">Find Mood Films</span>
            <span v-else>Curating...</span>
          </button>
        </div>

        <!-- Mood Results -->
        <div v-if="isLoadingMood" class="mood-results-loading">
          <SkeletonGrid :count="6" :columns="6" />
        </div>

        <div v-else-if="moodMovies.length" class="mood-results-container">
          <div class="mood-results-grid">
            <MovieCard 
              v-for="m in moodMovies" 
              :key="m.entityId" 
              :movie="m" 
            />
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- SECTION 6: WATCHLIST VAULT (LOCAL STORAGE PINIA STORE)   -->
      <!-- ======================================================== -->
      <section id="watchlist-section" class="content-section watchlist-preview-section" aria-labelledby="heading-watchlist-vault">
        <SectionHeader 
          id="heading-watchlist-vault"
          title="Your Saved Watchlist Vault" 
          eyebrow="Client Storage &bull; Pinia + localStorage" 
          link-to="/watchlist" 
          link-text="Open Full Watchlist"
        />

        <div v-if="watchlistStore.totalCount > 0" class="watchlist-home-grid">
          <WatchlistItem 
            v-for="item in watchlistStore.items.slice(0, 4)" 
            :key="item.entityId" 
            :item="item" 
          />
        </div>

        <EmptyState 
          v-else
          title="Your Vault is Empty"
          message="Click the bookmark icon on any movie or TV series above to save it to your personal watchlist."
          action-text="Browse Movies Above"
          action-to="#movies-section"
        />
      </section>
    </main>

    <!-- Trailer Modal -->
    <TrailerModal 
      :is-open="isTrailerOpen" 
      :video-key="heroTrailerKey" 
      :title="heroMovie?.title" 
      @close="isTrailerOpen = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getTrendingMovies, 
  getPopularMovies, 
  getTopRatedMovies, 
  getMovieDetails,
  discoverMovies,
  hasTmdbToken 
} from '@/services/tmdb'
import { getShowsCatalog, getTvSchedule } from '@/services/tvmaze'
import { getUniversities } from '@/services/universities'
import { normalizeTmdbMovie, normalizeTvmazeShow } from '@/services/normalize'
import { useWatchlistStore } from '@/stores/watchlist'

import SectionHeader from '@/components/common/SectionHeader.vue'
import SectionCarousel from '@/components/common/SectionCarousel.vue'
import RatingBadge from '@/components/common/RatingBadge.vue'
import GenrePill from '@/components/common/GenrePill.vue'
import MovieCard from '@/components/movie/MovieCard.vue'
import TVShowCard from '@/components/tv/TVShowCard.vue'
import UniversityCard from '@/components/university/UniversityCard.vue'
import WatchlistButton from '@/components/common/WatchlistButton.vue'
import WatchlistItem from '@/components/watchlist/WatchlistItem.vue'
import MoodCard from '@/components/mood/MoodCard.vue'
import TrailerModal from '@/components/common/TrailerModal.vue'
import SkeletonGrid from '@/components/common/SkeletonGrid.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ConfigBanner from '@/components/common/ConfigBanner.vue'
import SearchInput from '@/components/common/SearchInput.vue'

const router = useRouter()
const watchlistStore = useWatchlistStore()
const hasToken = ref(hasTmdbToken())

// ==========================================
// API 1: TMDB Movie State
// ==========================================
const trendingMovies = ref([])
const popularMovies = ref([])
const topRatedMovies = ref([])
const isLoadingTrending = ref(true)
const isLoadingPopular = ref(true)
const trendingError = ref(null)
const popularError = ref(null)

const activeSlideIndex = ref(0)
const isTrailerOpen = ref(false)
const heroTrailerKey = ref(null)

const heroSlides = computed(() => trendingMovies.value.slice(0, 5))
const heroMovie = computed(() => heroSlides.value[activeSlideIndex.value] || null)

const popularGenres = [
  { id: 28, name: 'Action' },
  { id: 878, name: 'Sci-Fi' },
  { id: 18, name: 'Drama' },
  { id: 35, name: 'Comedy' },
  { id: 53, name: 'Thriller' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 16, name: 'Animation' },
  { id: 9648, name: 'Mystery' },
  { id: 99, name: 'Documentary' }
]

// ==========================================
// API 2: TVmaze Television State
// ==========================================
const tvShows = ref([])
const scheduleEpisodes = ref([])
const isLoadingTv = ref(true)
const isLoadingSchedule = ref(true)
const tvError = ref(null)

// ==========================================
// API 3: Universities Directory State
// ==========================================
const universitiesList = ref([])
const selectedUniCountry = ref('Malaysia')
const uniSearchInput = ref('')
const uniSearchQuery = ref('')
const isLoadingUni = ref(true)
const uniError = ref(null)

const quickCountries = [
  { label: 'Malaysia 🇲🇾', value: 'Malaysia' },
  { label: 'United States 🇺🇸', value: 'United States' },
  { label: 'United Kingdom 🇬🇧', value: 'United Kingdom' },
  { label: 'Australia 🇦🇺', value: 'Australia' },
  { label: 'Japan 🇯🇵', value: 'Japan' },
  { label: 'All Countries 🌐', value: 'all' }
]

// ==========================================
// Interactive Mood Match State
// ==========================================
const moodOptions = [
  {
    id: 'feel-good',
    name: 'Feel Good',
    description: 'Whimsical journeys and heartwarming comedies.',
    explanation: 'Selected comedy and animation cinema calibrated for warmth.',
    color: '#FBBF24',
    genreIds: '35,16',
    sortBy: 'popularity.desc',
    iconComponent: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
        h('circle', { cx: '12', cy: '12', r: '10' }),
        h('path', { d: 'M8 14s1.5 2 4 2 4-2 4-2' })
      ])
    }
  },
  {
    id: 'mind-bending',
    name: 'Mind-Bending',
    description: 'Sci-fi, mysteries, and cerebral thrillers.',
    explanation: 'Complex narrative twists and reality questions.',
    color: '#818CF8',
    genreIds: '878,9648',
    sortBy: 'vote_average.desc',
    iconComponent: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
        h('path', { d: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z' })
      ])
    }
  },
  {
    id: 'adrenaline-rush',
    name: 'Adrenaline Rush',
    description: 'High velocity stunts and epic adventures.',
    explanation: 'Pulsating action choreography and daring sequences.',
    color: '#FB923C',
    genreIds: '28,12',
    sortBy: 'popularity.desc',
    iconComponent: {
      render: () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
        h('polygon', { points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2' })
      ])
    }
  }
]

const activeMood = ref(moodOptions[0])
const moodMovies = ref([])
const isLoadingMood = ref(false)

// ==========================================
// Handlers & Functions
// ==========================================

function prevSlide() {
  if (heroSlides.value.length === 0) return
  activeSlideIndex.value = (activeSlideIndex.value - 1 + heroSlides.value.length) % heroSlides.value.length
  fetchHeroTrailer()
}

function nextSlide() {
  if (heroSlides.value.length === 0) return
  activeSlideIndex.value = (activeSlideIndex.value + 1) % heroSlides.value.length
  fetchHeroTrailer()
}

function setSlide(idx) {
  activeSlideIndex.value = idx
  fetchHeroTrailer()
}

function navigateToGenre(genreId) {
  router.push({ name: 'movies', query: { genre: String(genreId) } })
}

async function fetchHeroTrailer() {
  heroTrailerKey.value = null
  const current = heroMovie.value
  if (!current || !hasToken.value) return

  try {
    const details = await getMovieDetails(current.rawId)
    const videos = details.videos?.results || []
    const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official)
      || videos.find(v => v.site === 'YouTube' && v.type === 'Trailer')
      || videos.find(v => v.site === 'YouTube')
    
    if (trailer) {
      heroTrailerKey.value = trailer.key
    }
  } catch {
    // ignore
  }
}

function openHeroTrailer() {
  if (heroTrailerKey.value) {
    isTrailerOpen.value = true
  }
}

// API 1: TMDB Loaders
async function loadTrending() {
  isLoadingTrending.value = true
  trendingError.value = null
  try {
    const res = await getTrendingMovies(1)
    trendingMovies.value = (res.results || []).map(normalizeTmdbMovie).filter(Boolean)
    if (trendingMovies.value.length) {
      fetchHeroTrailer()
    }
  } catch (err) {
    trendingError.value = err.message
  } finally {
    isLoadingTrending.value = false
  }
}

async function loadPopular() {
  isLoadingPopular.value = true
  popularError.value = null
  try {
    const res = await getPopularMovies(1)
    popularMovies.value = (res.results || []).map(normalizeTmdbMovie).filter(Boolean)
  } catch (err) {
    popularError.value = err.message
  } finally {
    isLoadingPopular.value = false
  }
}

// API 2: TVmaze Loaders
async function loadTvSpotlight() {
  isLoadingTv.value = true
  tvError.value = null
  try {
    const shows = await getShowsCatalog(0)
    const curated = shows
      .filter(s => s.rating?.average && s.rating.average >= 7.8 && s.image)
      .slice(0, 16)
      .map(normalizeTvmazeShow)
    tvShows.value = curated.length ? curated : shows.slice(0, 16).map(normalizeTvmazeShow)
  } catch (err) {
    tvError.value = err.message
  } finally {
    isLoadingTv.value = false
  }
}

async function loadTvSchedule() {
  isLoadingSchedule.value = true
  try {
    const today = new Date().toISOString().split('T')[0]
    const episodes = await getTvSchedule(today, 'US')
    scheduleEpisodes.value = (episodes || []).filter(e => e.show && e.show.id).slice(0, 4)
  } catch {
    // ignore
  } finally {
    isLoadingSchedule.value = false
  }
}

// API 3: Universities Directory Loaders
let uniDebounceTimer = null
watch(uniSearchInput, (newVal) => {
  if (uniDebounceTimer) clearTimeout(uniDebounceTimer)
  uniDebounceTimer = setTimeout(() => {
    uniSearchQuery.value = newVal.trim()
    loadUniversities()
  }, 350)
})

function changeUniCountry(cVal) {
  selectedUniCountry.value = cVal
  loadUniversities()
}

function clearUniSearch() {
  uniSearchInput.value = ''
  uniSearchQuery.value = ''
  loadUniversities()
}

function resetUniFilters() {
  uniSearchInput.value = ''
  uniSearchQuery.value = ''
  selectedUniCountry.value = 'Malaysia'
  loadUniversities()
}

async function loadUniversities() {
  isLoadingUni.value = true
  uniError.value = null
  try {
    const list = await getUniversities({
      country: selectedUniCountry.value,
      name: uniSearchQuery.value
    })
    universitiesList.value = list
  } catch (err) {
    uniError.value = err.message || 'Unable to load university directory.'
  } finally {
    isLoadingUni.value = false
  }
}

// Mood Match Handler
function selectHomeMood(mood) {
  activeMood.value = mood
  findHomeMoodMovies(true)
}

async function findHomeMoodMovies(reset = true) {
  if (!activeMood.value || !hasToken.value) return
  isLoadingMood.value = true
  try {
    const res = await discoverMovies({
      page: 1,
      sortBy: activeMood.value.sortBy,
      genreId: activeMood.value.genreIds,
      minRating: 7.0
    })
    moodMovies.value = (res.results || []).map(normalizeTmdbMovie).filter(Boolean).slice(0, 6)
  } catch {
    // ignore
  } finally {
    isLoadingMood.value = false
  }
}

function loadContent() {
  hasToken.value = hasTmdbToken()
  if (hasToken.value) {
    loadTrending()
    loadPopular()
    findHomeMoodMovies(true)
  } else {
    isLoadingTrending.value = false
    isLoadingPopular.value = false
  }
  loadTvSpotlight()
  loadTvSchedule()
  loadUniversities()
}

onMounted(() => {
  loadContent()
})
</script>

<style scoped>
.discover-view {
  min-height: 100vh;
  padding-bottom: var(--space-4xl);
}

.config-container {
  padding-top: var(--space-lg);
}

/* Hero Section */
.hero-section {
  position: relative;
  width: 100%;
  min-height: 80vh;
  display: flex;
  align-items: flex-end;
  background: var(--bg-base);
  overflow: hidden;
}

.hero-skeleton {
  width: 100%;
  height: 80vh;
}

.hero-content-wrapper {
  position: relative;
  width: 100%;
  min-height: 80vh;
  display: flex;
  align-items: flex-end;
}

.hero-backdrop-container {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.hero-backdrop-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  transform: scale(1.02);
  transition: opacity 0.5s ease-in-out;
}

.hero-overlay-horizontal {
  position: absolute;
  inset: 0;
  background: var(--bg-hero-horizontal);
}

.hero-overlay-vertical {
  position: absolute;
  inset: 0;
  background: var(--bg-hero-overlay);
}

.hero-foreground {
  position: relative;
  z-index: 2;
  width: 100%;
  padding-top: calc(var(--header-height) + 40px);
  padding-bottom: var(--space-3xl);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.hero-details {
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.hero-badge-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.spotlight-badge {
  padding: 3px 10px;
  background: var(--accent-gold-muted);
  border: 1px solid var(--accent-gold);
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-gold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.hero-meta-year {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.hero-title {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--text-primary);
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.7);
  letter-spacing: -0.02em;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
}

.hero-synopsis {
  font-size: 1.05rem;
  color: #D1D1D8;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  margin-top: 4px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  flex-wrap: wrap;
}

.btn-arrow {
  width: 16px;
  height: 16px;
}

.btn-play-icon {
  width: 14px;
  height: 14px;
  color: var(--accent-gold);
}

.hero-controls {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-top: var(--space-2xl);
}

.hero-nav-btn {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-pill);
  background: rgba(14, 14, 18, 0.8);
  border: 1px solid var(--border-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.hero-nav-btn:hover {
  background: rgba(28, 28, 35, 0.95);
  border-color: var(--accent-gold);
  color: var(--text-primary);
}

.nav-icon {
  width: 18px;
  height: 18px;
}

.hero-dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-dot {
  width: 24px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-pill);
  transition: all var(--transition-fast);
}

.hero-dot.is-active {
  width: 48px;
  background: var(--accent-gold);
}

/* Main Content Sections */
.discover-main {
  display: flex;
  flex-direction: column;
  gap: var(--space-4xl);
  padding-top: var(--space-3xl);
}

.content-section {
  position: relative;
  width: 100%;
  scroll-margin-top: 90px;
}

.carousel-item-wrap {
  width: 200px;
}

@media (max-width: 768px) {
  .carousel-item-wrap {
    width: 150px;
  }
}

.genre-chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  padding: var(--space-md) 0;
}

/* TV Schedule Sub-grid */
.home-schedule-wrap {
  margin-top: var(--space-2xl);
  padding: var(--space-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
}

.home-schedule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
  flex-wrap: wrap;
  gap: 8px;
}

.home-schedule-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.05rem;
  color: var(--text-primary);
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ADE80;
  box-shadow: 0 0 6px #4ADE80;
}

.schedule-provider {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.home-schedule-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-md);
}

.schedule-loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-md);
}

.schedule-item-skeleton {
  height: 70px;
  border-radius: var(--radius-md);
}

.home-schedule-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
}

.schedule-time {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.8rem;
  color: var(--accent-gold);
  font-weight: 600;
}

.schedule-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.schedule-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.schedule-title:hover {
  color: var(--accent-gold);
}

.schedule-sub {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ep-tag {
  color: var(--accent-gold);
  font-weight: 600;
}

.schedule-net {
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* SECTION 4: Integrated Universities */
.universities-integrated-section {
  background: linear-gradient(180deg, rgba(20, 24, 28, 0.6) 0%, rgba(14, 16, 20, 0.9) 100%);
  border: 1px solid rgba(74, 222, 128, 0.2);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
}

.uni-home-filters {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.country-pills-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.country-pill {
  padding: 6px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-pill);
  color: var(--text-secondary);
  font-size: 0.825rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.country-pill:hover {
  color: var(--text-primary);
  background: var(--bg-card-hover);
}

.country-pill.is-active {
  background: rgba(74, 222, 128, 0.15);
  border-color: #4ADE80;
  color: #4ADE80;
  font-weight: 600;
}

.uni-search-row {
  max-width: 600px;
}

.uni-results-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
  font-size: 0.875rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
  gap: 8px;
}

.uni-results-meta strong {
  color: var(--text-primary);
}

.uni-live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #4ADE80;
}

.universities-home-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-md);
}

@media (max-width: 1024px) {
  .universities-home-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .universities-home-grid {
    grid-template-columns: 1fr;
  }
}

.skeleton-uni-box {
  height: 160px;
  border-radius: var(--radius-lg);
}

/* SECTION 5: Interactive Mood Match */
.mood-interactive-section {
  padding: var(--space-2xl);
  background: linear-gradient(135deg, #18181D 0%, #101013 100%);
  border: 1px solid var(--accent-gold-border);
  border-radius: var(--radius-xl);
}

.mood-cards-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

@media (max-width: 768px) {
  .mood-cards-row {
    grid-template-columns: 1fr;
  }
}

.mood-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.mood-chosen-text {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.mood-explanation-snippet {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.btn-find-mood {
  padding: 9px 20px;
  font-size: 0.9rem;
}

.mood-results-loading {
  margin-top: var(--space-lg);
}

.mood-results-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--space-md);
}

@media (max-width: 1024px) {
  .mood-results-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .mood-results-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* SECTION 6: Watchlist Preview */
.watchlist-home-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-md);
}
</style>
