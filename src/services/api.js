const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false' // Default to true for demo

/**
 * Generic API request handler with error handling and cancellation support.
 * @param {string} endpoint - API endpoint path
 * @param {object} options  - Fetch options; pass `signal` to support AbortController
 * @returns {Promise} Response data
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const { headers: customHeaders, ...restOptions } = options
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders,
    },
    ...restOptions,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    // Don't log or rethrow abort errors — they are intentional cancellations
    if (error.name === 'AbortError') throw error
    console.error(`API Request failed for ${endpoint}:`, error)
    throw error
  }
}

/**
 * Simulates network delay for mock data
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise}
 */
export const simulateNetworkDelay = (ms = 500) =>
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Check if app is using mock data
 * @returns {boolean}
 */
export const isMockMode = () => USE_MOCK_DATA

export default apiRequest
