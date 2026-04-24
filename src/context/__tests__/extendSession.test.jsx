import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'

// AuthProvider now calls useError — provide a minimal mock
vi.mock('../../context/ErrorContext', () => ({
  useError: () => ({ addError: vi.fn() }),
}))

const KEY = 'ai_casemanager_current_user'
const store = {}

beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k])
  localStorage.getItem.mockImplementation(k => store[k] ?? null)
  localStorage.setItem.mockImplementation((k, v) => { store[k] = v })
  localStorage.removeItem.mockImplementation(k => { delete store[k] })
  global.fetch = vi.fn().mockRejectedValue(new TypeError('offline'))
})

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

describe('extendSession', () => {
  it('updates loginTime and keeps existing token', async () => {
    const original = {
      id: 'demo-001', name: 'Demo User', email: 'demo@example.com',
      role: 'admin', token: 'real-jwt-token', loginTime: Date.now() - 5000,
    }
    store[KEY] = JSON.stringify(original)

    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const before = result.current.user.loginTime

    act(() => result.current.extendSession())

    const persisted = JSON.parse(store[KEY])
    expect(persisted.loginTime).toBeGreaterThan(before)
    expect(persisted.token).toBe('real-jwt-token')
    expect(result.current.user.token).toBe('real-jwt-token')
  })

  it('uses localStorage as source of truth, not stale React state', async () => {
    const original = {
      id: 'demo-001', name: 'Demo User', email: 'demo@example.com',
      role: 'admin', token: 'stale-token', loginTime: Date.now() - 1000,
    }
    store[KEY] = JSON.stringify(original)

    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // Simulate another tab writing a fresher token directly to storage
    store[KEY] = JSON.stringify({ ...original, token: 'fresher-token-from-other-tab' })

    act(() => result.current.extendSession())

    const persisted = JSON.parse(store[KEY])
    // Must preserve the fresher token, not the stale one from React state
    expect(persisted.token).toBe('fresher-token-from-other-tab')
  })

  it('does nothing when not authenticated', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    localStorage.setItem.mockClear()

    act(() => result.current.extendSession())

    expect(localStorage.setItem).not.toHaveBeenCalled()
  })
})
