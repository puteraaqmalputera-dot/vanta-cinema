/**
 * VANTA CINEMA - TVmaze Service
 * Documentation: https://www.tvmaze.com/api
 * Free public API without authentication requirement.
 */

import { request } from './apiClient'

const TVMAZE_BASE_URL = 'https://api.tvmaze.com'

/**
 * Remove HTML tags from TVmaze descriptions safely
 * @param {string} html 
 * @returns {string}
 */
export function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

/**
 * Search TV shows by title
 * @param {string} query 
 * @param {object} options 
 * @returns {Promise<Array<{ score: number, show: object }>>}
 */
export async function searchTvShows(query, options = {}) {
  if (!query || !query.trim()) return []
  const url = `${TVMAZE_BASE_URL}/search/shows?q=${encodeURIComponent(query.trim())}`
  return await request(url, options)
}

/**
 * Get browsable shows paginated
 * @param {number} page (0-indexed)
 * @param {object} options 
 * @returns {Promise<Array<object>>}
 */
export async function getShowsCatalog(page = 0, options = {}) {
  const url = `${TVMAZE_BASE_URL}/shows?page=${page}`
  return await request(url, options)
}

/**
 * Get show details with embedded cast and seasons
 * @param {string|number} showId 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export async function getShowDetails(showId, options = {}) {
  const url = `${TVMAZE_BASE_URL}/shows/${showId}?embed[]=cast&embed[]=seasons`
  return await request(url, options)
}

/**
 * Get show episodes
 * @param {string|number} showId 
 * @param {object} options 
 * @returns {Promise<Array<object>>}
 */
export async function getShowEpisodes(showId, options = {}) {
  const url = `${TVMAZE_BASE_URL}/shows/${showId}/episodes`
  return await request(url, options)
}

/**
 * Get show seasons
 * @param {string|number} showId 
 * @param {object} options 
 * @returns {Promise<Array<object>>}
 */
export async function getShowSeasons(showId, options = {}) {
  const url = `${TVMAZE_BASE_URL}/shows/${showId}/seasons`
  return await request(url, options)
}

/**
 * Get show cast
 * @param {string|number} showId 
 * @param {object} options 
 * @returns {Promise<Array<object>>}
 */
export async function getShowCast(showId, options = {}) {
  const url = `${TVMAZE_BASE_URL}/shows/${showId}/cast`
  return await request(url, options)
}

/**
 * Get TV schedule for a specific date and country
 * @param {string} date (YYYY-MM-DD)
 * @param {string} country (defaults to US)
 * @param {object} options 
 * @returns {Promise<Array<object>>}
 */
export async function getTvSchedule(date, country = 'US', options = {}) {
  const targetDate = date || new Date().toISOString().split('T')[0]
  const url = `${TVMAZE_BASE_URL}/schedule?country=${country}&date=${targetDate}`
  return await request(url, options)
}
