const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false' // Default to true for demo

/**
 * Generic API request handler with error handling
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error)
    throw error
  }
}

/**
 * Simulates network delay for mock data
 * @param {number} delay - Delay in milliseconds
 * @returns {Promise}
 */
export const simulateNetworkDelay = (delay = 500) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * Check if app is using mock data
 * @returns {boolean}
 */
export const isMockMode = () => USE_MOCK_DATA

export default apiRequest
