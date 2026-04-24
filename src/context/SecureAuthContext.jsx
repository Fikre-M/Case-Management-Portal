import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { SECURITY, STORAGE_KEYS } from '../config/constants'
import { 
  createMockJWT, 
  verifyMockJWT, 
  isTokenExpired, 
  refreshMockJWT,
  getUserFromToken,
  mockJWTUtils 
} from '../utils/mockJWT'
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '../hooks/useLocalStorage'

const SecureAuthContext = createContext()

const TOKEN_KEY = STORAGE_KEYS.TOKEN
const USERS_KEY = STORAGE_KEYS.SECURE_USERS

/**
 * 🔒 IMPROVED DEMO AUTHENTICATION CONTEXT
 * 
 * This implementation uses mock JWT tokens and password hashing for a more
 * realistic authentication pattern while still being demo-only.
 * 
 * ✅ IMPROVEMENTS OVER BASIC VERSION:
 * - Mock JWT tokens instead of plain objects
 * - Password hashing (mock implementation)
 * - Input sanitization
 * - Token expiration handling
 * - Better session management
 * 
 * 🔴 STILL NOT PRODUCTION READY:
 * - Client-side only (no server validation)
 * - Mock JWT signing (real JWTs need server-side secrets)
 * - localStorage usage (still vulnerable to XSS)
 * - No rate limiting or brute force protection
 * 
 * 📚 PRODUCTION REQUIREMENTS:
 * 1. Server-side authentication with real JWT signing
 * 2. Secure HTTP-only cookies for token storage
 * 3. Real password hashing (bcrypt/argon2)
 * 4. HTTPS enforcement
 * 5. CSRF protection
 * 6. Rate limiting and security monitoring
 */

// Initialize demo users with hashed passwords
const initializeSecureUsers = () => {
  try {
    const existingUsers = getLocalStorageItem(USERS_KEY)
    if (!existingUsers) {
      const demoUsers = [
        {
          id: 1,
          name: 'Demo User',
          email: 'demo@example.com',
          passwordHash: mockJWTUtils.hashPassword('password'), // Hashed password
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: mockJWTUtils.hashPassword('test123'),
          role: 'user',
          createdAt: new Date().toISOString()
        }
      ]
      setLocalStorageItem(USERS_KEY, demoUsers)
      console.log('🔒 Demo users initialized with hashed passwords')
    }
  } catch (error) {
    console.error('Error initializing secure users:', error)
  }
}

