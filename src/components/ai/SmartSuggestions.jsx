import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import { useApp } from '../../context/AppContext'

/**
 * Smart Suggestions Component
 * 
 * Provides context-aware AI suggestions based on current page,
 * user activity, and system state. Displays actionable recommendations
 * that users can click to get AI assistance.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.context] - Current context ('dashboard', 'case', 'appointment', etc.)
 * @param {Object} [props.contextData] - Additional context data
 * @param {Function} [props.onSuggestionClick] - Callback when suggestion is clicked
 * @returns {JSX.Element} Smart suggestions component
 */
function SmartSuggestions({ context = 'dashboard', contextData = null, onSuggestionClick }) {
  const [suggestions, setSuggestions] = useState([])
  const [isVisible, setIsVisible] = useState(true)
  const [dismissed, setDismissed] = useState([])
  
  const {
    getActiveCases,
    getTodayAppointments,
    getUpcomingAppointments,
    getCasesByPriority,
  } = useApp()

  // Generate smart suggestions based on context
  useEffect(() => {
    const newSuggestions = generateSuggestions()
    setSuggestions(newSuggestions)
  }, [context, contextData])

  const generateSuggestions = () => {
    const activeCases = getActiveCases()
    const todayAppointments = getTodayAppointments()
    const upcomingAppointments = getUpcomingAppointments(5)
    const highPriorityCases = getCasesByPriority('high')

    const allSuggestions = []

    // Dashboard context suggestions
    if (context === 'dashboard') {
      if (todayAppointments.length > 0) {
        allSuggestions.push({
          id: 'today-prep',
          icon: '📅',
          title: 'Prepare for Today',
          description: `You have ${todayAppointments.length} appointment${todayAppointments.length > 1 ? 's' : ''} today`,
          prompt: 'Help me prepare for today\'s appointments. What should I review and what materials do I need?',
          priority: 'high',
          category: 'appointments',
        })
      }

      if (highPriorityCases.length > 0) {
        allSuggestions.push({
          id: 'high-priority',
          icon: '🔴',
          title: 'High Priority Cases',
          description: `${highPriorityCases.length} case${highPriorityCases.length > 1 ? 's' : ''} need attention`,
          prompt: 'Review my high priority cases and suggest which ones need immediate action and why.',
          priority: 'high',
          category: 'cases',
        })
      }

      if (upcomingAppointments.length > 0) {
        allSuggestions.push({
          id: 'upcoming-week',
          icon: '📆',
          title: 'Plan Your Week',
          description: `${upcomingAppointments.length} upcoming appointments`,
          prompt: 'Help me plan for my upcoming appointments this week. What preparation is needed?',
          priority: 'medium',
          category: 'planning',
        })
      }

      if (activeCases.length > 5) {
        allSuggestions.push({
          id: 'workload',
          icon: '⚖️',
          title: 'Manage Workload',
          description: `${activeCases.length} active cases`,
          prompt: 'Help me prioritize my active cases and suggest a workflow strategy for managing my current workload.',
          priority: 'medium',
          category: 'productivity',
        })
      }
    }

    // Case context suggestions
    if (context === 'case' && contextData) {
      allSuggestions.push({
        id: 'case-analysis',
        icon: '🔍',
        title: 'Analyze This Case',
        description: 'Get AI insights and recommendations',
        prompt: `Analyze this case: "${contextData.title}". What are the key considerations and next steps?`,
        priority: 'high',
        category: 'analysis',
      })

      if (contextData.status === 'active') {
        allSuggestions.push({
          id: 'case-progress',
          icon: '📊',
          title: 'Track Progress',
          description: 'Review case milestones and timeline',
          prompt: `Help me track progress on this case and identify any potential delays or issues.`,
          priority: 'medium',
          category: 'tracking',
        })
      }

      allSuggestions.push({
        id: 'documentation',
        icon: '📝',
        title: 'Documentation Help',
        description: 'Improve case notes and records',
        prompt: 'What documentation should I maintain for this case? Suggest best practices for note-taking.',
        priority: 'low',
        category: 'documentation',
      })
    }

    // Appointment context suggestions
    if (context === 'appointment' && contextData) {
      allSuggestions.push({
        id: 'appointment-prep',
        icon: '✅',
        title: 'Preparation Checklist',
        description: 'Get ready for this appointment',
        prompt: `Help me prepare for this appointment: "${contextData.title}" on ${contextData.date}. What should I review?`,
        priority: 'high',
        category: 'preparation',
      })

      allSuggestions.push({
        id: 'follow-up',
        icon: '📧',
        title: 'Follow-up Actions',
        description: 'Plan post-appointment tasks',
        prompt: 'What follow-up actions should I plan after this appointment?',
        priority: 'medium',
        category: 'follow-up',
      })
    }

    // General suggestions always available
    allSuggestions.push({
      id: 'best-practices',
      icon: '💡',
      title: 'Best Practices',
      description: 'Learn case management tips',
      prompt: 'Share best practices for effective case management in healthcare/social services.',
      priority: 'low',
      category: 'learning',
    })

    // Filter out dismissed suggestions
    return allSuggestions
      .filter(s => !dismissed.includes(s.id))
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
      .slice(0, 4) // Show max 4 suggestions
  }

  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion.prompt, suggestion)
    }
  }

  const handleDismiss = (suggestionId, e) => {
    e.stopPropagation()
    setDismissed(prev => [...prev, suggestionId])
  }

  const handleDismissAll = () => {
    setIsVisible(false)
  }

  if (!isVisible || suggestions.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6"
    >
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🤖</span>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              AI Suggestions
            </h3>
          </div>
          <button
            onClick={handleDismissAll}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Dismiss All
          </button>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence>
            {suggestions.map((suggestion) => (
              <motion.button
                key={suggestion.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="relative bg-white dark:bg-gray-800 rounded-lg p-3 text-left hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 group"
              >
                {/* Priority Indicator */}
                <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                  suggestion.priority === 'high' 
                    ? 'bg-red-500' 
                    : suggestion.priority === 'medium' 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                }`} />

                {/* Content */}
                <div className="flex items-start space-x-3">
                  <div className="text-2xl flex-shrink-0">
                    {suggestion.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      {suggestion.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {suggestion.description}
                    </p>
                    
                    {/* Category Badge */}
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                      {suggestion.category}
                    </span>
                  </div>
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={(e) => handleDismiss(suggestion.id, e)}
                  className="absolute top-2 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Dismiss"
                >
                  ✕
                </button>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-primary-200 dark:border-primary-800">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Click any suggestion to get AI assistance, or open the AI Assistant for custom questions
          </p>
        </div>
      </div>
    </motion.div>
  )
}

SmartSuggestions.propTypes = {
  context: PropTypes.oneOf(['dashboard', 'case', 'appointment', 'general']),
  contextData: PropTypes.object,
  onSuggestionClick: PropTypes.func,
}

export default SmartSuggestions