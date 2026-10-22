/**
 * VANTA CINEMA - Personal Watchlist Pinia Store
 * Manages saved movies and TV shows backed by versioned browser localStorage.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'vanta_cinema_watchlist_v1'

export const useWatchlistStore = defineStore('watchlist', () => {
  // State: Array of saved media items
  const items = ref(loadInitialState())

  function loadInitialState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed
      }
      return []
    } catch (e) {
      console.warn('Failed to parse watchlist from localStorage. Initializing empty list.', e)
      return []
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    } catch (e) {
      console.error('Failed to persist watchlist to localStorage', e)
    }
  }

  // Getters
  const totalCount = computed(() => items.value.length)
  const toWatchCount = computed(() => items.value.filter(i => !i.watched).length)
  const watchedCount = computed(() => items.value.filter(i => i.watched).length)

  /**
   * Check if a composite entity ID is saved
   * @param {string} entityId 
   */
  function isInWatchlist(entityId) {
    if (!entityId) return false
    return items.value.some(item => item.entityId === entityId)
  }

  /**
   * Check if a saved entity is marked watched
   * @param {string} entityId 
   */
  function isWatched(entityId) {
    const item = items.value.find(i => i.entityId === entityId)
    return item ? !!item.watched : false
  }

  /**
   * Add or toggle item in watchlist
   * @param {object} media Normalized media entity
   */
  function toggleWatchlist(media) {
    if (!media || !media.entityId) return

    const index = items.value.findIndex(i => i.entityId === media.entityId)
    if (index > -1) {
      // Remove
      items.value.splice(index, 1)
    } else {
      // Add
      items.value.unshift({
        entityId: media.entityId,
        provider: media.provider,
        mediaType: media.mediaType,
        rawId: media.rawId,
        title: media.title,
        posterUrl: media.posterUrl,
        backdropUrl: media.backdropUrl,
        rating: media.rating,
        year: media.year,
        genres: media.genres || [],
        overview: media.overview || '',
        watched: false,
        addedAt: new Date().toISOString()
      })
    }
    persist()
  }

  /**
   * Explicitly add an item to watchlist
   */
  function addToWatchlist(media) {
    if (!media || !media.entityId) return
    if (!isInWatchlist(media.entityId)) {
      items.value.unshift({
        entityId: media.entityId,
        provider: media.provider,
        mediaType: media.mediaType,
        rawId: media.rawId,
        title: media.title,
        posterUrl: media.posterUrl,
        backdropUrl: media.backdropUrl,
        rating: media.rating,
        year: media.year,
        genres: media.genres || [],
        overview: media.overview || '',
        watched: false,
        addedAt: new Date().toISOString()
      })
      persist()
    }
  }

  /**
   * Remove item by composite entity ID
   */
  function removeFromWatchlist(entityId) {
    const index = items.value.findIndex(i => i.entityId === entityId)
    if (index > -1) {
      items.value.splice(index, 1)
      persist()
    }
  }

  /**
   * Toggle watched state of an item
   */
  function toggleWatched(entityId) {
    const item = items.value.find(i => i.entityId === entityId)
    if (item) {
      item.watched = !item.watched
      persist()
    }
  }

  /**
   * Clear all items
   */
  function clearAll() {
    items.value = []
    persist()
  }

  return {
    items,
    totalCount,
    toWatchCount,
    watchedCount,
    isInWatchlist,
    isWatched,
    toggleWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatched,
    clearAll
  }
})
