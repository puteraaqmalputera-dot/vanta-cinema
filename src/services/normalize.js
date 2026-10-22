/**
 * VANTA CINEMA - Normalization Service
 * Unifies TMDB movie and TVmaze TV show structures into consistent entity contracts.
 */

import { getTmdbPosterUrl, getTmdbBackdropUrl } from './tmdb'
import { stripHtml } from './tvmaze'

/**
 * Parses composite entity ID e.g. "tmdb:movie:123" or "tvmaze:show:456"
 */
export function parseEntityId(compositeId) {
  if (!compositeId || typeof compositeId !== 'string') return null
  const parts = compositeId.split(':')
  if (parts.length === 3) {
    return {
      provider: parts[0],
      mediaType: parts[1],
      id: parts[2]
    }
  }
  return null
}

/**
 * Normalizes a TMDB movie object into a standard media item
 */
export function normalizeTmdbMovie(movie) {
  if (!movie) return null

  const id = String(movie.id)
  const releaseDate = movie.release_date || ''
  const year = releaseDate ? releaseDate.slice(0, 4) : 'N/A'
  const rating = typeof movie.vote_average === 'number' && movie.vote_average > 0
    ? Number(movie.vote_average.toFixed(1))
    : null

  // Process genres if available as array of objects or IDs
  let genres = []
  if (Array.isArray(movie.genres)) {
    genres = movie.genres.map(g => (typeof g === 'object' ? g.name : g))
  }

  return {
    entityId: `tmdb:movie:${id}`,
    provider: 'tmdb',
    mediaType: 'movie',
    rawId: id,
    title: movie.title || movie.original_title || 'Untitled Movie',
    originalTitle: movie.original_title || '',
    tagline: movie.tagline || '',
    overview: movie.overview || 'No synopsis available.',
    posterUrl: getTmdbPosterUrl(movie.poster_path, 'w500'),
    backdropUrl: getTmdbBackdropUrl(movie.backdrop_path, 'w1280'),
    rating,
    voteCount: movie.vote_count || 0,
    releaseDate,
    year,
    runtime: movie.runtime ? formatRuntime(movie.runtime) : null,
    runtimeMinutes: movie.runtime || null,
    genres,
    language: movie.original_language ? movie.original_language.toUpperCase() : 'EN',
    popularity: movie.popularity || 0,
    detailRoute: { name: 'movie-details', params: { id } }
  }
}

/**
 * Normalizes a TVmaze show object into a standard media item
 */
export function normalizeTvmazeShow(show) {
  if (!show) return null

  const id = String(show.id)
  const premiered = show.premiered || ''
  const year = premiered ? premiered.slice(0, 4) : 'N/A'
  
  const rating = show.rating && typeof show.rating.average === 'number'
    ? Number(show.rating.average.toFixed(1))
    : null

  const posterUrl = show.image?.original || show.image?.medium || null
  const backdropUrl = show.image?.original || null

  const networkName = show.network?.name || show.webChannel?.name || 'Unknown Network'

  return {
    entityId: `tvmaze:show:${id}`,
    provider: 'tvmaze',
    mediaType: 'tv',
    rawId: id,
    title: show.name || 'Untitled Show',
    originalTitle: show.name || '',
    tagline: show.type || '',
    overview: stripHtml(show.summary) || 'No summary available.',
    posterUrl,
    backdropUrl,
    rating,
    voteCount: null,
    releaseDate: premiered,
    year,
    runtime: show.averageRuntime || show.runtime ? `${show.averageRuntime || show.runtime}m` : null,
    runtimeMinutes: show.averageRuntime || show.runtime || null,
    genres: Array.isArray(show.genres) ? show.genres : [],
    language: show.language ? show.language.toUpperCase() : 'EN',
    status: show.status || 'Unknown',
    network: networkName,
    officialSite: show.officialSite || null,
    detailRoute: { name: 'tv-details', params: { id } }
  }
}

/**
 * Normalizes a TVmaze episode object
 */
export function normalizeTvmazeEpisode(ep) {
  if (!ep) return null
  return {
    id: ep.id,
    season: ep.season,
    number: ep.number,
    name: ep.name || `Episode ${ep.number}`,
    airdate: ep.airdate || '',
    runtime: ep.runtime ? `${ep.runtime}m` : null,
    summary: stripHtml(ep.summary) || 'No episode description available.',
    imageUrl: ep.image?.medium || ep.image?.original || null
  }
}

/**
 * Formats runtime in minutes to "2h 15m" or "45m"
 */
export function formatRuntime(minutes) {
  if (!minutes || minutes <= 0) return null
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`
  if (hrs > 0) return `${hrs}h`
  return `${mins}m`
}
