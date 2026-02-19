import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * AI Assistant Toggle Button
 * 
 * A floating action button that toggles the AI Assistant sidebar.
 * Positioned fixed on the screen for easy access from any page.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the AI Assistant is currently open
 * @param {Function} props.onToggle - Function to toggle the AI Assistant
 * @param {boolean} [props.hasNotification] - Whether to show a notification indicator
 * @returns {JSX.Element} AI Assistant toggle button
 */
function AIAssistantToggle({ isOpen, onToggle, hasNotification = false }) {
  return (
    <motion.button
      onClick={onToggle}
      className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
        isOpen
          ? 'bg-gray-600 hover:bg-gray-700 text-white'
          : 'bg-primary-600 hover:bg-primary-700 text-white'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20 
      }}
      title={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
    >
      {/* Notification Badge */}
      {hasNotification && !isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </motion.div>
      )}

      {/* Icon */}
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-2xl"
      >
        {isOpen ? '✕' : '🤖'}
      </motion.div>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <motion.div
          className="absolute inset-0 rounded-full bg-primary-600"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.button>
  )
}

AIAssistantToggle.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  hasNotification: PropTypes.bool,
}

export default AIAssistantToggle