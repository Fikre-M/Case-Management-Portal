import apiRequest from './api'

export const appointmentService = {
  getAll: async () => {
    return apiRequest('/appointments')
  },

  getById: async (id) => {
    return apiRequest(`/appointments/${id}`)
  },

  create: async (data) => {
    return apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id, data) => {
    return apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id) => {
    return apiRequest(`/appointments/${id}`, {
      method: 'DELETE',
    })
  },
}
