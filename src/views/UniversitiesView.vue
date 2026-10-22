<template>
  <div class="universities-view container">
    <!-- Header -->
    <header class="directory-header">
      <div class="header-badge-row">
        <span class="directory-eyebrow">3rd Third-Party API Integration</span>
        <span class="api-tag">Hipo Universities API &bull; Shared API</span>
      </div>
      <h1 class="directory-title">University & Academic Directory</h1>
      <p class="directory-subtitle">
        Explore higher education institutions, academic cinema societies, and research universities worldwide. 
        Displaying official university details: <strong>Name</strong>, <strong>Country</strong>, and <strong>Official Website</strong>.
      </p>
    </header>

    <!-- Search & Country Filters Bar -->
    <section class="filters-panel">
      <!-- Search Bar -->
      <div class="search-bar-wrap">
        <SearchInput 
          v-model="searchInput"
          :is-loading="isLoading"
          placeholder="Search university by name (e.g. Malaya, Harvard, Oxford, Tokyo)..."
          aria-label="Search universities"
          @clear="clearSearch"
        />
      </div>

      <!-- Quick Country Pills -->
      <div class="country-pills-row" role="tablist" aria-label="Quick Country Filters">
        <button
          v-for="c in quickCountries"
          :key="c.value"
          type="button"
          class="country-pill"
          :class="{ 'is-active': selectedCountry === c.value }"
          :aria-selected="selectedCountry === c.value"
          @click="selectCountry(c.value)"
        >
          <span>{{ c.label }}</span>
        </button>
      </div>

      <!-- Country Dropdown & Clear -->
      <div class="secondary-filter-row">
        <div class="select-group">
          <label for="country-select" class="select-label">Select Country:</label>
          <div class="select-box">
            <select id="country-select" v-model="selectedCountry" class="country-dropdown">
              <option value="Malaysia">Malaysia</option>
              <option value="all">All Countries (Worldwide)</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Japan">Japan</option>
              <option value="Germany">Germany</option>
              <option value="Canada">Canada</option>
              <option value="Singapore">Singapore</option>
              <option value="France">France</option>
              <option value="Indonesia">Indonesia</option>
              <option value="India">India</option>
              <option value="China">China</option>
            </select>
            <svg class="select-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        <button 
          v-if="searchQuery || selectedCountry !== 'Malaysia'" 
          type="button" 
          class="btn-reset-filters"
          @click="resetFilters"
        >
          Reset Filters
        </button>
      </div>
    </section>

    <!-- Results Meta -->
    <div class="results-meta-bar">
      <div class="results-count">
        <span v-if="isLoading">Fetching university directory...</span>
        <span v-else>
          Showing <strong>{{ universities.length }}</strong> institutions in 
          <strong>{{ selectedCountry === 'all' ? 'Worldwide' : selectedCountry }}</strong>
        </span>
      </div>

      <div class="api-status-indicator">
        <span class="status-dot" />
        <span>Live API Connected</span>
      </div>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="isLoading" class="universities-loading">
      <div v-for="n in 6" :key="n" class="skeleton skeleton-uni-card" />
    </div>

    <!-- Error State -->
    <ErrorState 
      v-else-if="error"
      title="Unable to Load Universities"
      :message="error"
      @retry="fetchUniversities"
    />

    <!-- Empty State -->
    <EmptyState 
      v-else-if="!isLoading && universities.length === 0"
      title="No Universities Found"
      :message="`No higher education institutions matched '${searchQuery}' in ${selectedCountry}. Try adjusting your search term or select 'All Countries'.`"
      action-text="Reset to Malaysia"
      @action="resetFilters"
    />

    <!-- Results Grid -->
    <div v-else class="universities-grid">
      <UniversityCard 
        v-for="uni in universities" 
        :key="uni.id" 
        :university="uni" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getUniversities } from '@/services/universities'

import SearchInput from '@/components/common/SearchInput.vue'
import UniversityCard from '@/components/university/UniversityCard.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const searchInput = ref('')
const searchQuery = ref('')
const selectedCountry = ref('Malaysia')
const universities = ref([])
const isLoading = ref(true)
const error = ref(null)

