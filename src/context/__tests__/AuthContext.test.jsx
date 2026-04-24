import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'

// AuthProvider now calls useError — provide a minimal mock
vi.mock('../../context/ErrorContext', () => ({
  useError: () => ({ addError: vi.fn() }),
}))

// localStorage is already mocked globally in setup.js
// We need a working implementation for these tests
const store = {}
beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k])
  localStorage.getItem.mockImplementation(k => store[k] ?? null)
  localStorage.setItem.mockImplementation((k, v) => { store[k] = v })
  localStorage.removeItem.mockImplementation(k => { delete store[k] })
})

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

// ─── helpers ────────────────────────────────────────────────────────────────

function mockApiSuccess(data) {
  const body = JSON.stringify(data)
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    text: async () => body,
  })
}

function mockApiError(message, _status = 401) {
  const body = JSON.stringify({ error: message })
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    text: async () => body,
  })
}

function mockNetworkFailure() {
  global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
}

// ─── tests ──────────────────────────────────────────────────────────────────

describe('AuthContext', () => {
  describe('initial state', () => {
    it('starts unauthenticated with no user', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBe(null)
    })

    it('restores a valid session from localStorage', async () => {
      const session = {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'admin',
        loginTime: Date.now(),
      }
      store['ai_casemanager_current_user'] = JSON.stringify(session)

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user.email).toBe('demo@example.com')
    })

    it('clears an expired session on mount', async () => {
      const expired = {
        id: '1',
        name: 'Old User',
        email: 'old@example.com',
        loginTime: Date.now() - 25 * 60 * 60 * 1000, // 25 hours ago
      }
      store['ai_casemanager_current_user'] = JSON.stringify(expired)

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.isAuthenticated).toBe(false)
      expect(localStorage.removeItem).toHaveBeenCalledWith('ai_casemanager_current_user')
    })
  })

  describe('login — real API path', () => {
    it('authenticates and stores session on success', async () => {
      mockApiSuccess({
        token: 'jwt-token-abc',
        user: { id: 'demo-001', name: 'Demo User', email: 'demo@example.com', role: 'admin' },
      })

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      let loginResult
      await act(async () => {
        loginResult = await result.current.login('demo@example.com', 'password')
      })

      expect(loginResult.success).toBe(true)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user.email).toBe('demo@example.com')
      expect(result.current.user.token).toBe('jwt-token-abc')
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'ai_casemanager_current_user',
        expect.stringContaining('demo@example.com')
      )
    })

    it('returns failure message on invalid credentials', async () => {
      mockApiError('Invalid credentials')

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      let loginResult
      await act(async () => {
        loginResult = await result.current.login('wrong@example.com', 'badpass')
      })

      expect(loginResult.success).toBe(false)
      expect(loginResult.message).toBe('Invalid credentials')
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('login — demo fallback (no network)', () => {
    it('falls back to demo mode when fetch is unreachable', async () => {
      mockNetworkFailure()

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      let loginResult
      await act(async () => {
        loginResult = await result.current.login('demo@example.com', 'password')
      })

      expect(loginResult.success).toBe(true)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user.email).toBe('demo@example.com')
    })

    it('rejects wrong credentials even in demo fallback', async () => {
      mockNetworkFailure()

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      let loginResult
      await act(async () => {
        loginResult = await result.current.login('demo@example.com', 'wrongpassword')
      })

      expect(loginResult.success).toBe(false)
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('clears user state and localStorage', async () => {
      mockApiSuccess({
        token: 'jwt-token',
        user: { id: '1', name: 'Demo User', email: 'demo@example.com', role: 'admin' },
      })

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      await act(async () => {
        await result.current.login('demo@example.com', 'password')
      })
      expect(result.current.isAuthenticated).toBe(true)

      act(() => result.current.logout())

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBe(null)
      expect(localStorage.removeItem).toHaveBeenCalledWith('ai_casemanager_current_user')
    })
  })

  describe('register', () => {
    it('creates account and authenticates on success', async () => {
      mockApiSuccess({
        token: 'new-jwt',
        user: { id: 'user-123', name: 'New User', email: 'new@example.com', role: 'user' },
      })

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      let regResult
      await act(async () => {
        regResult = await result.current.register({
          fullName: 'New User',
          email: 'new@example.com',
          password: 'securepass123',
        })
      })

      expect(regResult.success).toBe(true)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user.email).toBe('new@example.com')
    })

    it('returns error message when registration fails', async () => {
      mockApiError('An account with this email already exists', 409)

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      let regResult
      await act(async () => {
        regResult = await result.current.register({
          fullName: 'Existing User',
          email: 'taken@example.com',
          password: 'pass12345',
        })
      })

      expect(regResult.success).toBe(false)
      expect(regResult.message).toContain('already exists')
    })

    it('informs user to use demo login when network is unavailable', async () => {
      mockNetworkFailure()

      const { result } = renderHook(() => useAuth(), { wrapper })
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      let regResult
      await act(async () => {
        regResult = await result.current.register({
          fullName: 'Test',
          email: 'test@example.com',
          password: 'pass12345',
        })
      })

      expect(regResult.success).toBe(false)
      expect(regResult.message).toMatch(/demo/i)
    })
  })

  describe('useAuth hook guard', () => {
    it('throws when used outside AuthProvider', () => {
      expect(() => renderHook(() => useAuth())).toThrow(
        'useAuth must be used within an AuthProvider'
      )
    })
  })
})
