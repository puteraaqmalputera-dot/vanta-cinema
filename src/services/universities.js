/**
 * VANTA CINEMA - Universities API Service (3rd Third-Party API)
 * API Source: Hipo Universities API (http://universities.hipolabs.com)
 * Fallback: Official HTTPS raw repository (Hipo/university-domains-list)
 * Fulfills requirement: University details (name, country, website)
 */

import { request, ApiError } from './apiClient'

const PRIMARY_API = 'http://universities.hipolabs.com/search'
const HTTPS_FALLBACK = 'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json'

// In-memory cache for fallback catalog if needed
let fallbackCatalog = null

/**
 * Normalizes raw university object into standard contract
 */
export function normalizeUniversity(raw) {
  if (!raw) return null
  const website = (raw.web_pages && raw.web_pages.length > 0) ? raw.web_pages[0] : null
  const domain = (raw.domains && raw.domains.length > 0) ? raw.domains[0] : ''

  return {
    id: `${raw.country}_${raw.name}`.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    name: raw.name || 'Unnamed University',
    country: raw.country || 'Unknown Country',
    alphaTwoCode: raw.alpha_two_code || '',
    state: raw['state-province'] || null,
    website,
    domain
  }
}

/**
 * Fetch universities with optional country and name filter
 * @param {object} params { country?: string, name?: string, signal?: AbortSignal }
 * @returns {Promise<Array>}
 */
export async function getUniversities({ country = 'Malaysia', name = '', signal = null } = {}) {
  // If we are in an HTTPS environment in production browser, avoid mixed content blocking
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:'

  if (!isHttps) {
    try {
      const url = new URL(PRIMARY_API)
      if (country && country !== 'all') {
        url.searchParams.set('country', country)
      }
      if (name && name.trim()) {
        url.searchParams.set('name', name.trim())
      }

      const data = await request(url.toString(), { signal }, 10000)
      if (Array.isArray(data)) {
        return data.map(normalizeUniversity).filter(Boolean)
      }
    } catch (err) {
      if (err.name === 'AbortError') throw err
      console.warn('Primary Universities API failed, attempting HTTPS fallback...', err.message)
    }
  }

  // Fallback: Fetch from GitHub HTTPS source
  try {
    if (!fallbackCatalog) {
      const allData = await request(HTTPS_FALLBACK, { signal }, 12000)
      fallbackCatalog = Array.isArray(allData) ? allData : []
    }

    let filtered = fallbackCatalog

    if (country && country !== 'all') {
      const lowerCountry = country.toLowerCase()
      filtered = filtered.filter(u => u.country && u.country.toLowerCase() === lowerCountry)
    }

    if (name && name.trim()) {
      const lowerName = name.trim().toLowerCase()
      filtered = filtered.filter(u => u.name && u.name.toLowerCase().includes(lowerName))
    }

    return filtered.slice(0, 100).map(normalizeUniversity).filter(Boolean)
  } catch (fallbackErr) {
    if (fallbackErr.name === 'AbortError') throw fallbackErr
    throw new ApiError('Unable to load university directory from external service.', 0, HTTPS_FALLBACK)
  }
}