let debounceTimer = null
let activeAbortController = null

const quickCountries = [
  { label: 'Malaysia 🇲🇾', value: 'Malaysia' },
  { label: 'United States 🇺🇸', value: 'United States' },
  { label: 'United Kingdom 🇬🇧', value: 'United Kingdom' },
  { label: 'Australia 🇦🇺', value: 'Australia' },
  { label: 'Japan 🇯🇵', value: 'Japan' },
  { label: 'Canada 🇨🇦', value: 'Canada' },
  { label: 'All Countries 🌐', value: 'all' }
]

function selectCountry(cVal) {
  selectedCountry.value = cVal
}

watch(searchInput, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchQuery.value = newVal.trim()
    fetchUniversities()
  }, 350)
})

watch(selectedCountry, () => {
  fetchUniversities()
})

function clearSearch() {
  searchInput.value = ''
  searchQuery.value = ''
  fetchUniversities()
}

function resetFilters() {
  searchInput.value = ''
  searchQuery.value = ''
  selectedCountry.value = 'Malaysia'
  fetchUniversities()
}

async function fetchUniversities() {
  if (activeAbortController) activeAbortController.abort()
  activeAbortController = new AbortController()

  isLoading.value = true
  error.value = null

  try {
    const list = await getUniversities({
      country: selectedCountry.value,
      name: searchQuery.value,
      signal: activeAbortController.signal
    })
    universities.value = list
  } catch (err) {
    if (err.name === 'AbortError') return
    error.value = err.message || 'Error occurred while querying university API.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUniversities()
})
</script>

<style scoped>
.universities-view {
  min-height: 100vh;
  padding-top: var(--space-2xl);
  padding-bottom: var(--space-4xl);
}

.directory-header {
  margin-bottom: var(--space-2xl);
}

.header-badge-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.directory-eyebrow {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-gold);
}

.api-tag {
  font-size: 0.725rem;
  font-weight: 600;
  background: rgba(214, 181, 122, 0.15);
  color: var(--accent-gold);
  border: 1px solid var(--accent-gold-border);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
}

.directory-title {
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 6px 0 8px;
}

.directory-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 700px;
  line-height: 1.6;
}

.directory-subtitle strong {
  color: var(--accent-gold);
}

/* Filters */
.filters-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  padding: var(--space-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
}

.country-pills-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.country-pill {
  padding: 6px 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-pill);
  color: var(--text-secondary);
  font-size: 0.825rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.country-pill:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.country-pill.is-active {
  background: var(--accent-gold-muted);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
  font-weight: 600;
}

.secondary-filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding-top: var(--space-xs);
  border-top: 1px solid var(--border-subtle);
  flex-wrap: wrap;
}

.select-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.select-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.select-box {
  position: relative;
}

.country-dropdown {
  appearance: none;
  background: var(--bg-elevated);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  padding: 8px 36px 8px 12px;
  font-size: 0.85rem;
  cursor: pointer;
}

.country-dropdown:focus {
  border-color: var(--accent-gold);
}

.select-caret {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--text-muted);
  pointer-events: none;
}

.btn-reset-filters {
  color: var(--accent-gold);
  font-size: 0.85rem;
  text-decoration: underline;
  cursor: pointer;
}

/* Results Meta */
.results-meta-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.results-count strong {
  color: var(--text-primary);
}

.api-status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #4ADE80;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ADE80;
  box-shadow: 0 0 6px #4ADE80;
}

/* Grid */
.universities-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-lg);
}

@media (max-width: 1024px) {
  .universities-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .universities-grid {
    grid-template-columns: 1fr;
  }
}

.universities-loading {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-lg);
}

@media (max-width: 1024px) {
  .universities-loading {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .universities-loading {
    grid-template-columns: 1fr;
  }
}

.skeleton-uni-card {
  height: 180px;
  border-radius: var(--radius-lg);
}
</style>
