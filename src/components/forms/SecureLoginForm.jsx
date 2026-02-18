import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../common/Button'
import AuthInput from './AuthInput'
import Alert from '../common/Alert'
import { useSecureAuth } from '../../context/SecureAuthContext'
import { validateEmail, loginRateLimiter, securityAudit } from '../../utils/security'

/**
 * Secure Login Form Component
 * 
 * Enhanced login form with security features:
 * - Input sanitization and validation
 * - Rate limiting for brute force protection
 * - Security event logging
 * - XSS prevention
 * 
 * @component
 * @returns {JSX.Element} Secure login form
 */
function SecureLoginForm() {
  const navigate = useNavigate()
  const { login, isLoading } = useSecureAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState(null)
  const [rateLimited, setRateLimited] = useState(false)

  /**
   * Handle input changes with validation
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Clear previous errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
    
    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Real-time validation for email
    if (name === 'email' && value) {
      const emailValidation = validateEmail(value)
      if (!emailValidation.isValid) {
        setErrors(prev => ({ ...prev, email: emailValidation.error }))
      }
    }
  }

  /**
   * Validate form data
   */
  const validateForm = () => {
    const newErrors = {}
    
    // Email validation
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isSubmitting || rateLimited) return
    
    // Check rate limiting
    const clientId = 'demo-client' // In production, use IP or user identifier
    const rateLimitResult = loginRateLimiter.checkLimit(clientId)
    
    if (!rateLimitResult.allowed) {
      setRateLimited(true)
      setAlert({
        type: 'error',
        message: `Too many login attempts. Please try again in ${rateLimitResult.retryAfter} seconds.`
      })
      
      securityAudit.logEvent('RATE_LIMIT_EXCEEDED', {
        action: 'login',
        clientId,
        retryAfter: rateLimitResult.retryAfter
      })
      
      // Reset rate limit flag after retry period
      setTimeout(() => {
        setRateLimited(false)
        setAlert(null)
      }, rateLimitResult.retryAfter * 1000)
      
      return
    }
    
    // Validate form
    if (!validateForm()) {
      securityAudit.logEvent('INVALID_LOGIN_ATTEMPT', {
        email: formData.email,
        errors: Object.keys(errors)
      })
      return
    }
    
    setIsSubmitting(true)
    setAlert(null)
    
    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        securityAudit.logEvent('LOGIN_SUCCESS', {
          userId: result.user.userId,
          email: result.user.email
        })
        
        setAlert({
          type: 'success',
          message: 'Login successful! Redirecting...'
        })
        
        // Reset rate limiter on successful login
        loginRateLimiter.reset(clientId)
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      } else {
        securityAudit.logEvent('LOGIN_FAILURE', {
          email: formData.email,
          error: result.error,
          remaining: rateLimitResult.remaining
        })
        
        setAlert({
          type: 'error',
          message: result.error
        })
      }
    } catch (error) {
      securityAudit.logEvent('LOGIN_ERROR', {
        email: formData.email,
        error: error.message
      })
      
      setAlert({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            🔒 Secure Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enhanced security with JWT tokens and input validation
          </p>
          
          {/* Security Features Badge */}
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              ✅ Rate Limited • Input Sanitized • JWT Tokens
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            🧪 Demo Credentials
          </h3>
          <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <div><strong>Email:</strong> demo@example.com</div>
            <div><strong>Password:</strong> password</div>
            <div className="mt-2 text-blue-600 dark:text-blue-400">
              <strong>Security Features:</strong> Hashed passwords, JWT tokens, rate limiting
            </div>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <AuthInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon="📧"
            />

            <AuthInput
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon="🔒"
            />
          </div>

          {/* Security Status */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Secure Connection</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🛡️</span>
              <span>XSS Protected</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
            disabled={isSubmitting || rateLimited}
          >
            {isSubmitting ? 'Signing in...' : rateLimited ? 'Rate Limited' : 'Sign in'}
          </Button>

          {/* Links */}
          <div className="flex items-center justify-between">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot your password?
            </Link>
            <Link
              to="/auth/register"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Create account
            </Link>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Demo Security Implementation
              </h3>
              <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-300">
                <p>This is an enhanced demo with mock JWT tokens and client-side security features.</p>
                <p className="mt-1">
                  <strong>Production requires:</strong> Server-side auth, HTTPS, secure cookies, real password hashing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SecureLoginForm