/**
 * Secure Authentication Provider
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function SecureAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(null)

  /**
   * Initialize authentication state
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        initializeSecureUsers()
        
        const storedToken = getLocalStorageItem(TOKEN_KEY)
        if (storedToken && !await isTokenExpired(storedToken)) {
          const userData = await getUserFromToken(storedToken)
          if (userData) {
            setUser(userData)
            setIsAuthenticated(true)
            setToken(storedToken)
            console.log('🔒 Session restored from valid JWT token')
          }
        } else if (storedToken) {
          // Token expired, clean up
          removeLocalStorageItem(TOKEN_KEY)
          console.log('🔒 Expired token removed')
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        removeLocalStorageItem(TOKEN_KEY)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  /**
   * Register a new user
   * 
   * @param {Object} userData - User registration data
   * @returns {Object} Registration result
   */
  const register = async (userData) => {
    try {
      // Sanitize inputs
      const sanitizedData = {
        name: mockJWTUtils.sanitizeInput(userData.name),
        email: mockJWTUtils.sanitizeInput(userData.email?.toLowerCase()),
        password: userData.password // Don't sanitize password, just validate
      }

      // Basic validation
      if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.password) {
        return { success: false, error: 'All fields are required' }
      }

      if (sanitizedData.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' }
      }

      const users = getLocalStorageItem(USERS_KEY) || []
      
      // Check if user already exists
      if (users.find(u => u.email === sanitizedData.email)) {
        return { success: false, error: 'User already exists' }
      }

      // Create new user with hashed password
      const newUser = {
        id: Date.now(),
        name: sanitizedData.name,
        email: sanitizedData.email,
        passwordHash: mockJWTUtils.hashPassword(sanitizedData.password),
        role: 'user',
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      setLocalStorageItem(USERS_KEY, users)

      // Create JWT token for new user
      const tokenPayload = {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }

      const jwtToken = await createMockJWT(tokenPayload, { expiresIn: '24h' })
      
      // Store token and update state
      setLocalStorageItem(TOKEN_KEY, jwtToken)
      setUser(tokenPayload)
      setIsAuthenticated(true)
      setToken(jwtToken)

      console.log('🔒 User registered successfully with JWT token')
      return { success: true, user: tokenPayload }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed' }
    }
  }

  /**
   * Login user
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} Login result
   */
  const login = async (email, password) => {
    try {
      // Sanitize email
      const sanitizedEmail = mockJWTUtils.sanitizeInput(email?.toLowerCase())
      
      if (!sanitizedEmail || !password) {
        return { success: false, error: 'Email and password are required' }
      }

      const users = getLocalStorageItem(USERS_KEY) || []
      const foundUser = users.find(u => u.email === sanitizedEmail)

      if (!foundUser) {
        return { success: false, error: 'Invalid credentials' }
      }

      // Verify password using mock hashing
      if (!mockJWTUtils.verifyPassword(password, foundUser.passwordHash)) {
        return { success: false, error: 'Invalid credentials' }
      }

      // Create JWT token
      const tokenPayload = {
        userId: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      }

      const jwtToken = await createMockJWT(tokenPayload, { expiresIn: '24h' })
      
      // Store token and update state
      setLocalStorageItem(TOKEN_KEY, jwtToken)
      setUser(tokenPayload)
      setIsAuthenticated(true)
      setToken(jwtToken)

      console.log('🔒 User logged in successfully with JWT token')
      return { success: true, user: tokenPayload }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed' }
    }
  }

  /**
   * Logout user
   */
  const logout = () => {
    try {
      removeLocalStorageItem(TOKEN_KEY)
      setUser(null)
      setIsAuthenticated(false)
      setToken(null)
      console.log('🔒 User logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  /**
   * Refresh authentication token
   */
  const refreshToken = async () => {
    try {
      if (!token) return false

      const newToken = await refreshMockJWT(token)
      if (newToken) {
        setLocalStorageItem(TOKEN_KEY, newToken, false)
        setToken(newToken)
        console.log('🔒 Token refreshed successfully')
        return true
      } else {
        // Refresh failed, logout user
        logout()
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      logout()
      return false
    }
  }

  /**
   * Check if user has specific role
   * 
   * @param {string} requiredRole - Required role
   * @returns {boolean} True if user has role
   */
  const hasRole = (requiredRole) => {
    return user?.role === requiredRole || user?.role === 'admin'
  }

  /**
   * Get current token info
   */
  const getTokenInfo = async () => {
    if (!token) return null
    
    const payload = await verifyMockJWT(token)
    return payload ? {
      isValid: true,
      expiresAt: new Date(payload.exp * 1000),
      issuedAt: new Date(payload.iat * 1000),
      timeUntilExpiry: payload.exp * 1000 - Date.now()
    } : null
  }

  // Auto-refresh token when it's close to expiring
  useEffect(() => {
    if (!token || !isAuthenticated) return

    let interval

    const checkToken = async () => {
      const tokenInfo = await getTokenInfo()
      if (!tokenInfo) return

      if (tokenInfo.timeUntilExpiry < SECURITY.TOKEN_REFRESH_THRESHOLD_MS && tokenInfo.timeUntilExpiry > 0) {
        refreshToken()
      }
    }

    checkToken()

    interval = setInterval(async () => {
      const currentTokenInfo = await getTokenInfo()
      if (!currentTokenInfo || currentTokenInfo.timeUntilExpiry <= 0) {
        logout()
      }
    }, SECURITY.TOKEN_CHECK_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [token, isAuthenticated])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    register,
    logout,
    refreshToken,
    hasRole,
    getTokenInfo
  }

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  )
}

SecureAuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}

/**
 * Hook to access secure authentication context
 * 
 * @returns {Object} Authentication context
 * @throws {Error} When used outside SecureAuthProvider
 */
export function useSecureAuth() {
  const context = useContext(SecureAuthContext)
  if (!context) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider')
  }
  return context
}

export default SecureAuthContext