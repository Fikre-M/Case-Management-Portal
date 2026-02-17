import apiRequest, { simulateNetworkDelay, isMockMode } from './api'
import mockCases from './mockCases'
import { generateId, initializeIdCounter } from '../utils/idGenerator'

// Initialize ID counter once when module loads
if (isMockMode() && mockCases.length > 0) {
  initializeIdCounter('case', mockCases)
}

/**
 * Case Service
 * Handles both mock data and real API calls based on configuration
 */
export const caseService = {
  /**
   * Get all cases
   * @returns {Promise<Array>} List of cases
   */
  getAll: async () => {
    if (isMockMode()) {
      await simulateNetworkDelay()
      return mockCases
    }
    return apiRequest('/cases')
  },

  /**
   * Get case by ID
   * @param {number|string} id - Case ID
   * @returns {Promise<Object>} Case data
   */
  getById: async (id) => {
    if (isMockMode()) {
      await simulateNetworkDelay(300)
      const caseItem = mockCases.find(c => c.id === parseInt(id))
      if (!caseItem) {
        throw new Error(`Case with ID ${id} not found`)
      }
      return caseItem
    }
    return apiRequest(`/cases/${id}`)
  },

  /**
   * Create new case
   * @param {Object} data - Case data
   * @returns {Promise<Object>} Created case
   */
  create: async (data) => {
    if (isMockMode()) {
      await simulateNetworkDelay(400)
      const newCase = {
        id: generateId('case'), // O(1) instead of O(n)
        caseNumber: `CASE-2024-${String(mockCases.length + 1).padStart(3, '0')}`,
        ...data,
        openedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        timeline: [
          {
            date: new Date().toISOString().split('T')[0],
            event: 'Case opened',
            type: 'info'
          }
        ],
        documents: [],
        notes: [],
      }
      mockCases.push(newCase)
      return newCase
    }
    return apiRequest('/cases', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update case
   * @param {number|string} id - Case ID
   * @param {Object} data - Updated case data
   * @returns {Promise<Object>} Updated case
   */
  update: async (id, data) => {
    if (isMockMode()) {
      await simulateNetworkDelay(400)
      const index = mockCases.findIndex(c => c.id === parseInt(id))
      if (index === -1) {
        throw new Error(`Case with ID ${id} not found`)
      }
      mockCases[index] = {
        ...mockCases[index],
        ...data,
        lastUpdated: new Date().toISOString().split('T')[0],
      }
      return mockCases[index]
    }
    return apiRequest(`/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete case
   * @param {number|string} id - Case ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    if (isMockMode()) {
      await simulateNetworkDelay(300)
      const index = mockCases.findIndex(c => c.id === parseInt(id))
      if (index === -1) {
        throw new Error(`Case with ID ${id} not found`)
      }
      mockCases.splice(index, 1)
      return { success: true }
    }
    return apiRequest(`/cases/${id}`, {
      method: 'DELETE',
    })
  },
}
