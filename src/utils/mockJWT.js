/**
 * Mock JWT Implementation for Demo Purposes
 * 
 * This provides a more realistic authentication pattern while still being
 * client-side only for demonstration. In production, JWT signing/verification
 * would happen on the server with proper secret management.
 * 
 * 🔴 DEMO ONLY - NOT SECURE FOR PRODUCTION 🔴
 */

/**
 * Mock JWT secret (in production, this would be server-side only)
 */
const MOCK_JWT_SECRET = 'demo-secret-key-not-for-production'

/**
 * Base64 URL encode (simplified for demo)
 */
function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Base64 URL decode (simplified for demo)
 */
function base64UrlDecode(str) {
  // Add padding if needed
  str += '='.repeat((4 - str.length % 4) % 4)
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
}

/**
 * Create a mock JWT token
 * 
 * @param {Object} payload - Token payload
 * @param {Object} options - Token options
 * @returns {string} Mock JWT token
 * 
 * @example
 * const token = createMockJWT({
 *   userId: 1,
 *   email: 'user@example.com',
 *   role: 'admin'
 * }, { expiresIn: '24h' })
 */
export function createMockJWT(payload, options = {}) {
  const { expiresIn = '24h' } = options
  
  // Calculate expiration time
  const now = Math.floor(Date.now() / 1000)
  let exp = now + (24 * 60 * 60) // Default 24 hours
  
  if (expiresIn.endsWith('h')) {
    const hours = parseInt(expiresIn)
    exp = now + (hours * 60 * 60)
  } else if (expiresIn.endsWith('m')) {
    const minutes = parseInt(expiresIn)
    exp = now + (minutes * 60)
  }
  
  // JWT Header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }
  
  // JWT Payload
  const jwtPayload = {
    ...payload,
    iat: now, // Issued at
    exp: exp, // Expires at
    iss: 'ai-case-manager-demo', // Issuer
    aud: 'demo-client' // Audience
  }
  
  // Encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload))
  
  // Create signature (mock - in production this would use proper HMAC)
  const signature = base64UrlEncode(`${encodedHeader}.${encodedPayload}.${MOCK_JWT_SECRET}`)
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

/**
 * Verify and decode a mock JWT token
 * 
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 * 
 * @example
 * const payload = verifyMockJWT(token)
 * if (payload) {
 *   console.log('User ID:', payload.userId)
 * }
 */
export function verifyMockJWT(token) {
  try {
    if (!token || typeof token !== 'string') {
      return null
    }
    
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    
    const [encodedHeader, encodedPayload, signature] = parts
    
    // Verify signature (mock verification)
    const expectedSignature = base64UrlEncode(`${encodedHeader}.${encodedPayload}.${MOCK_JWT_SECRET}`)
    if (signature !== expectedSignature) {
      console.warn('🔒 Mock JWT: Invalid signature')
      return null
    }
    
    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload))
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      console.warn('🔒 Mock JWT: Token expired')
      return null
    }
    
    return payload
  } catch (error) {
    console.warn('🔒 Mock JWT: Invalid token format', error)
    return null
  }
}

/**
 * Check if a JWT token is expired
 * 
 * @param {string} token - JWT token to check
 * @returns {boolean} True if expired
 */
export function isTokenExpired(token) {
  const payload = verifyMockJWT(token)
  return !payload // If verification fails, consider it expired
}

/**
 * Get token expiration time
 * 
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null if invalid
 */
export function getTokenExpiration(token) {
  const payload = verifyMockJWT(token)
  return payload?.exp ? new Date(payload.exp * 1000) : null
}

/**
 * Refresh a token (mock implementation)
 * 
 * @param {string} token - Current token
 * @returns {string|null} New token or null if refresh failed
 */
export function refreshMockJWT(token) {
  const payload = verifyMockJWT(token)
  if (!payload) {
    return null
  }
  
  // Create new token with same payload but new expiration
  const { iat, exp, ...userPayload } = payload
  return createMockJWT(userPayload, { expiresIn: '24h' })
}

/**
 * Extract user info from token
 * 
 * @param {string} token - JWT token
 * @returns {Object|null} User information or null
 */
export function getUserFromToken(token) {
  const payload = verifyMockJWT(token)
  if (!payload) {
    return null
  }
  
  // Extract user-specific fields
  const { iat, exp, iss, aud, ...userInfo } = payload
  return userInfo
}

/**
 * Security utilities for demo
 */
export const mockJWTUtils = {
  /**
   * Generate a secure random string (mock implementation)
   */
  generateSecureRandom: () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  },
  
  /**
   * Hash a password (mock implementation - use bcrypt in production)
   */
  hashPassword: (password) => {
    // 🔴 DEMO ONLY - Use bcrypt/argon2 in production
    const salt = 'demo-salt'
    return btoa(`${salt}:${password}:hashed`)
  },
  
  /**
   * Verify a password (mock implementation)
   */
  verifyPassword: (password, hash) => {
    // 🔴 DEMO ONLY - Use bcrypt/argon2 in production
    const expectedHash = mockJWTUtils.hashPassword(password)
    return hash === expectedHash
  },
  
  /**
   * Sanitize user input (basic implementation)
   */
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim()
  }
}