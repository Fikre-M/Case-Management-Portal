import { createContext, useContext, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useError } from './ErrorContext'

const AuthContext = createContext()

import { SESSION_TIMEOUT_MS, STORAGE_KEYS } from '../config/constants'

const CURRENT_USER_KEY = STORAGE_KEYS.CURRENT_USER
const SESSION_TIMEOUT  = SESSION_TIMEOUT_MS

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

const API_BASE = '/api/auth'

async function apiLogin(email, password, signal) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ email, password }),
    signal,
  })

  // Guard against empty body (e.g. 404 from missing function)
  const text = await res.text()
  if (!text) throw new TypeError('Empty response — API not reachable')

  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new TypeError('Non-JSON response — API not reachable')
  }

  if (!res.ok) throw new Error(data.error || 'Login failed')
  return data // { token, user }
}

async function apiRegister(name, email, password, signal) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({ name, email, password }),
    signal,
  })

  const text = await res.text()
  if (!text) throw new TypeError('Empty response — API not reachable')

  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new TypeError('Non-JSON response — API not reachable')
  }

  if (!res.ok) throw new Error(data.error || 'Registration failed')
  return data // { token, user }
}

// ---------------------------------------------------------------------------
// Demo fallback (local dev without Netlify CLI)
// ---------------------------------------------------------------------------

const DEMO_CREDENTIALS = { email: 'demo@example.com', password: 'password' }

function demoLogin(email, password) {
  if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    return {
      token: null, // no real JWT in demo mode
      user: { id: 'demo-001', name: 'Demo User', email, role: 'admin' },
    }
  }
  throw new Error('Invalid credentials')
}

// ---------------------------------------------------------------------------
// Session helpers
// ---------------------------------------------------------------------------

function isSessionValid(userData) {
  if (!userData?.loginTime) return false
  return Date.now() - userData.loginTime < SESSION_TIMEOUT
}

function persistSession(user, token) {
  const session = { ...user, loginTime: Date.now(), token: token ?? null }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session))
  return session
}

function clearSession() {
  localStorage.removeItem(CURRENT_USER_KEY)
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { addError } = useError()
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // Track in-flight auth requests so we can cancel them on unmount
  const abortRef = useRef(null)

  // Abort any pending request when the provider unmounts
  useEffect(() => () => abortRef.current?.abort(), [])

  // Restore session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY)
      if (raw) {
        const session = JSON.parse(raw)
        if (isSessionValid(session)) {
          setUser(session)
          setIsAuthenticated(true)
        } else {
          clearSession()
        }
      }
    } catch {
      clearSession()
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Re-check session when tab regains focus
  useEffect(() => {
    const handleFocus = () => {
      try {
        const raw = localStorage.getItem(CURRENT_USER_KEY)
        if (raw) {
          const session = JSON.parse(raw)
          if (isSessionValid(session) && !isAuthenticated) {
            setUser(session)
            setIsAuthenticated(true)
          }
        }
      } catch {
        // ignore
      }
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isAuthenticated])

  // ---------------------------------------------------------------------------
  // Auth actions
  // ---------------------------------------------------------------------------

  const login = async (email, password) => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    const { signal } = abortRef.current
    try {
      let result

      try {
        result = await apiLogin(email, password, signal)
      } catch (apiError) {
        if (apiError.name === 'AbortError') return { success: false, message: 'Request cancelled' }
        if (apiError instanceof TypeError) {
          result = demoLogin(email, password)
        } else {
          throw apiError
        }
      }

      const session = persistSession(result.user, result.token)
      setUser(session)
      setIsAuthenticated(true)
      return { success: true, user: session }
    } catch (error) {
      if (error.name === 'AbortError') return { success: false, message: 'Request cancelled' }
      if (!(error.message?.includes('credentials') || error.message?.includes('Login failed'))) {
        addError(error, { context: 'Authentication', type: 'error', autoClose: true })
      }
      return { success: false, message: error.message || 'Login failed' }
    }
  }

  const register = async (userData) => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    const { signal } = abortRef.current
    try {
      let result

      try {
        result = await apiRegister(userData.fullName || userData.name, userData.email, userData.password, signal)
      } catch (apiError) {
        if (apiError.name === 'AbortError') return { success: false, message: 'Request cancelled' }
        if (apiError instanceof TypeError) {
          return { success: false, message: 'Registration requires the Netlify dev server. Use demo@example.com / password to log in.' }
        }
        throw apiError
      }

      const session = persistSession(result.user, result.token)
      setUser(session)
      setIsAuthenticated(true)
      return { success: true, user: session }
    } catch (error) {
      if (error.name === 'AbortError') return { success: false, message: 'Request cancelled' }
      if (!(error.message?.includes('already exists') || error.message?.includes('Registration failed'))) {
        addError(error, { context: 'Registration', type: 'error', autoClose: true })
      }
      return { success: false, message: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    clearSession()
  }

  const extendSession = () => {
    if (!isAuthenticated || !user) return

    try {
      // Read the current persisted session as the source of truth to avoid
      // overwriting a token that was written by another tab or a concurrent
      // update while this closure captured a stale `user` snapshot.
      const raw = localStorage.getItem(CURRENT_USER_KEY)
      const persisted = raw ? JSON.parse(raw) : null

      // Use persisted data when available so we never lose a fresher token.
      const base = persisted ?? user
      const updated = { ...base, loginTime: Date.now() }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated))
      setUser(updated)
    } catch {
      // If storage is unavailable just update in-memory state.
      setUser((prev) => (prev ? { ...prev, loginTime: Date.now() } : prev))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, register, extendSession }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
