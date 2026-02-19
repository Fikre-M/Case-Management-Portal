import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

/**
 * AI Loading Skeleton Component
 * 
 * Displays an animated loading skeleton while waiting for AI responses.
 * Uses the existing skeleton pattern with shimmer effect.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.variant] - Skeleton variant ('message', 'suggestion', 'compact')
 * @returns {JSX.Element} AI loading skeleton
 */
function AILoadingSkeleton({ variant = 'message' }) {
  if (variant === 'message') {
    return (
      <div className="flex items-start space-x-3">
        {/* Avatar Skeleton */}
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
        
        {/* Message Skeleton */}
        <div className="flex-1 space-y-2 max-w-[80%]">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 space-y-2">
            {/* Shimmer effect */}
            <div className="relative overflow-hidden">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </div>
            
            <div className="relative overflow-hidden">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-5/6" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 0.1
                }}
              />
            </div>
            
            <div className="relative overflow-hidden">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-4/6" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: 0.2
                }}
              />
            </div>
          </div>
          
          {/* Typing indicator */}
          <div className="flex items-center space-x-1 px-2">
            <motion.div
              className="w-2 h-2 bg-primary-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 bg-primary-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 bg-primary-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              AI is thinking...
            </span>
          </div>
        </div>
      </div>
    )
  }
  
  if (variant === 'suggestion') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
          </div>
        </div>
      </div>
    )
  }
  
  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2">
        <motion.div
          className="w-1.5 h-1.5 bg-primary-500 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-1.5 h-1.5 bg-primary-500 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
        />
        <motion.div
          className="w-1.5 h-1.5 bg-primary-500 rounded-full"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
        />
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Processing...
        </span>
      </div>
    )
  }
  
  return null
}

AILoadingSkeleton.propTypes = {
  variant: PropTypes.oneOf(['message', 'suggestion', 'compact']),
}

export default AILoadingSkeleton