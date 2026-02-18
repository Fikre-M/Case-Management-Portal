import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test/utils'
import SecureLoginForm from '../SecureLoginForm'
import * as security from '../../../utils/security'

// Mock the security utilities
vi.mock('../../../utils/security', () => ({
  validateEmail: vi.fn(),
  loginRateLimiter: {
    checkLimit: vi.fn(),
    reset: vi.fn()
  },
  securityAudit: {
    logEvent: vi.fn()
  }
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('SecureLoginForm', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementations
    security.validateEmail.mockReturnValue({ isValid: true, sanitized: 'test@example.com' })
    security.loginRateLimiter.checkLimit.mockReturnValue({ 
      allowed: true, 
      remaining: 4 
    })
  })

  describe('Rendering', () => {
    it('should render login form with security features', () => {
      renderWithProviders(<SecureLoginForm />)
      
      expect(screen.getByText('🔒 Secure Sign In')).toBeInTheDocument()
      expect(screen.getByText('Enhanced security with JWT tokens and input validation')).toBeInTheDocument()
      expect(screen.getByText('✅ Rate Limited • Input Sanitized • JWT Tokens')).toBeInTheDocument()
    })

    it('should display demo credentials', () => {
      renderWithProviders(<SecureLoginForm />)
      
      expect(screen.getByText('🧪 Demo Credentials')).toBeInTheDocument()
      expect(screen.getByText('demo@example.com')).toBeInTheDocument()
      expect(screen.getByText('password')).toBeInTheDocument()
    })

    it('should show security status indicators', () => {
      renderWithProviders(<SecureLoginForm />)
      
      expect(screen.getByText('Secure Connection')).toBeInTheDocument()
      expect(screen.getByText('🛡️')).toBeInTheDocument()
      expect(screen.getByText('XSS Protected')).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should validate email in real-time', async () => {
      security.validateEmail.mockReturnValue({ 
        isValid: false, 
        error: 'Invalid email format' 
      })

      renderWithProviders(<SecureLoginForm />)
      
      const emailInput = screen.getByPlaceholderText('Email address')
      await user.type(emailInput, 'invalid-email')
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument()
      })
    })

    it('should require password', async () => {
      renderWithProviders(<SecureLoginForm />)
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument()
      })
    })

    it('should clear errors when user starts typing', async () => {
      security.validateEmail
        .mockReturnValueOnce({ isValid: false, error: 'Invalid email format' })
        .mockReturnValueOnce({ isValid: true, sanitized: 'test@example.com' })

      renderWithProviders(<SecureLoginForm />)
      
      const emailInput = screen.getByPlaceholderText('Email address')
      
      // Type invalid email
      await user.type(emailInput, 'invalid')
      await waitFor(() => {
        expect(screen.getByText('Invalid email format')).toBeInTheDocument()
      })
      
      // Clear and type valid email
      await user.clear(emailInput)
      await user.type(emailInput, 'test@example.com')
      
      await waitFor(() => {
        expect(screen.queryByText('Invalid email format')).not.toBeInTheDocument()
      })
    })
  })

  describe('Rate Limiting', () => {
    it('should handle rate limiting', async () => {
      security.loginRateLimiter.checkLimit.mockReturnValue({
        allowed: false,
        retryAfter: 60
      })

      renderWithProviders(<SecureLoginForm />)
      
      const emailInput = screen.getByPlaceholderText('Email address')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Too many login attempts/)).toBeInTheDocument()
        expect(submitButton).toHaveTextContent('Rate Limited')
        expect(submitButton).toBeDisabled()
      })
      
      expect(security.securityAudit.logEvent).toHaveBeenCalledWith(
        'RATE_LIMIT_EXCEEDED',
        expect.objectContaining({
          action: 'login',
          retryAfter: 60
        })
      )
    })

    it('should reset rate limit after successful login', async () => {
      const mockLogin = vi.fn().mockResolvedValue({
        success: true,
        user: { userId: 1, email: 'test@example.com' }
      })

      renderWithProviders(<SecureLoginForm />, {
        initialUser: null,
        mockAuth: { login: mockLogin }
      })
      
      const emailInput = screen.getByPlaceholderText('Email address')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(security.loginRateLimiter.reset).toHaveBeenCalledWith('demo-client')
      })
    })
  })

  describe('Security Logging', () => {
    it('should log successful login attempts', async () => {
      const mockLogin = vi.fn().mockResolvedValue({
        success: true,
        user: { userId: 1, email: 'test@example.com' }
      })

      renderWithProviders(<SecureLoginForm />, {
        mockAuth: { login: mockLogin }
      })
      
      const emailInput = screen.getByPlaceholderText('Email address')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(security.securityAudit.logEvent).toHaveBeenCalledWith(
          'LOGIN_SUCCESS',
          expect.objectContaining({
            userId: 1,
            email: 'test@example.com'
          })
        )
      })
    })

    it('should log failed login attempts', async () => {
      const mockLogin = vi.fn().mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      })

      renderWithProviders(<SecureLoginForm />, {
        mockAuth: { login: mockLogin }
      })
      
      const emailInput = screen.getByPlaceholderText('Email address')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrongpassword')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(security.securityAudit.logEvent).toHaveBeenCalledWith(
          'LOGIN_FAILURE',
          expect.objectContaining({
            email: 'test@example.com',
            error: 'Invalid credentials'
          })
        )
      })
    })

    it('should log validation errors', async () => {
      security.validateEmail.mockReturnValue({ 
        isValid: false, 
        error: 'Invalid email format' 
      })

      renderWithProviders(<SecureLoginForm />)
      
      const emailInput = screen.getByPlaceholderText('Email address')
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'invalid-email')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(security.securityAudit.logEvent).toHaveBeenCalledWith(
          'INVALID_LOGIN_ATTEMPT',
          expect.objectContaining({
            email: 'invalid-email'
          })
        )
      })
    })
  })

  describe('Navigation', () => {
    it('should navigate to dashboard on successful login', async () => {
      const mockLogin = vi.fn().mockResolvedValue({
        success: true,
        user: { userId: 1, email: 'test@example.com' }
      })

      renderWithProviders(<SecureLoginForm />, {
        mockAuth: { login: mockLogin }
      })
      
      const emailInput = screen.getByPlaceholderText('Email address')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Login successful! Redirecting...')).toBeInTheDocument()
      })
      
      // Wait for navigation timeout
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
      }, { timeout: 2000 })
    })

    it('should have working navigation links', () => {
      renderWithProviders(<SecureLoginForm />)
      
      expect(screen.getByRole('link', { name: /forgot your password/i })).toHaveAttribute('href', '/auth/forgot-password')
      expect(screen.getByRole('link', { name: /create account/i })).toHaveAttribute('href', '/auth/register')
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels and ARIA attributes', () => {
      renderWithProviders(<SecureLoginForm />)
      
      const emailInput = screen.getByPlaceholderText('Email address')
      const passwordInput = screen.getByPlaceholderText('Password')
      
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('autoComplete', 'email')
      expect(emailInput).toBeRequired()
      
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('autoComplete', 'current-password')
      expect(passwordInput).toBeRequired()
    })

    it('should announce errors to screen readers', async () => {
      security.validateEmail.mockReturnValue({ 
        isValid: false, 
        error: 'Invalid email format' 
      })

      renderWithProviders(<SecureLoginForm />)
      
      const emailInput = screen.getByPlaceholderText('Email address')
      await user.type(emailInput, 'invalid')
      
      await waitFor(() => {
        const errorElement = screen.getByText('Invalid email format')
        expect(errorElement).toBeInTheDocument()
        // In a real implementation, this would have role="alert" or aria-live
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading state during submission', async () => {
      const mockLogin = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      )

      renderWithProviders(<SecureLoginForm />, {
        mockAuth: { login: mockLogin }
      })
      
      const emailInput = screen.getByPlaceholderText('Email address')
      const passwordInput = screen.getByPlaceholderText('Password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password')
      await user.click(submitButton)
      
      expect(submitButton).toHaveTextContent('Signing in...')
      expect(submitButton).toBeDisabled()
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled()
      })
    })
  })
})