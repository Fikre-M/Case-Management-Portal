import apiRequest, { simulateNetworkDelay, isMockMode } from './api'
import mockAppointments from './mockAppointments'
import { generateId, initializeIdCounter } from '../utils/idGenerator'
import { 
  validateApiResponse, 
  validateApiRequest, 
  withValidation,
  ValidationError 
} from '../validation/validationMiddleware'
import { 
  appointmentSchema, 
  appointmentListSchema,
  appointmentsResponseSchema,
  appointmentResponseSchema,
  createAppointmentSchema,
  updateAppointmentSchema
} from '../validation/schemas'

// Initialize ID counter once when module loads
if (isMockMode() && mockAppointments.length > 0) {
  initializeIdCounter('appointment', mockAppointments)
}

/**
 * Appointment Service
 * Handles both mock data and real API calls based on configuration
 */
export const appointmentService = {
  /**
   * Get all appointments
   * @returns {Promise<Array>} List of appointments
   */
  getAll: async () => {
    if (isMockMode()) {
      await simulateNetworkDelay()
      // Validate mock data before returning
      return validateApiResponse(mockAppointments, appointmentListSchema, 'appointmentService.getAll')
    }
    
    const response = await apiRequest('/appointments')
    return validateApiResponse(response, appointmentsResponseSchema, 'appointmentService.getAll')
  },

  /**
   * Get appointment by ID
   * @param {number|string} id - Appointment ID
   * @returns {Promise<Object>} Appointment data
   */
  getById: async (id) => {
    if (isMockMode()) {
      await simulateNetworkDelay(300)
      const appointment = mockAppointments.find(apt => apt.id === parseInt(id))
      if (!appointment) {
        throw new Error(`Appointment with ID ${id} not found`)
      }
      // Validate single appointment
      return validateApiResponse(appointment, appointmentSchema, 'appointmentService.getById')
    }
    
    const response = await apiRequest(`/appointments/${id}`)
    return validateApiResponse(response, appointmentResponseSchema, 'appointmentService.getById')
  },

  /**
   * Create new appointment
   * @param {Object} data - Appointment data
   * @returns {Promise<Object>} Created appointment
   */
  create: async (data) => {
    // Validate request data before sending
    const validatedData = validateApiRequest(data, createAppointmentSchema, 'appointmentService.create')
    
    if (isMockMode()) {
      await simulateNetworkDelay(400)
      const newAppointment = {
        id: generateId('appointment'), // O(1) instead of O(n)
        ...validatedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockAppointments.push(newAppointment)
      // Validate created appointment
      return validateApiResponse(newAppointment, appointmentSchema, 'appointmentService.create')
    }
    
    const response = await apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    })
    return validateApiResponse(response, appointmentResponseSchema, 'appointmentService.create')
  },

  /**
   * Update appointment
   * @param {number|string} id - Appointment ID
   * @param {Object} data - Updated appointment data
   * @returns {Promise<Object>} Updated appointment
   */
  update: async (id, data) => {
    // Validate request data before sending
    const validatedData = validateApiRequest(data, updateAppointmentSchema, 'appointmentService.update')
    
    if (isMockMode()) {
      await simulateNetworkDelay(400)
      const index = mockAppointments.findIndex(apt => apt.id === parseInt(id))
      if (index === -1) {
        throw new Error(`Appointment with ID ${id} not found`)
      }
      mockAppointments[index] = {
        ...mockAppointments[index],
        ...validatedData,
        updatedAt: new Date().toISOString(),
      }
      // Validate updated appointment
      return validateApiResponse(mockAppointments[index], appointmentSchema, 'appointmentService.update')
    }
    
    const response = await apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(validatedData),
    })
    return validateApiResponse(response, appointmentResponseSchema, 'appointmentService.update')
  },

  /**
   * Delete appointment
   * @param {number|string} id - Appointment ID
   * @returns {Promise<Object>} Deletion response
   */
  delete: async (id) => {
    if (isMockMode()) {
      await simulateNetworkDelay(300)
      const index = mockAppointments.findIndex(apt => apt.id === parseInt(id))
      if (index === -1) {
        throw new Error(`Appointment with ID ${id} not found`)
      }
      mockAppointments.splice(index, 1)
      return validateApiResponse({ success: true }, appointmentResponseSchema, 'appointmentService.delete')
    }
    
    const response = await apiRequest(`/appointments/${id}`, {
      method: 'DELETE',
    })
    return validateApiResponse(response, appointmentResponseSchema, 'appointmentService.delete')
  },
}
