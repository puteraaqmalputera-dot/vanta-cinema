/**
 * VANTA CINEMA - Unified Fetch API Client
 * Features: Request timeout, status checking, clear error messages
 */

export class ApiError extends Error {
  constructor(message, status = 0, endpoint = '', data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.endpoint = endpoint
    this.data = data
  }
}

/**
 * Executes a native fetch with timeout and error classification
 * @param {string} url 
 * @param {RequestInit} options 
 * @param {number} timeoutMs 
 * @returns {Promise<any>}
 */
export async function request(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)

  // Merge external signal if passed
  const signal = options.signal 
    ? anySignal([options.signal, controller.signal]) 
    : controller.signal

  try {
    const response = await fetch(url, {
      ...options,
      signal
    })

    clearTimeout(id)

    if (!response.ok) {
      let errorBody = null
      try {
        errorBody = await response.json()
      } catch {
        // ignore parse error
      }

      if (response.status === 401) {
        throw new ApiError('Unauthorized. Please check your API access credentials.', 401, url, errorBody)
      } else if (response.status === 404) {
        throw new ApiError('Requested resource was not found.', 404, url, errorBody)
      } else if (response.status === 429) {
        throw new ApiError('Rate limit exceeded. Please wait a moment and try again.', 429, url, errorBody)
      } else if (response.status >= 500) {
        throw new ApiError('External service is temporarily unavailable. Please try again later.', response.status, url, errorBody)
      } else {
        const msg = errorBody?.status_message || errorBody?.message || `Request failed with status ${response.status}`
        throw new ApiError(msg, response.status, url, errorBody)
      }
    }

    return await response.json()
  } catch (error) {
    clearTimeout(id)
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out or was cancelled.', 408, url)
    }
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(error.message || 'Network failure connecting to service.', 0, url)
  }
}

/**
 * Combine multiple AbortSignals
 */
function anySignal(signals) {
  const controller = new AbortController()
  for (const signal of signals) {
    if (!signal) continue
    if (signal.aborted) {
      controller.abort()
      return controller.signal
    }
    signal.addEventListener('abort', () => controller.abort(), { once: true })
  }
  return controller.signal
}
