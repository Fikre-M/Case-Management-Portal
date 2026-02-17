import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext()

// Mock user database in localStorage
const USERS_KEY = 'ai_casemanager_users'
const CURRENT_USER_KEY = 'ai_casemanager_current_user'
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 24 hours

// ⚠️ SECURITY WARNING - DEMO ONLY ⚠️
// This implementation stores plain-text passwords in localStorage for demonstration purposes.
// 
// 🔴 CRITICAL: DO NOT USE IN PRODUCTION 🔴
// 
// Production Requirements:
// 1. Never store passwords in localStorage or any client-side storage
// 2. Use proper backend authentication (JWT, OAuth, etc.)
// 3. Hash passwords server-side (bcrypt, argon2, etc.)
// 4. Implement HTTPS-only secure cookies for session management
// 5. Add CSRF protection and rate limiting
// 6. Use environment variables for sensitive configuration
// 
// This code is intentionally simplified for demo/development purposes only.

// Initialize with demo user
const initializeUsers = () => {
  try {
    const existingUsers = localStorage.getItem(USERS_KEY)
    if (!existingUsers) {
      // ⚠️ DEMO ONLY: Hard-coded credentials with plain-text password
      const demoUsers = [
        {
          id: 1,
          name: 'Demo User',
          email: 'demo@example.com',
          password: 'password', // 🔴 NEVER store plain-text passwords in production
          role: 'admin'
        }
      ]
      localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers))
    }
  } catch (error) {
    console.error('Error initializing users:', error)
  }
}

// Check if session is valid
const isSessionValid = (userData) => {
  if (!userData || !userData.loginTime) return false
  const now = Date.now()
  return (now - userData.loginTime) < SESSION_TIMEOUT
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize users and check for existing session
  useEffect(() => {
    const initAuth = async () => {
      try {
        initializeUsers()
        
        const currentUserData = localStorage.getItem(CURRENT_USER_KEY)
        if (currentUserData) {
          const userData = JSON.parse(currentUserData)
          
          // Check if session is still valid
          if (isSessionValid(userData)) {
            setUser(userData)
            setIsAuthenticated(true)
          } else {
            // Session expired, clear it
            localStorage.removeItem(CURRENT_USER_KEY)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // Clear corrupted data
        try {
          localStorage.removeItem(CURRENT_USER_KEY)
        } catch (clearError) {
          console.error('Error clearing corrupted auth data:', clearError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Persist auth state on window focus (handles tab switching)
  useEffect(() => {
    const handleFocus = () => {
      try {
        const currentUserData = localStorage.getItem(CURRENT_USER_KEY)
        if (currentUserData) {
          const userData = JSON.parse(currentUserData)
          if (isSessionValid(userData) && !isAuthenticated) {
            setUser(userData)
            setIsAuthenticated(true)
          }
        }
      } catch (error) {
        console.error('Error restoring auth on focus:', error)
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isAuthenticated])

  const register = (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email)
      if (existingUser) {
        return { success: false, message: 'User with this email already exists' }
      }

      // Create new user
      // ⚠️ DEMO ONLY: Storing plain-text password - NEVER do this in production
      const newUser = {
        id: users.length + 1,
        name: userData.fullName,
        email: userData.email,
        password: userData.password, // 🔴 Should be hashed server-side in production
        role: 'user',
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      localStorage.setItem(USERS_KEY, JSON.stringify(users))

      // Auto-login after registration
      const userToStore = { 
        ...newUser,
        loginTime: Date.now()
      }
      delete userToStore.password // Don't store password in session
      
      setUser(userToStore)
      setIsAuthenticated(true)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore))

      return { success: true, user: userToStore }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, message: 'Registration failed. Please try again.' }
    }
  }

  const login = (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
      // ⚠️ DEMO ONLY: Plain-text password comparison - use secure backend auth in production
      const foundUser = users.find(u => u.email === email && u.password === password)

      if (foundUser) {
        const userToStore = { 
          ...foundUser,
          loginTime: Date.now()
        }
        delete userToStore.password // Don't store password in session
        
        setUser(userToStore)
        setIsAuthenticated(true)
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userToStore))
        
        return { success: true, user: userToStore }
      }

      return { success: false, message: 'Invalid email or password' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Login failed. Please try again.' }
    }
  }

  const logout = () => {
    try {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem(CURRENT_USER_KEY)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Extend session on activity
  const extendSession = () => {
    if (isAuthenticated && user) {
      try {
        const updatedUser = { ...user, loginTime: Date.now() }
        setUser(updatedUser)
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser))
      } catch (error) {
        console.error('Error extending session:', error)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      logout, 
      register,
      extendSession
    }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
