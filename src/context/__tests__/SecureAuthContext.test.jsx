import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { SecureAuthProvider, useSecureAuth } from '../SecureAuthContext'
import { mockLocalStorage } from '../../test/utils'
import * as mockJWT from '../../utils/mockJWT'
import * as security from '../../utils/security'

// Mock dependencies
vi.mock('../../utils/mockJWT')
vi.mock('../../utils/security')

describe('SecureAuthContext', () => {
  let mockStorage

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock localStorage
    mockStorage = mockLocalStorage()
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    })
    
    // Mock JWT utilities
    mockJWT.createMockJWT.mockReturnValue('mock-jwt-token')
    mockJWT.verifyMockJWT.mockReturnValue({
      userId: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
    })
    mockJWT.isTokenExpired.mockReturnValue(false)
    mockJWT.getUserFromToken.mockReturnValue({
      userId: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user'
    })
    
    // Mock security utilities
    security.mockJWTUtils = {
      sanitizeInput: vi.fn((input) => input),
      hashPassword: vi.fn((password) => `hashed_${password}`),
      verifyPassword: vi.fn((password, hash) => hash === `hashed_${password}`)
    }
    
    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const renderAuthHook = (initialUser = null) => {
    const wrapper = ({ children }) => (
      <SecureAuthProvider initialUser={initialUser}>
        {children}
      </SecureAuthProvider>
    )
    
    return renderHook(() => useSecureAuth(), { wrapper })
  }

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderAuthHook()
      
      expect(result.current.user).toBe(null)
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.isLoading).toBe(true) // Initially loading
      expect(result.current.token).toBe(null)
    })

    it('should restore session from valid token', async () => {
      mockStorage.getItem.mockReturnValue('valid-token')
      
      const { result } = renderAuthHook()
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(mockJWT.isTokenExpired).toHaveBeenCalledWith('valid-token')
      expect(mockJWT.getUserFromToken).toHaveBeenCalledWith('valid-token')
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual({
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      })
    })

    it('should clear expired token on initialization', async () => {
      mockStorage.getItem.mockReturnValue('expired-token')
      mockJWT.isTokenExpired.mockReturnValue(true)
      
      const { result } = renderAuthHook()
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(mockStorage.removeItem).toHaveBeenCalledWith('ai_casemanager_token')
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should initialize demo users in localStorage', async () => {
      mockStorage.getItem.mockReturnValue(null) // No existing users
      
      renderAuthHook()
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'ai_casemanager_users_secure',
        expect.stringContaining('Demo User')
      )
    })
  })

  describe('Registration', () => {
    it('should register new user successfully', async () => {
      mockStorage.getItem.mockReturnValue('[]') // Empty users array
      
      const { result } = renderAuthHook()
      
      const userData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123'
      }
      
      let registrationResult
      await act(async () => {
        registrationResult = await result.current.register(userData)
      })
      
      expect(registrationResult.success).toBe(true)
      expect(registrationResult.user).toEqual({
        userId: expect.any(Number),
        email: 'new@example.com',
        name: 'New User',
        role: 'user'
      })
      
      expect(security.mockJWTUtils.sanitizeInput).toHaveBeenCalledWith('New User')
      expect(security.mockJWTUtils.sanitizeInput).toHaveBeenCalledWith('new@example.com')
      expect(security.mockJWTUtils.hashPassword).toHaveBeenCalledWith('password123')
      expect(mockJWT.createMockJWT).toHaveBeenCalled()
    })

    it('should reject registration with missing fields', async () => {
      const { result } = renderAuthHook()
      
      let registrationResult
      await act(async () => {
        registrationResult = await result.current.register({
          name: '',
          email: 'test@example.com',
          password: 'password'
        })
      })
      
      expect(registrationResult.success).toBe(false)
      expect(registrationResult.error).toBe('All fields are required')
    })

    it('should reject weak passwords', async () => {
      const { result } = renderAuthHook()
      
      let registrationResult
      await act(async () => {
        registrationResult = await result.current.register({
          name: 'Test User',
          email: 'test@example.com',
          password: '123' // Too short
        })
      })
      
      expect(registrationResult.success).toBe(false)
      expect(registrationResult.error).toBe('Password must be at least 6 characters')
    })

    it('should reject duplicate email addresses', async () => {
      const existingUsers = JSON.stringify([{
        id: 1,
        email: 'existing@example.com',
        name: 'Existing User'
      }])
      
      mockStorage.getItem.mockReturnValue(existingUsers)
      
      const { result } = renderAuthHook()
      
      let registrationResult
      await act(async () => {
        registrationResult = await result.current.register({
          name: 'New User',
          email: 'existing@example.com',
          password: 'password123'
        })
      })
      
      expect(registrationResult.success).toBe(false)
      expect(registrationResult.error).toBe('User already exists')
    })
  })

  describe('Login', () => {
    beforeEach(() => {
      const users = JSON.stringify([{
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashed_password123',
        role: 'user'
      }])
      
      mockStorage.getItem.mockReturnValue(users)
    })

    it('should login successfully with correct credentials', async () => {
      const { result } = renderAuthHook()
      
      let loginResult
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'password123')
      })
      
      expect(loginResult.success).toBe(true)
      expect(loginResult.user).toEqual({
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      })
      
      expect(security.mockJWTUtils.verifyPassword).toHaveBeenCalledWith('password123', 'hashed_password123')
      expect(mockJWT.createMockJWT).toHaveBeenCalled()
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('should reject login with incorrect password', async () => {
      security.mockJWTUtils.verifyPassword.mockReturnValue(false)
      
      const { result } = renderAuthHook()
      
      let loginResult
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'wrongpassword')
      })
      
      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe('Invalid credentials')
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should reject login with non-existent email', async () => {
      const { result } = renderAuthHook()
      
      let loginResult
      await act(async () => {
        loginResult = await result.current.login('nonexistent@example.com', 'password123')
      })
      
      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe('Invalid credentials')
    })

    it('should sanitize email input', async () => {
      const { result } = renderAuthHook()
      
      await act(async () => {
        await result.current.login('  TEST@EXAMPLE.COM  ', 'password123')
      })
      
      expect(security.mockJWTUtils.sanitizeInput).toHaveBeenCalledWith('  test@example.com  ')
    })

    it('should require both email and password', async () => {
      const { result } = renderAuthHook()
      
      let loginResult
      await act(async () => {
        loginResult = await result.current.login('', 'password')
      })
      
      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe('Email and password are required')
    })
  })

  describe('Logout', () => {
    it('should logout and clear session', async () => {
      const { result } = renderAuthHook()
      
      // First login
      await act(async () => {
        await result.current.login('test@example.com', 'password123')
      })
      
      expect(result.current.isAuthenticated).toBe(true)
      
      // Then logout
      act(() => {
        result.current.logout()
      })
      
      expect(result.current.user).toBe(null)
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.token).toBe(null)
      expect(mockStorage.removeItem).toHaveBeenCalledWith('ai_casemanager_token')
    })
  })

  describe('Token Management', () => {
    it('should refresh token successfully', async () => {
      mockJWT.refreshMockJWT.mockReturnValue('new-token')
      
      const { result } = renderAuthHook()
      
      // Set initial token
      await act(async () => {
        await result.current.login('test@example.com', 'password123')
      })
      
      let refreshResult
      await act(async () => {
        refreshResult = await result.current.refreshToken()
      })
      
      expect(refreshResult).toBe(true)
      expect(mockJWT.refreshMockJWT).toHaveBeenCalledWith('mock-jwt-token')
      expect(mockStorage.setItem).toHaveBeenCalledWith('ai_casemanager_token', 'new-token')
    })

    it('should logout when token refresh fails', async () => {
      mockJWT.refreshMockJWT.mockReturnValue(null)
      
      const { result } = renderAuthHook()
      
      // Set initial token
      await act(async () => {
        await result.current.login('test@example.com', 'password123')
      })
      
      let refreshResult
      await act(async () => {
        refreshResult = await result.current.refreshToken()
      })
      
      expect(refreshResult).toBe(false)
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should get token info correctly', async () => {
      const mockPayload = {
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      }
      
      mockJWT.verifyMockJWT.mockReturnValue(mockPayload)
      
      const { result } = renderAuthHook()
      
      await act(async () => {
        await result.current.login('test@example.com', 'password123')
      })
      
      const tokenInfo = result.current.getTokenInfo()
      
      expect(tokenInfo).toEqual({
        isValid: true,
        expiresAt: new Date(mockPayload.exp * 1000),
        issuedAt: new Date(mockPayload.iat * 1000),
        timeUntilExpiry: expect.any(Number)
      })
    })
  })

  describe('Role-based Access', () => {
    it('should check user roles correctly', async () => {
      const { result } = renderAuthHook()
      
      await act(async () => {
        await result.current.login('test@example.com', 'password123')
      })
      
      expect(result.current.hasRole('user')).toBe(true)
      expect(result.current.hasRole('admin')).toBe(false)
    })

    it('should allow admin access to all roles', async () => {
      mockJWT.getUserFromToken.mockReturnValue({
        userId: 1,
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin'
      })
      
      const { result } = renderAuthHook()
      
      await act(async () => {
        await result.current.login('admin@example.com', 'password123')
      })
      
      expect(result.current.hasRole('user')).toBe(true)
      expect(result.current.hasRole('admin')).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', async () => {
      mockStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      expect(() => {
        renderAuthHook()
      }).not.toThrow()
    })

    it('should handle JSON parsing errors', async () => {
      mockStorage.getItem.mockReturnValue('invalid-json')
      
      const { result } = renderAuthHook()
      
      let loginResult
      await act(async () => {
        loginResult = await result.current.login('test@example.com', 'password123')
      })
      
      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toBe('Login failed')
    })
  })

  describe('Hook Usage', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useSecureAuth())
      }).toThrow('useSecureAuth must be used within a SecureAuthProvider')
    })
  })
})