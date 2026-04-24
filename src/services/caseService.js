import apiRequest, { simulateNetworkDelay, isMockMode } from './api'
import mockCases from './mockCases'
import { generateId, initializeIdCounter } from '../utils/idGenerator'
import { 
  validateApiResponse, 
  validateApiRequest, 
  withValidation,
  ValidationError 
} from '../validation/validationMiddleware'
import { 
  caseSchema, 
  caseListSchema,
  casesResponseSchema,
  caseResponseSchema,
  createCaseSchema,
  updateCaseSchema
} from '../validation/schemas'
import { debug, warn, error } from '../utils/logger'

// Initialize ID counter once when module loads
debug('Case service initializing', { 
  mockMode: isMockMode(), 
  mockCasesLength: mockCases?.length || 0,
  mockCases: mockCases ? 'imported successfully' : 'import failed'
})

if (isMockMode() && mockCases.length > 0) {
  initializeIdCounter('case', mockCases)
  debug('ID counter initialized for cases')
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
    debug('caseService.getAll called', { mockMode: isMockMode() })
    
    if (isMockMode()) {
      debug('Using mock data for cases - NO VALIDATION')
      await simulateNetworkDelay()
      // Temporarily return mock data without validation
      return mockCases
    }
    
    debug('Making real API call for cases - NO VALIDATION')
    try {
      const response = await apiRequest('/cases')
      // Temporarily return response without validation
      return response
    } catch (apiError) {
      error('API call failed for cases', { error: apiError.message })
      throw apiError
    }
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
      // Validate single case
      return validateApiResponse(caseItem, caseSchema, 'caseService.getById')
    }
    
    const response = await apiRequest(`/cases/${id}`)
    return validateApiResponse(response, caseResponseSchema, 'caseService.getById')
  },

  /**
   * Create new case
   * @param {Object} data - Case data
   * @returns {Promise<Object>} Created case
   */
  create: async (data) => {
    // Validate request data before sending
    const validatedData = validateApiRequest(data, createCaseSchema, 'caseService.create')
    
    if (isMockMode()) {
      await simulateNetworkDelay(400)
      const newCase = {
        id: generateId('case'), // O(1) instead of O(n)
        caseNumber: `CASE-2024-${String(mockCases.length + 1).padStart(3, '0')}`,
        ...validatedData,
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
      // Validate created case
      return validateApiResponse(newCase, caseSchema, 'caseService.create')
    }
    
    const response = await apiRequest('/cases', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    })
    return validateApiResponse(response, caseResponseSchema, 'caseService.create')
  },

  /**
   * Update case
   * @param {number|string} id - Case ID
   * @param {Object} data - Updated case data
   * @returns {Promise<Object>} Updated case
   */
  update: async (id, data) => {
    // Validate request data before sending
    const validatedData = validateApiRequest(data, updateCaseSchema, 'caseService.update')
    
    if (isMockMode()) {
      await simulateNetworkDelay(400)
      const index = mockCases.findIndex(c => c.id === parseInt(id))
      if (index === -1) {
        throw new Error(`Case with ID ${id} not found`)
      }
      mockCases[index] = {
        ...mockCases[index],
        ...validatedData,
        lastUpdated: new Date().toISOString().split('T')[0],
      }
      // Validate updated case
      return validateApiResponse(mockCases[index], caseSchema, 'caseService.update')
    }
    
    const response = await apiRequest(`/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(validatedData),
    })
    return validateApiResponse(response, caseResponseSchema, 'caseService.update')
  },

  /**
   * Delete case
   * @param {number|string} id - Case ID
   * @returns {Promise<Object>} Deletion response
   */
  delete: async (id) => {
    if (isMockMode()) {
      await simulateNetworkDelay(300)
      const index = mockCases.findIndex(c => c.id === parseInt(id))
      if (index === -1) {
        throw new Error(`Case with ID ${id} not found`)
      }
      mockCases.splice(index, 1)
      return validateApiResponse({ success: true }, caseResponseSchema, 'caseService.delete')
    }
    
    const response = await apiRequest(`/cases/${id}`, {
      method: 'DELETE',
    })
    return validateApiResponse(response, caseResponseSchema, 'caseService.delete')
  },
}
