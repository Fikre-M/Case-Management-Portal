import apiRequest from './api'
import { 
  validateApiResponse, 
  validateApiRequest, 
  withValidation,
  ValidationError 
} from '../validation/validationMiddleware'
import { 
  clientSchema, 
  clientListSchema,
  clientsResponseSchema,
  clientResponseSchema,
  createClientSchema,
  updateClientSchema
} from '../validation/schemas'

export const clientService = {
  /**
   * Get all clients
   * @returns {Promise<Array>} List of clients
   */
  getAll: async () => {
    const response = await apiRequest('/clients')
    return validateApiResponse(response, clientsResponseSchema, 'clientService.getAll')
  },

  /**
   * Get client by ID
   * @param {number|string} id - Client ID
   * @returns {Promise<Object>} Client data
   */
  getById: async (id) => {
    const response = await apiRequest(`/clients/${id}`)
    return validateApiResponse(response, clientResponseSchema, 'clientService.getById')
  },

  /**
   * Create new client
   * @param {Object} data - Client data
   * @returns {Promise<Object>} Created client
   */
  create: async (data) => {
    // Validate request data before sending
    const validatedData = validateApiRequest(data, createClientSchema, 'clientService.create')
    
    const response = await apiRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    })
    return validateApiResponse(response, clientResponseSchema, 'clientService.create')
  },

  /**
   * Update client
   * @param {number|string} id - Client ID
   * @param {Object} data - Updated client data
   * @returns {Promise<Object>} Updated client
   */
  update: async (id, data) => {
    // Validate request data before sending
    const validatedData = validateApiRequest(data, updateClientSchema, 'clientService.update')
    
    const response = await apiRequest(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(validatedData),
    })
    return validateApiResponse(response, clientResponseSchema, 'clientService.update')
  },

  /**
   * Delete client
   * @param {number|string} id - Client ID
   * @returns {Promise<Object>} Deletion response
   */
  delete: async (id) => {
    const response = await apiRequest(`/clients/${id}`, {
      method: 'DELETE',
    })
    return validateApiResponse(response, clientResponseSchema, 'clientService.delete')
  },
}
