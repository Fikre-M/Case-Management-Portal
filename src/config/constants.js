/**
 * Application-wide constants
 *
 * All magic numbers and repeated literals live here.
 * Import from this file instead of scattering raw values across the codebase.
 */

// ---------------------------------------------------------------------------
// Session & Authentication
// ---------------------------------------------------------------------------

export const SESSION_TIMEOUT_MS   = 24 * 60 * 60 * 1000  // 24 hours
export const JWT_EXPIRY            = '24h'
export const BCRYPT_SALT_ROUNDS    = 12

// localStorage keys
export const STORAGE_KEYS = {
  CURRENT_USER:    'ai_casemanager_current_user',
  JWT_SECRET:      'ai_casemanager_jwt_secret',
  SECURE_USERS:    'ai_casemanager_users_secure',
  TOKEN:           'ai_casemanager_token',
  AI_CHAT_HISTORY: 'aiChatHistory',
  AI_CONVERSATIONS:'aiConversations',
  AI_SETTINGS:     'aiSettings',
}

// ---------------------------------------------------------------------------
// Rate Limiting
// ---------------------------------------------------------------------------

export const RATE_LIMIT = {
  DELAY_MS:           2000,   // minimum ms between requests
  WINDOW_MS:          60000,  // rolling window length (1 minute)
  MAX_PER_WINDOW:     20,     // max requests per window
  LOGIN_MAX_ATTEMPTS: 5,
  LOGIN_WINDOW_MS:    15 * 60 * 1000, // 15 minutes
}

// ---------------------------------------------------------------------------
// AI Service
// ---------------------------------------------------------------------------

export const AI = {
  MAX_OUTPUT_TOKENS:  1000,
  TEMPERATURE:        0.7,
  MOCK_DELAY_MIN_MS:  500,
  MOCK_DELAY_RANGE_MS:1000,   // random jitter added to MIN
  MODEL:              'gemini-1.5-flash',
}

// ---------------------------------------------------------------------------
// Error / Notification display
// ---------------------------------------------------------------------------

export const TOAST_DURATION = {
  SHORT:   3000,
  DEFAULT: 5000,
  LONG:    4000,  // warnings
}

// ---------------------------------------------------------------------------
// UI / Pagination
// ---------------------------------------------------------------------------

export const UI = {
  UPCOMING_APPOINTMENTS_LIMIT: 5,
  RECENT_CASES_LIMIT:          5,
  TRUNCATE_TEXT_LENGTH:        50,
  AUDIT_LOG_MAX_EVENTS:        100,
  DEFAULT_INPUT_MAX_LENGTH:    1000,
}

// ---------------------------------------------------------------------------
// Security
// ---------------------------------------------------------------------------

export const SECURITY = {
  RANDOM_BYTES:          32,   // bytes for JWT signing key generation
  TOKEN_REFRESH_THRESHOLD_MS: 60 * 60 * 1000, // refresh when < 1 hour left
  TOKEN_CHECK_INTERVAL_MS:    60 * 1000,       // check expiry every minute
}
