import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

function Alert({ 
  type = 'info', 
  message, 
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
  className = ''
}) {
  const alertRef = useRef(null)

  const types = {
    success: {
      classes: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      icon: '✓',
      ariaLabel: 'Success'
    },
    error: {
      classes: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      icon: '⚠️',
      ariaLabel: 'Error'
    },
    warning: {
      classes: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
      icon: '⚠️',
      ariaLabel: 'Warning'
    },
    info: {
      classes: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      icon: 'ℹ️',
      ariaLabel: 'Information'
    },
  }

  const alertType = types[type] || types.info

  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoCloseDelay)
      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseDelay, onClose])

  useEffect(() => {
    // Focus the alert for screen readers when it appears
    if (alertRef.current && (type === 'error' || type === 'warning')) {
      alertRef.current.focus()
    }
  }, [type])

  return (
    <div 
      ref={alertRef}
      className={`p-4 rounded-lg border flex items-start gap-3 ${alertType.classes} ${className}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-label={alertType.ariaLabel}
      tabIndex={type === 'error' || type === 'warning' ? 0 : -1}
    >
      <span 
        className="flex-shrink-0 text-lg"
        role="img" 
        aria-label={alertType.ariaLabel}
      >
        {alertType.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium break-words">
          {message}
        </p>
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-current transition-colors"
          aria-label="Close alert"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      )}
    </div>
  )
}

Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  autoClose: PropTypes.bool,
  autoCloseDelay: PropTypes.number,
  className: PropTypes.string,
}

export default Alert
