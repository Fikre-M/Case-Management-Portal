import { useState, useCallback } from 'react'
import useToast from './useToast'

function useErrorHandler() {
  const [error, setError] = useState(null)
  const { error: showErrorToast } = useToast()

  const handleError = useCallback((error, showToast = true) => {
    console.error('Error occurred:', error)
    setError(error)
    
    if (showToast) {
      const message = error?.message || 'An unexpected error occurred'
      showErrorToast(message)
    }
  }, [showErrorToast])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const withErrorHandling = useCallback((asyncFn) => {
    return async (...args) => {
      try {
        clearError()
        return await asyncFn(...args)
      } catch (error) {
        handleError(error)
        throw error
      }
    }
  }, [handleError, clearError])

  return {
    error,
    handleError,
    clearError,
    withErrorHandling
  }
}

export default useErrorHandler