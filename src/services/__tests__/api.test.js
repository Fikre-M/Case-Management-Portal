import { describe, it, expect, vi, beforeEach } from 'vitest'
import apiRequest, { simulateNetworkDelay, isMockMode } from '../api'

describe('API Service', () => {
  describe('simulateNetworkDelay', () => {
    it('should delay for specified time', async () => {
      const start = Date.now()
      await simulateNetworkDelay(100)
      const end = Date.now()
      expect(end - start).toBeGreaterThanOrEqual(100)
    })

    it('should use default delay of 500ms', async () => {
      const start = Date.now()
      await simulateNetworkDelay()
      const end = Date.now()
      expect(end - start).toBeGreaterThanOrEqual(500)
    })
  })

  describe('isMockMode', () => {
    it('should return boolean', () => {
      const result = isMockMode()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('apiRequest', () => {
    beforeEach(() => {
      global.fetch = vi.fn()
    })

    it('should make successful API request', async () => {
      const mockData = { id: 1, name: 'Test' }
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await apiRequest('/test')
      expect(result).toEqual(mockData)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
    })

    it('should handle API errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
        json: async () => ({ message: 'Resource not found' }),
      })

      await expect(apiRequest('/test')).rejects.toThrow('Resource not found')
    })

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(apiRequest('/test')).rejects.toThrow('Network error')
    })

    it('should include custom headers', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

      await apiRequest('/test', {
        headers: { 'X-Custom': 'value' },
      })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Custom': 'value',
          }),
        })
      )
    })
  })
})
