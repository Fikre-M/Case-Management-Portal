import apiRequest, { simulateNetworkDelay, isMockMode } from './api'
import mockAppointments from './mockAppointments'
import { generateId, initializeIdCounter } from '../utils/idGenerator'

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
      return mockAppointments
    }
    return apiRequest('/appointments')
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
      return appointment
    }
    return apiRequest(`/appointments/${id}`)
  },

  /**
   * Create new appointment
   * @param {Object} data - Appointment data
   * @returns {Promise<Object>} Created appointment
   */
  create: async (data) => {
    if (isMockMode()) {
      await simulateNetworkDelay(400)
      const newAppointment = {
        id: generateId('appointment'), // O(1) instead of O(n)
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockAppointments.push(newAppointment)
      return newAppointment
    }
    return apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Update appointment
   * @param {number|string} id - Appointment ID
   * @param {Object} data - Updated appointment data
   * @returns {Promise<Object>} Updated appointment
   */
  update: async (id, data) => {
    if (isMockMode()) {
      await simulateNetworkDelay(400)
      const index = mockAppointments.findIndex(apt => apt.id === parseInt(id))
      if (index === -1) {
        throw new Error(`Appointment with ID ${id} not found`)
      }
      mockAppointments[index] = {
        ...mockAppointments[index],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return mockAppointments[index]
    }
    return apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  /**
   * Delete appointment
   * @param {number|string} id - Appointment ID
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    if (isMockMode()) {
      await simulateNetworkDelay(300)
      const index = mockAppointments.findIndex(apt => apt.id === parseInt(id))
      if (index === -1) {
        throw new Error(`Appointment with ID ${id} not found`)
      }
      mockAppointments.splice(index, 1)
      return { success: true }
    }
    return apiRequest(`/appointments/${id}`, {
      method: 'DELETE',
    })
  },
}
