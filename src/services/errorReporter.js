/**
 * errorReporter — a framework-agnostic singleton that pure JS services
 * can use to push errors into ErrorContext without needing React hooks.
 *
 * Usage in a service:
 *   import { reportError } from './errorReporter'
 *   reportError(error, { context: 'AI Service', type: 'error' })
 *
 * ErrorContext registers its addError function on mount via registerReporter().
 */

let _addError = null

/**
 * Called once by ErrorContext on mount to register the addError function.
 * @param {Function} addError
 */
export function registerReporter(addError) {
  _addError = addError
}

/**
 * Report an error to the global ErrorContext.
 * Falls back to console.error if the reporter is not yet registered
 * (e.g. during SSR or before the provider mounts).
 *
 * @param {Error|string} error
 * @param {Object} [options]
 * @param {string} [options.context]   - Human-readable source label
 * @param {'error'|'warning'|'info'|'success'} [options.type='error']
 * @param {number}  [options.duration] - Auto-dismiss ms (default 5000)
 * @param {boolean} [options.rethrow]  - Re-throw after reporting
 */
export function reportError(error, options = {}) {
  if (_addError) {
    _addError(error, { type: 'error', ...options })
  } else {
    console.error(`[${options.context || 'Service'}]`, error)
  }

  if (options.rethrow) throw error
}

/**
 * Convenience wrapper — reports and re-throws so callers can still catch.
 */
export function reportAndRethrow(error, options = {}) {
  reportError(error, { ...options, rethrow: true })
}
