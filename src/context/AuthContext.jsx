import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext()

const CURRENT_USER_KEY = 'ai_casemanager_current_user'
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

const API_BASE = '/api/auth'

async function apiLogin(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login failed')
  return data // { token, user }
}

async function apiRegister(name, email, password) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  const data = await res.json()
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
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
    try {
      let result

      try {
        // Try real API first (works on Netlify or with Netlify CLI locally)
        result = await apiLogin(email, password)
      } catch (apiError) {
        // If the endpoint isn't reachable (local dev without CLI), fall back to demo mode
        if (apiError instanceof TypeError && apiError.message.includes('fetch')) {
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
      return { success: false, message: error.message || 'Login failed' }
    }
  }

  const register = async (userData) => {
    try {
      let result

      try {
        result = await apiRegister(userData.fullName || userData.name, userData.email, userData.password)
      } catch (apiError) {
        if (apiError instanceof TypeError && apiError.message.includes('fetch')) {
          // Demo fallback — registration not supported without the API
          return { success: false, message: 'Registration requires the Netlify dev server. Use demo@example.com / password to log in.' }
        }
        throw apiError
      }

      const session = persistSession(result.user, result.token)
      setUser(session)
      setIsAuthenticated(true)
      return { success: true, user: session }
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' }
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    clearSession()
  }

  const extendSession = () => {
    if (isAuthenticated && user) {
      const updated = { ...user, loginTime: Date.now() }
      setUser(updated)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated))
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
