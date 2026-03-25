import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// ─── module-level env setup must happen before import ───────────────────────
// We control env vars via vi.stubEnv and re-import the module per test group

describe('aiService-universal', () => {
  beforeEach(() => {
    vi.resetModules()
    // Provide a stable hostname so IS_NETLIFY is false in all tests
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost' },
      writable: true,
    })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  // ─── getServiceStatus ──────────────────────────────────────────────────────

  describe('getServiceStatus', () => {
    it('returns disabled status when AI is turned off', async () => {
      vi.stubEnv('VITE_AI_ENABLED', 'false')
      const { getServiceStatus } = await import('../aiService-universal.js')
      const status = getServiceStatus()
      expect(status.enabled).toBe(false)
      expect(status.available).toBe(false)
    })

    it('returns mock provider when no API key is set', async () => {
      vi.stubEnv('VITE_AI_ENABLED', 'true')
      vi.stubEnv('VITE_AidFlow_API_KEY', '')
      const { getServiceStatus } = await import('../aiService-universal.js')
      const status = getServiceStatus()
      expect(status.enabled).toBe(true)
      expect(status.provider).toBe('Mock')
    })

    it('returns Direct Gemini provider when API key is present', async () => {
      vi.stubEnv('VITE_AI_ENABLED', 'true')
      vi.stubEnv('VITE_AidFlow_API_KEY', 'AIzaSy-fake-key-for-testing')
      const { getServiceStatus } = await import('../aiService-universal.js')
      const status = getServiceStatus()
      expect(status.provider).toBe('Direct Gemini API')
      expect(status.model).toContain('gemini')
    })
  })

  // ─── getRateLimitStatus ────────────────────────────────────────────────────

  describe('getRateLimitStatus', () => {
    it('returns correct shape', async () => {
      const { getRateLimitStatus } = await import('../aiService-universal.js')
      const status = getRateLimitStatus()
      expect(status).toMatchObject({
        requestCount: expect.any(Number),
        maxRequests: expect.any(Number),
        remaining: expect.any(Number),
        resetIn: expect.any(Number),
      })
      expect(status.remaining).toBeLessThanOrEqual(status.maxRequests)
    })
  })

  // ─── getSuggestedPrompts ───────────────────────────────────────────────────

  describe('getSuggestedPrompts', () => {
    it('returns a non-empty array of strings', async () => {
      const { getSuggestedPrompts } = await import('../aiService-universal.js')
      const prompts = getSuggestedPrompts()
      expect(Array.isArray(prompts)).toBe(true)
      expect(prompts.length).toBeGreaterThan(0)
      prompts.forEach(p => expect(typeof p).toBe('string'))
    })
  })

  // ─── getQuickActions ───────────────────────────────────────────────────────

  describe('getQuickActions', () => {
    it('returns actions with icon, label, and prompt', async () => {
      const { getQuickActions } = await import('../aiService-universal.js')
      const actions = getQuickActions()
      expect(Array.isArray(actions)).toBe(true)
      expect(actions.length).toBeGreaterThan(0)
      actions.forEach(action => {
        expect(action).toHaveProperty('icon')
        expect(action).toHaveProperty('label')
        expect(action).toHaveProperty('prompt')
      })
    })
  })

  // ─── sendMessage ──────────────────────────────────────────────────────────

  describe('sendMessage', () => {
    it('returns mock response when AI is disabled', async () => {
      vi.stubEnv('VITE_AI_ENABLED', 'false')
      const { sendMessage } = await import('../aiService-universal.js')
      const response = await sendMessage('hello')
      expect(typeof response).toBe('string')
      expect(response.length).toBeGreaterThan(0)
    })

    it('returns auth prompt when user is not logged in', async () => {
      vi.stubEnv('VITE_AI_ENABLED', 'true')
      localStorage.getItem.mockReturnValue(null) // no session
      const { sendMessage } = await import('../aiService-universal.js')
      const response = await sendMessage('hello')
      expect(response).toMatch(/login/i)
    })

    it('returns mock response when USE_MOCK_DATA is true', async () => {
      vi.stubEnv('VITE_AI_ENABLED', 'true')
      vi.stubEnv('VITE_USE_MOCK_DATA', 'true')

      // Provide a valid session
      localStorage.getItem.mockReturnValue(
        JSON.stringify({ id: '1', email: 'demo@example.com', loginTime: Date.now() })
      )

      const { sendMessage } = await import('../aiService-universal.js')
      const response = await sendMessage('hello')
      expect(typeof response).toBe('string')
      expect(response.length).toBeGreaterThan(0)
    })

    it('falls back to mock response when Gemini API call fails', async () => {
      vi.stubEnv('VITE_AI_ENABLED', 'true')
      vi.stubEnv('VITE_USE_MOCK_DATA', 'false')
      vi.stubEnv('VITE_AidFlow_API_KEY', 'AIzaSy-fake-key')

      localStorage.getItem.mockReturnValue(
        JSON.stringify({ id: '1', email: 'demo@example.com', loginTime: Date.now() })
      )

      // Gemini fetch will fail
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const { sendMessage } = await import('../aiService-universal.js')
      const response = await sendMessage('hello')

      // Should not throw — graceful fallback to mock
      expect(typeof response).toBe('string')
      expect(response.length).toBeGreaterThan(0)
    })
  })

  // ─── isOpenAIAvailable ────────────────────────────────────────────────────

  describe('isOpenAIAvailable', () => {
    it('returns false when AI is disabled', async () => {
      vi.stubEnv('VITE_AI_ENABLED', 'false')
      const { isOpenAIAvailable } = await import('../aiService-universal.js')
      expect(isOpenAIAvailable()).toBe(false)
    })

    it('returns false when user is not authenticated', async () => {
      vi.stubEnv('VITE_AI_ENABLED', 'true')
      localStorage.getItem.mockReturnValue(null)
      const { isOpenAIAvailable } = await import('../aiService-universal.js')
      expect(isOpenAIAvailable()).toBe(false)
    })

    it('returns true when AI is enabled and user is authenticated', async () => {
      vi.stubEnv('VITE_AI_ENABLED', 'true')
      localStorage.getItem.mockReturnValue(
        JSON.stringify({ id: '1', email: 'demo@example.com', loginTime: Date.now() })
      )
      const { isOpenAIAvailable } = await import('../aiService-universal.js')
      expect(isOpenAIAvailable()).toBe(true)
    })
  })
})
