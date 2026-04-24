/**
 * CSRF protection utilities for Netlify auth functions.
 *
 * Strategy:
 *  1. Require the custom `X-Requested-With: XMLHttpRequest` header — custom
 *     headers trigger a CORS preflight, so cross-origin requests that skip
 *     the preflight (plain HTML forms, img tags, etc.) are rejected.
 *  2. Validate the `Origin` (or `Referer`) header against an allowlist so
 *     even a preflight-passing attacker origin is blocked.
 */

const ALLOWED_ORIGINS = (() => {
  const list = [
    process.env.URL,               // Netlify deploy URL  e.g. https://myapp.netlify.app
    process.env.DEPLOY_PRIME_URL,  // Branch deploy URL
    process.env.VITE_APP_URL,      // Optional explicit override
    'http://localhost:5173',       // Vite dev server
    'http://localhost:8888',       // Netlify CLI dev server
  ]
  return new Set(list.filter(Boolean))
})()

/**
 * Validates CSRF-related request headers.
 * @param {object} headers - The event.headers object from a Netlify function
 * @returns {{ ok: boolean, error?: string }}
 */
export function validateCsrf(headers) {
  // 1. Custom header check — blocks plain cross-origin form posts
  const requestedWith = headers['x-requested-with'] || headers['X-Requested-With'] || ''
  if (requestedWith.toLowerCase() !== 'xmlhttprequest') {
    return { ok: false, error: 'Forbidden: missing X-Requested-With header' }
  }

  // 2. Origin / Referer check
  const origin = headers['origin'] || headers['Origin'] || ''
  const referer = headers['referer'] || headers['Referer'] || ''

  const requestOrigin = origin || (referer ? new URL(referer).origin : '')

  if (!requestOrigin) {
    return { ok: false, error: 'Forbidden: missing Origin header' }
  }

  if (!ALLOWED_ORIGINS.has(requestOrigin)) {
    return { ok: false, error: `Forbidden: untrusted origin ${requestOrigin}` }
  }

  return { ok: true }
}

/**
 * Builds CORS headers that restrict which origins may call the function.
 * @param {string} requestOrigin - The Origin header value from the request
 * @returns {object} Headers object
 */
export function corsHeaders(requestOrigin) {
  const allowed = ALLOWED_ORIGINS.has(requestOrigin) ? requestOrigin : ''
  return {
    'Access-Control-Allow-Origin': allowed || 'null',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }
}
