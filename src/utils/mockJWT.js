/**
 * JWT Implementation using Web Crypto API (HMAC-SHA256)
 *
 * Tokens are signed with a per-session secret derived from a stored key so
 * they cannot be forged by simply base64-encoding an arbitrary payload.
 *
 * The secret is persisted in localStorage so tokens survive page reloads
 * within the same browser, but are invalid in any other context.
 *
 * Still client-side only — for production use server-side signing.
 */

const SECRET_KEY = 'ai_casemanager_jwt_secret'

// ---------------------------------------------------------------------------
// Crypto helpers
// ---------------------------------------------------------------------------

/** Get or create a stable HMAC-SHA256 CryptoKey for this browser session. */
async function getSigningKey() {
  let secret = localStorage.getItem(SECRET_KEY)
  if (!secret) {
    const bytes = crypto.getRandomValues(new Uint8Array(32))
    secret = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
    localStorage.setItem(SECRET_KEY, secret)
  }

  const keyMaterial = new TextEncoder().encode(secret)
  return crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function base64UrlEncode(bytes) {
  // Accept Uint8Array or string
  const arr = typeof bytes === 'string'
    ? new TextEncoder().encode(bytes)
    : bytes
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function base64UrlDecode(str) {
  str += '='.repeat((4 - (str.length % 4)) % 4)
  return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
}

function encodeJson(obj) {
  return base64UrlEncode(new TextEncoder().encode(JSON.stringify(obj)))
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create a signed JWT token (async — uses Web Crypto HMAC-SHA256).
 *
 * @param {Object} payload
 * @param {{ expiresIn?: string }} options  e.g. { expiresIn: '24h' }
 * @returns {Promise<string>} Signed JWT string
 */
export async function createMockJWT(payload, options = {}) {
  const { expiresIn = '24h' } = options
  const now = Math.floor(Date.now() / 1000)

  let exp = now + 24 * 60 * 60
  if (typeof expiresIn === 'string') {
    if (expiresIn.endsWith('h')) exp = now + parseInt(expiresIn) * 3600
    else if (expiresIn.endsWith('m')) exp = now + parseInt(expiresIn) * 60
    else if (expiresIn.endsWith('s')) exp = now + parseInt(expiresIn)
  }

  const header = encodeJson({ alg: 'HS256', typ: 'JWT' })
  const body = encodeJson({ ...payload, iat: now, exp, iss: 'ai-case-manager', aud: 'app-client' })
  const signingInput = `${header}.${body}`

  const key = await getSigningKey()
  const sigBytes = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(signingInput)
  )

  const signature = base64UrlEncode(new Uint8Array(sigBytes))
  return `${signingInput}.${signature}`
}

/**
 * Verify a JWT token signature and expiration.
 *
 * @param {string} token
 * @returns {Promise<Object|null>} Decoded payload or null if invalid/expired
 */
export async function verifyMockJWT(token) {
  try {
    if (!token || typeof token !== 'string') return null

    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [encodedHeader, encodedPayload, signature] = parts
    const signingInput = `${encodedHeader}.${encodedPayload}`

    // Decode the stored signature back to bytes
    const sigStr = base64UrlDecode(signature)
    const sigBytes = Uint8Array.from(sigStr, c => c.charCodeAt(0))

    const key = await getSigningKey()
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(signingInput)
    )

    if (!valid) {
      console.warn('🔒 JWT: Invalid signature')
      return null
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload))

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.warn('🔒 JWT: Token expired')
      return null
    }

    return payload
  } catch (error) {
    console.warn('🔒 JWT: Verification failed', error)
    return null
  }
}

/**
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export async function isTokenExpired(token) {
  const payload = await verifyMockJWT(token)
  return !payload
}

/**
 * @param {string} token
 * @returns {Promise<Date|null>}
 */
export async function getTokenExpiration(token) {
  const payload = await verifyMockJWT(token)
  return payload?.exp ? new Date(payload.exp * 1000) : null
}

/**
 * Re-sign a token with a fresh expiration.
 *
 * @param {string} token
 * @returns {Promise<string|null>}
 */
export async function refreshMockJWT(token) {
  const payload = await verifyMockJWT(token)
  if (!payload) return null
  const { iat, exp, iss, aud, ...userPayload } = payload
  return createMockJWT(userPayload, { expiresIn: '24h' })
}

/**
 * Extract user fields from a verified token.
 *
 * @param {string} token
 * @returns {Promise<Object|null>}
 */
export async function getUserFromToken(token) {
  const payload = await verifyMockJWT(token)
  if (!payload) return null
  const { iat, exp, iss, aud, ...userInfo } = payload
  return userInfo
}

/**
 * Misc security utilities (sanitization only — password hashing is server-side).
 */
export const mockJWTUtils = {
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim()
  },
}
