import apiRequest from './api'

export const caseService = {
  getAll: async () => {
    return apiRequest('/cases')
  },

  getById: async (id) => {
    return apiRequest(`/cases/${id}`)
  },

  create: async (data) => {
    return apiRequest('/cases', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id, data) => {
    return apiRequest(`/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id) => {
    return apiRequest(`/cases/${id}`, {
      method: 'DELETE',
    })
  },
}
