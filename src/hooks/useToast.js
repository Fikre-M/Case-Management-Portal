import { useState, useCallback } from 'react'

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = ++toastId
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    }

    setToasts(prev => [...prev, newToast])

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((message, options = {}) => {
    return addToast({ ...options, message, type: 'success' })
  }, [addToast])

  const error = useCallback((message, options = {}) => {
    return addToast({ ...options, message, type: 'error' })
  }, [addToast])

  const warning = useCallback((message, options = {}) => {
    return addToast({ ...options, message, type: 'warning' })
  }, [addToast])

  const info = useCallback((message, options = {}) => {
    return addToast({ ...options, message, type: 'info' })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}