import { useState, useCallback } from 'react'

/**
 * Custom hook for managing AI Assistant state and context
 * 
 * Provides a convenient way to manage AI Assistant state and pass context
 * from any component or page.
 * 
 * @param {Object} [initialContext] - Initial context to pass to AI Assistant
 * @returns {Object} AI Assistant state and controls
 */
export function useAIAssistant(initialContext = null) {
  const [isOpen, setIsOpen] = useState(false)
  const [context, setContext] = useState(initialContext)

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const open = useCallback((newContext = null) => {
    if (newContext) {
      setContext(newContext)
    }
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const updateContext = useCallback((newContext) => {
    setContext(newContext)
  }, [])

  const openWithCase = useCallback((caseData) => {
    setContext({ caseContext: caseData })
    setIsOpen(true)
  }, [])

  const openWithAppointment = useCallback((appointmentData) => {
    setContext({ appointmentContext: appointmentData })
    setIsOpen(true)
  }, [])

  const openWithBoth = useCallback((caseData, appointmentData) => {
    setContext({ 
      caseContext: caseData, 
      appointmentContext: appointmentData 
    })
    setIsOpen(true)
  }, [])

  return {
    isOpen,
    context,
    toggle,
    open,
    close,
    updateContext,
    openWithCase,
    openWithAppointment,
    openWithBoth,
  }
}

export default useAIAssistant