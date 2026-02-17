import { useCallback } from 'react'
import { useError } from '../context/ErrorContext'

/**
 * Custom hook for simplified error handling in components
 * @param {string} context - Context description for errors
 * @returns {Object} Error handling utilities
 */
export function useErrorHandler(context = 'Operation') {
  const { addError, handleAsync } = useError()

  /**
   * Wrap a function with error handling
   * @param {Function} fn - Function to wrap
   * @param {Object} options - Error handling options
   */
  const withErrorHandling = useCallback((fn, options = {}) => {
    return async (...args) => {
      try {
        return await fn(...args)
      } catch (error) {
        addError(error, {
          context: options.context || context,
          type: options.type || 'error',
          ...options
        })
        if (options.rethrow) {
          throw error
        }
        return null
      }
    }
  }, [addError, context])

  /**
   * Handle async operation with loading state
   * @param {Function} asyncFn - Async function to execute
   * @param {Object} options - Options
   */
  const handleAsyncWithLoading = useCallback(async (asyncFn, options = {}) => {
    const { onStart, onSuccess, onError: onErrorCallback, onFinally } = options

    try {
      if (onStart) onStart()
      const result = await asyncFn()
      if (onSuccess) onSuccess(result)
      return result
    } catch (error) {
      addError(error, {
        context: options.context || context,
        type: 'error',
        ...options
      })
      if (onErrorCallback) onErrorCallback(error)
      if (options.rethrow) throw error
      return null
    } finally {
      if (onFinally) onFinally()
    }
  }, [addError, context])

  /**
   * Show success message
   * @param {string} message - Success message
   * @param {Object} options - Display options
   */
  const showSuccess = useCallback((message, options = {}) => {
    addError(message, {
      type: 'success',
      context: options.context || context,
      duration: options.duration || 3000,
      ...options
    })
  }, [addError, context])

  /**
   * Show warning message
   * @param {string} message - Warning message
   * @param {Object} options - Display options
   */
  const showWarning = useCallback((message, options = {}) => {
    addError(message, {
      type: 'warning',
      context: options.context || context,
      duration: options.duration || 4000,
      ...options
    })
  }, [addError, context])

  /**
   * Show info message
   * @param {string} message - Info message
   * @param {Object} options - Display options
   */
  const showInfo = useCallback((message, options = {}) => {
    addError(message, {
      type: 'info',
      context: options.context || context,
      duration: options.duration || 3000,
      ...options
    })
  }, [addError, context])

  return {
    withErrorHandling,
    handleAsync,
    handleAsyncWithLoading,
    showSuccess,
    showWarning,
    showInfo,
    addError,
  }
}

export default useErrorHandler
