/**
 * VANTA CINEMA - TMDB Service
 * Documentation: https://developer.themoviedb.org/
 */

import { request, ApiError } from './apiClient'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

/**
 * Retrieve current active token from Vite environment or user session
 */
export function getTmdbToken() {
  const envToken = import.meta.env.VITE_TMDB_READ_TOKEN
  if (envToken && envToken !== 'your_tmdb_read_access_token_here' && envToken.trim().length > 10) {
    return envToken.trim()
  }
  // Optional runtime override for testing/reviewing
  try {
    const sessionToken = localStorage.getItem('vanta_runtime_tmdb_token') || sessionStorage.getItem('vanta_runtime_tmdb_token')
    if (sessionToken && sessionToken.trim().length > 10) {
      return sessionToken.trim()
    }
  } catch {
    // localStorage may be disabled or restricted
  }
  return null
}

export function setRuntimeTmdbToken(token) {
  try {
    if (token) {
      localStorage.setItem('vanta_runtime_tmdb_token', token.trim())
    } else {
      localStorage.removeItem('vanta_runtime_tmdb_token')
    }
  } catch {
    // ignore
  }
}

export function hasTmdbToken() {
  return !!getTmdbToken()
}

/**
 * Helper to construct authorized request headers
 */
function getAuthHeaders() {
  const token = getTmdbToken()
  if (!token) {
    const error = new ApiError(
      'TMDB Read Access Token is not configured. Please add VITE_TMDB_READ_TOKEN in your .env file.',
      401,
      TMDB_BASE_URL
    )
    error.isMissingToken = true
    throw error
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json;charset=utf-8'
  }
}

/**
 * Internal helper to call TMDB endpoints with query parameters
 */
async function tmdbFetch(endpoint, params = {}, options = {}) {
  const headers = getAuthHeaders()
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
  
  // Default language
  url.searchParams.set('language', 'en-US')
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }

  return await request(url.toString(), {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {})
    }
  })
}

// ==========================================
// TMDB Image Helpers
// ==========================================

export function getTmdbPosterUrl(path, size = 'w500') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export function getTmdbBackdropUrl(path, size = 'w1280') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export function getTmdbProfileUrl(path, size = 'w185') {
  if (!path) return null
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

// ==========================================
// TMDB API Endpoints
// ==========================================

/**
 * Fetch movies trending this week
 */
export async function getTrendingMovies(page = 1, options = {}) {
  return tmdbFetch('/trending/movie/week', { page }, options)
}

/**
 * Fetch popular movies
 */
export async function getPopularMovies(page = 1, options = {}) {
  return tmdbFetch('/movie/popular', { page }, options)
}

/**
 * Fetch top-rated movies
 */
export async function getTopRatedMovies(page = 1, options = {}) {
  return tmdbFetch('/movie/top_rated', { page }, options)
}

/**
 * Fetch movie genre list
 */
export async function getMovieGenres(options = {}) {
  return tmdbFetch('/genre/movie/list', {}, options)
}

/**
 * Search movies by keyword
 */
export async function searchMovies(query, page = 1, options = {}) {
  return tmdbFetch('/search/movie', {
    query,
    page,
    include_adult: false
  }, options)
}

/**
 * Structured movie discovery
 * Supports sorting, genres, release year, minimum rating
 */
export async function discoverMovies({
  page = 1,
  sortBy = 'popularity.desc',
  genreId = null,
  year = null,
  minRating = null,
  options = {}
} = {}) {
  const params = {
    page,
    sort_by: sortBy,
    include_adult: false,
    include_video: false
  }

  if (genreId) {
    params.with_genres = genreId
  }
  if (year) {
    params.primary_release_year = year
  }
  if (minRating) {
    params['vote_average.gte'] = minRating
    params['vote_count.gte'] = 50 // Avoid obscure items with 1 vote
  }

  return tmdbFetch('/discover/movie', params, options)
}

/**
 * Fetch movie details with appended credits, videos, recommendations, and similar
 */
export async function getMovieDetails(movieId, options = {}) {
  return tmdbFetch(
    `/movie/${movieId}`,
    { append_to_response: 'credits,videos,recommendations,similar' },
    options
  )
}
