/**
 * Environment-aware logger utility
 * Replaces console.log with structured, environment-aware logging
 */

// Log levels in order of severity
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  SILENT: 4
}

// Default configuration
const DEFAULT_CONFIG = {
  level: process.env.NODE_ENV === 'production' ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG,
  enableColors: true,
  enableTimestamps: process.env.NODE_ENV === 'development',
  enableStackTrace: process.env.NODE_ENV === 'development',
  maxLogSize: 1000, // Maximum characters for log messages
  prefix: 'AidFlow'
}

// ANSI color codes for terminal output
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
}

// Emoji icons for different log levels
const ICONS = {
  debug: '🔍',
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  success: '✅',
  security: '🔒',
  api: '🌐',
  ai: '🤖',
  auth: '🔐',
  validation: '✅',
  performance: '⚡'
}

class Logger {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.logs = [] // Store logs for debugging
    this.maxStoredLogs = 1000
  }

  /**
   * Set the log level
   * @param {string|number} level - Log level (DEBUG, INFO, WARN, ERROR, SILENT)
   */
  setLevel(level) {
    this.config.level = typeof level === 'string' ? LOG_LEVELS[level.toUpperCase()] : level
  }

  /**
   * Check if a log level should be output
   * @param {string} level - Log level to check
   * @returns {boolean}
   */
  shouldLog(level) {
    const currentLevel = typeof level === 'string' ? LOG_LEVELS[level.toUpperCase()] : level
    return currentLevel >= this.config.level
  }

  /**
   * Format timestamp
   * @returns {string}
   */
  formatTimestamp() {
    return new Date().toISOString()
  }

  /**
   * Colorize text for terminal output
   * @param {string} text - Text to colorize
   * @param {string} color - Color to use
   * @returns {string}
   */
  colorize(text, color) {
    if (!this.config.enableColors || !COLORS[color]) return text
    return `${COLORS[color]}${text}${COLORS.reset}`
  }

  /**
   * Format log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {any} data - Additional data
   * @param {string} icon - Icon to use
   * @returns {string}
   */
  formatMessage(level, message, data = null, icon = null) {
    const parts = []
    
    // Add timestamp if enabled
    if (this.config.enableTimestamps) {
      parts.push(this.colorize(`[${this.formatTimestamp()}]`, 'gray'))
    }

    // Add prefix
    parts.push(this.colorize(`[${this.config.prefix}]`, 'cyan'))

    // Add level
    const levelColor = {
      debug: 'dim',
      info: 'blue',
      warn: 'yellow',
      error: 'red'
    }[level.toLowerCase()] || 'white'

    parts.push(this.colorize(`[${level.toUpperCase()}]`, levelColor))

    // Add icon if provided
    if (icon) {
      parts.push(icon)
    }

    // Add message
    parts.push(message)

    const formattedMessage = parts.join(' ')

    // Add data if provided
    if (data) {
      const dataString = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      const truncatedData = dataString.length > this.config.maxLogSize 
        ? dataString.substring(0, this.config.maxLogSize) + '...' 
        : dataString
      return `${formattedMessage}\n${this.colorize(truncatedData, 'dim')}`
    }

    return formattedMessage
  }

  /**
   * Store log entry
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  storeLog(level, message, data) {
    const logEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      data,
      stackTrace: this.config.enableStackTrace ? new Error().stack : null
    }

    this.logs.push(logEntry)

    // Keep only the most recent logs
    if (this.logs.length > this.maxStoredLogs) {
      this.logs.shift()
    }
  }

  /**
   * Generic log method
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {any} data - Additional data
   * @param {string} icon - Icon to use
   */
  log(level, message, data = null, icon = null) {
    if (!this.shouldLog(level)) return

    const formattedMessage = this.formatMessage(level, message, data, icon)
    
    // Store the log
    this.storeLog(level, message, data)

    // Output to appropriate console method
    const consoleMethod = {
      debug: 'log',
      info: 'info',
      warn: 'warn',
      error: 'error'
    }[level.toLowerCase()] || 'log'

    console[consoleMethod](formattedMessage)
  }

  /**
   * Debug level logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  debug(message, data = null) {
    this.log('DEBUG', message, data, ICONS.debug)
  }

  /**
   * Info level logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   * @param {string} icon - Custom icon
   */
  info(message, data = null, icon = null) {
    this.log('INFO', message, data, icon || ICONS.info)
  }

  /**
   * Warning level logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  warn(message, data = null) {
    this.log('WARN', message, data, ICONS.warn)
  }

  /**
   * Error level logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  error(message, data = null) {
    this.log('ERROR', message, data, ICONS.error)
  }

  /**
   * Success logging (info level with success icon)
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  success(message, data = null) {
    this.log('INFO', message, data, ICONS.success)
  }

  /**
   * Security event logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  security(message, data = null) {
    this.log('INFO', message, data, ICONS.security)
  }

  /**
   * API request/response logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  api(message, data = null) {
    this.log('DEBUG', message, data, ICONS.api)
  }

  /**
   * AI service logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  ai(message, data = null) {
    this.log('INFO', message, data, ICONS.ai)
  }

  /**
   * Authentication logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  auth(message, data = null) {
    this.log('INFO', message, data, ICONS.auth)
  }

  /**
   * Validation logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   * @param {boolean} success - Whether validation succeeded
   */
  validation(message, data = null, success = true) {
    this.log(success ? 'DEBUG' : 'WARN', message, data, ICONS.validation)
  }

  /**
   * Performance logging
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  performance(message, data = null) {
    this.log('DEBUG', message, data, ICONS.performance)
  }

  /**
   * Create a child logger with a specific prefix
   * @param {string} prefix - Additional prefix for the child logger
   * @returns {Logger} - Child logger instance
   */
  child(prefix) {
    return new Logger({
      ...this.config,
      prefix: `${this.config.prefix}:${prefix}`
    })
  }

  /**
   * Get stored logs
   * @param {string} level - Filter by log level (optional)
   * @returns {Array} - Array of log entries
   */
  getLogs(level = null) {
    if (level) {
      return this.logs.filter(log => log.level === level.toUpperCase())
    }
    return [...this.logs]
  }

  /**
   * Clear stored logs
   */
  clearLogs() {
    this.logs = []
  }

  /**
   * Export logs to JSON
   * @returns {string} - JSON string of logs
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2)
  }

  /**
   * Create a performance timer
   * @param {string} label - Timer label
   * @returns {Function} - Function to stop the timer
   */
  timer(label) {
    const startTime = performance.now()
    this.debug(`Timer started: ${label}`)
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      this.performance(`Timer completed: ${label}`, { duration: `${duration.toFixed(2)}ms` })
      return duration
    }
  }

  /**
   * Group related logs
   * @param {string} label - Group label
   * @param {Function} fn - Function to execute within the group
   */
  group(label, fn) {
    if (this.shouldLog('DEBUG')) {
      console.group(this.colorize(`📁 ${label}`, 'cyan'))
      try {
        fn()
      } finally {
        console.groupEnd()
      }
    } else {
      fn()
    }
  }
}

// Create default logger instance
const logger = new Logger()

// Export the Logger class and default instance
export { Logger, logger, LOG_LEVELS }

// Export convenience methods for direct usage
export const debug = (message, data) => logger.debug(message, data)
export const info = (message, data, icon) => logger.info(message, data, icon)
export const warn = (message, data) => logger.warn(message, data)
export const error = (message, data) => logger.error(message, data)
export const success = (message, data) => logger.success(message, data)
export const security = (message, data) => logger.security(message, data)
export const api = (message, data) => logger.api(message, data)
export const ai = (message, data) => logger.ai(message, data)
export const auth = (message, data) => logger.auth(message, data)
export const validation = (message, data, success) => logger.validation(message, data, success)
export const performance = (message, data) => logger.performance(message, data)

export default logger
