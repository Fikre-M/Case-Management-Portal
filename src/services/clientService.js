import apiRequest from './api'

export const clientService = {
  getAll: async () => {
    return apiRequest('/clients')
  },

  getById: async (id) => {
    return apiRequest(`/clients/${id}`)
  },

  create: async (data) => {
    return apiRequest('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id, data) => {
    return apiRequest(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id) => {
    return apiRequest(`/clients/${id}`, {
      method: 'DELETE',
    })
  },
}
