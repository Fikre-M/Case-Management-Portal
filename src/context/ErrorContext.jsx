import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { registerReporter } from '../services/errorReporter'
import { TOAST_DURATION } from '../config/constants'

const ErrorContext = createContext()

/**
 * Error Context Provider
 * Manages global error state and provides error handling utilities
 */
export function ErrorProvider({ children }) {
  const [errors, setErrors] = useState([])

  /**
   * Add a new error to the global error state
   * @param {Error|string} error - Error object or message
   * @param {Object} options - Additional error options
   */
  const addError = useCallback((error, options = {}) => {
    const isValidationError = error.name === 'ValidationError'
    
    const errorObj = {
      id: Date.now() + Math.random(),
      message: typeof error === 'string' ? error : error.message,
      type: isValidationError ? 'validation' : (options.type || 'error'),
      timestamp: new Date().toISOString(),
      context: options.context || null,
      dismissible: options.dismissible !== false,
      autoClose: isValidationError ? false : (options.autoClose !== false), // Validation errors don't auto-close
      duration: options.duration || (isValidationError ? TOAST_DURATION.LONG : TOAST_DURATION.DEFAULT),
      originalError: error, // Store original error for debugging
    }

    setErrors(prev => [...prev, errorObj])

    // Auto-remove error after duration (only if autoClose is true)
    if (errorObj.autoClose) {
      setTimeout(() => {
        setErrors(prev => prev.filter(err => err.id !== errorObj.id))
      }, errorObj.duration)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`${isValidationError ? 'Validation' : 'Global'} Error:`, error, options)
    }

    return errorObj.id
  }, [])

  /**
   * Remove an error from the global error state
   * @param {number} errorId - ID of the error to remove
   */
  const removeError = useCallback((errorId) => {
    setErrors(prev => prev.filter(err => err.id !== errorId))
  }, [])

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  /**
   * Handle async operations with automatic error handling
   * @param {Function} asyncFn - Async function to execute
   * @param {Object} options - Error handling options
   */
  const handleAsync = useCallback(async (asyncFn, options = {}) => {
    try {
      return await asyncFn()
    } catch (error) {
      addError(error, {
        context: options.context || 'Async Operation',
        ...options
      })
      if (options.rethrow) {
        throw error
      }
      return null
    }
  }, [addError])

  /**
   * Handle validation errors specifically
   * @param {Error} error - Validation error
   * @param {Object} options - Error handling options
   */
  const handleValidationError = useCallback((error, options = {}) => {
    if (error.name !== 'ValidationError') {
      // If it's not a validation error, handle it as a regular error
      return addError(error, options)
    }

    return addError(error, {
      type: 'validation',
      autoClose: false,
      duration: TOAST_DURATION.LONG,
      ...options
    })
  }, [addError])

  // Register the reporter so pure-JS services can push errors here
  useEffect(() => {
    registerReporter(addError)
  }, [addError])

  const value = {
    errors,
    addError,
    removeError,
    clearErrors,
    handleAsync,
    handleValidationError,
  }

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  )
}

ErrorProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

/**
 * Hook to access error context
 * @returns {Object} Error context value
 */
export function useError() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}

export default ErrorContext
