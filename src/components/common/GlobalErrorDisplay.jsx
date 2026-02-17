import { motion, AnimatePresence } from 'framer-motion'
import { useError } from '../../context/ErrorContext'
import Alert from './Alert'

/**
 * Global Error Display Component
 * Displays all global errors in a fixed position
 */
function GlobalErrorDisplay() {
  const { errors, removeError } = useError()

  return (
    <div 
      className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full pointer-events-none"
      aria-live="assertive"
      aria-atomic="true"
    >
      <AnimatePresence>
        {errors.map((error) => (
          <motion.div
            key={error.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="pointer-events-auto"
          >
            <Alert
              type={error.type}
              message={
                <div>
                  <div className="font-medium">{error.message}</div>
                  {error.context && (
                    <div className="text-xs mt-1 opacity-75">
                      Context: {error.context}
                    </div>
                  )}
                </div>
              }
              onClose={error.dismissible ? () => removeError(error.id) : null}
              autoClose={false} // We handle auto-close in ErrorContext
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default GlobalErrorDisplay
