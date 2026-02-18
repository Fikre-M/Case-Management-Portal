/**
 * Security Utilities for Input Sanitization and XSS Prevention
 * 
 * Provides client-side security utilities for demo purposes.
 * In production, always validate and sanitize on the server side as well.
 */

/**
 * HTML entity encoding map
 */
const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * 
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 * 
 * @example
 * const userInput = '<script>alert("xss")</script>'
 * const safe = sanitizeHTML(userInput)
 * // Result: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
export function sanitizeHTML(input) {
  if (typeof input !== 'string') {
    return input
  }
  
  return input.replace(/[&<>"'`=/]/g, (match) => HTML_ENTITIES[match])
}

/**
 * Sanitize user input for safe display
 * 
 * @param {string} input - Input to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input, options = {}) {
  const {
    allowHTML = false,
    maxLength = 1000,
    trimWhitespace = true,
    removeControlChars = true
  } = options
  
  if (typeof input !== 'string') {
    return input
  }
  
  let sanitized = input
  
  // Trim whitespace if requested
  if (trimWhitespace) {
    sanitized = sanitized.trim()
  }
  
  // Remove control characters
  if (removeControlChars) {
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '')
  }
  
  // Limit length
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  // Sanitize HTML if not allowed
  if (!allowHTML) {
    sanitized = sanitizeHTML(sanitized)
  }
  
  return sanitized
}

/**
 * Validate and sanitize email addresses
 * 
 * @param {string} email - Email to validate
 * @returns {Object} Validation result
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' }
  }
  
  const sanitized = sanitizeInput(email.toLowerCase(), { maxLength: 254 })
  
  // Basic email regex (not perfect but good for demo)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(sanitized)) {
    return { isValid: false, error: 'Invalid email format' }
  }
  
  // Check for common dangerous patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i
  ]
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      return { isValid: false, error: 'Invalid characters in email' }
    }
  }
  
  return { isValid: true, sanitized }
}

/**
 * Validate password strength
 * 
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength score
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required', strength: 0 }
  }
  
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    noCommonPatterns: !/^(password|123456|qwerty|admin)/i.test(password)
  }
  
  const passedChecks = Object.values(checks).filter(Boolean).length
  const strength = Math.round((passedChecks / Object.keys(checks).length) * 100)
  
  let error = null
  if (password.length < 6) {
    error = 'Password must be at least 6 characters'
  } else if (password.length < 8) {
    error = 'Password should be at least 8 characters for better security'
  } else if (!checks.noCommonPatterns) {
    error = 'Password is too common'
  }
  
  return {
    isValid: password.length >= 6 && checks.noCommonPatterns,
    error,
    strength,
    checks
  }
}

/**
 * Sanitize form data object
 * 
 * @param {Object} formData - Form data to sanitize
 * @param {Object} fieldConfig - Configuration for each field
 * @returns {Object} Sanitized form data
 * 
 * @example
 * const sanitized = sanitizeFormData({
 *   name: '<script>alert("xss")</script>',
 *   email: 'USER@EXAMPLE.COM',
 *   bio: 'Some bio text...'
 * }, {
 *   name: { maxLength: 50 },
 *   email: { type: 'email' },
 *   bio: { maxLength: 500, allowHTML: false }
 * })
 */
export function sanitizeFormData(formData, fieldConfig = {}) {
  const sanitized = {}
  
  for (const [key, value] of Object.entries(formData)) {
    const config = fieldConfig[key] || {}
    
    if (config.type === 'email') {
      const emailResult = validateEmail(value)
      sanitized[key] = emailResult.isValid ? emailResult.sanitized : value
    } else {
      sanitized[key] = sanitizeInput(value, config)
    }
  }
  
  return sanitized
}

/**
 * Content Security Policy helpers
 */
export const CSP = {
  /**
   * Generate nonce for inline scripts (demo implementation)
   */
  generateNonce: () => {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
  },
  
  /**
   * Basic CSP header for demo
   */
  getBasicCSP: () => {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // Note: unsafe-inline should be avoided in production
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  }
}

/**
 * Rate limiting utilities (client-side demo)
 */
export class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
    this.attempts = new Map()
  }
  
  /**
   * Check if action is rate limited
   * 
   * @param {string} key - Unique key for the action (e.g., IP, user ID)
   * @returns {Object} Rate limit result
   */
  checkLimit(key) {
    const now = Date.now()
    const userAttempts = this.attempts.get(key) || []
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(
      timestamp => now - timestamp < this.windowMs
    )
    
    if (recentAttempts.length >= this.maxAttempts) {
      const oldestAttempt = Math.min(...recentAttempts)
      const resetTime = oldestAttempt + this.windowMs
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(resetTime),
        retryAfter: Math.ceil((resetTime - now) / 1000)
      }
    }
    
    // Record this attempt
    recentAttempts.push(now)
    this.attempts.set(key, recentAttempts)
    
    return {
      allowed: true,
      remaining: this.maxAttempts - recentAttempts.length,
      resetTime: new Date(now + this.windowMs),
      retryAfter: 0
    }
  }
  
  /**
   * Reset attempts for a key
   */
  reset(key) {
    this.attempts.delete(key)
  }
}

/**
 * Security headers for demo
 */
export const SecurityHeaders = {
  /**
   * Get recommended security headers
   */
  getRecommendedHeaders: () => ({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Content-Security-Policy': CSP.getBasicCSP()
  }),
  
  /**
   * Apply headers to fetch requests
   */
  applyToFetch: (url, options = {}) => {
    const headers = SecurityHeaders.getRecommendedHeaders()
    return fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    })
  }
}

/**
 * Audit logging for security events
 */
export class SecurityAudit {
  constructor() {
    this.events = []
  }
  
  /**
   * Log a security event
   */
  logEvent(type, details = {}) {
    const event = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      type,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...details
    }
    
    this.events.push(event)
    
    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'development') {
      console.log('🔒 Security Event:', event)
    }
    
    // Keep only last 100 events in memory
    if (this.events.length > 100) {
      this.events = this.events.slice(-100)
    }
  }
  
  /**
   * Get security events
   */
  getEvents(type = null) {
    return type 
      ? this.events.filter(event => event.type === type)
      : this.events
  }
}

// Global security audit instance
export const securityAudit = new SecurityAudit()

// Global rate limiter for login attempts
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000) // 5 attempts per 15 minutes