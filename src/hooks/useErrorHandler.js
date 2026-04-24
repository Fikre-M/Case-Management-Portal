import { useCallback } from 'react'
import { useError } from '../context/ErrorContext'
import { TOAST_DURATION } from '../config/constants'

export function useErrorHandler(context = 'Operation') {
  const { addError, handleAsync } = useError()

  const withErrorHandling = useCallback((fn, options = {}) => {
    return async (...args) => {
      try {
        return await fn(...args)
      } catch (error) {
        addError(error, { context: options.context || context, type: options.type || 'error', ...options })
        if (options.rethrow) throw error
        return null
      }
    }
  }, [addError, context])

  const handleAsyncWithLoading = useCallback(async (asyncFn, options = {}) => {
    const { onStart, onSuccess, onError: onErrorCallback, onFinally } = options
    try {
      if (onStart) onStart()
      const result = await asyncFn()
      if (onSuccess) onSuccess(result)
      return result
    } catch (error) {
      addError(error, { context: options.context || context, type: 'error', ...options })
      if (onErrorCallback) onErrorCallback(error)
      if (options.rethrow) throw error
      return null
    } finally {
      if (onFinally) onFinally()
    }
  }, [addError, context])

  const showSuccess = useCallback((message, options = {}) => {
    addError(message, { type: 'success', context: options.context || context, duration: options.duration || TOAST_DURATION.SHORT, ...options })
  }, [addError, context])

  const showWarning = useCallback((message, options = {}) => {
    addError(message, { type: 'warning', context: options.context || context, duration: options.duration || TOAST_DURATION.LONG, ...options })
  }, [addError, context])

  const showInfo = useCallback((message, options = {}) => {
    addError(message, { type: 'info', context: options.context || context, duration: options.duration || TOAST_DURATION.SHORT, ...options })
  }, [addError, context])

  return { withErrorHandling, handleAsync, handleAsyncWithLoading, showSuccess, showWarning, showInfo, addError }
}

export default useErrorHandler
