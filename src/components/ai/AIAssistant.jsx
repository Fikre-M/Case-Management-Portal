import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import ChatMessage from './ChatMessage'
import InputBar from './InputBar'
import { sendMessage, getServiceStatus } from '../../services/aiService'
import { useApp } from '../../context/AppContext'

/**
 * AI Assistant Sidebar Component
 * 
 * A collapsible sidebar that provides AI assistance for case management.
 * Features chat interface with context-aware responses based on current case/appointment data.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the sidebar is open
 * @param {Function} props.onToggle - Function to toggle sidebar visibility
 * @param {Object} [props.caseContext] - Current case context for AI responses
 * @param {Object} [props.appointmentContext] - Current appointment context for AI responses
 * @returns {JSX.Element} AI Assistant sidebar component
 */
function AIAssistant({ 
  isOpen = false, 
  onToggle, 
  caseContext = null, 
  appointmentContext = null 
}) {
  // Chat state - use persistent history from context or initialize with welcome message
  const [messages, setMessages] = useState(() => {
    if (aiChatHistory && aiChatHistory.length > 0) {
      return aiChatHistory
    }
    return [
      {
        id: 1,
        type: 'assistant',
        content: 'Hello! I\'m your AI case management assistant. I can help you with appointments, case notes, best practices, and next steps. How can I assist you today?',
        timestamp: new Date().toISOString(),
      }
    ]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [serviceStatus] = useState(getServiceStatus())
  
  // App context for case/appointment data and chat persistence
  const { 
    cases, 
    appointments, 
    getActiveCases, 
    getTodayAppointments,
    getUpcomingAppointments,
    aiChatHistory,
    addAiMessage,
    clearAiChatHistory,
  } = useApp()
  
  // Refs
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  // Sync messages with context when they change
  useEffect(() => {
    if (messages.length > 0) {
      // Only sync if messages have changed from the stored history
      const currentIds = messages.map(m => m.id).sort()
      const storedIds = aiChatHistory.map(m => m.id).sort()
      
      if (JSON.stringify(currentIds) !== JSON.stringify(storedIds)) {
        // Update the context with current messages
        messages.forEach(message => {
          if (!aiChatHistory.find(m => m.id === message.id)) {
            addAiMessage(message)
          }
        })
      }
    }
  }, [messages, aiChatHistory, addAiMessage])

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Build context for AI based on current data
  const buildAIContext = () => {
    const context = {
      totalCases: cases.length,
      activeCases: getActiveCases().length,
      todayAppointments: getTodayAppointments().length,
      upcomingAppointments: getUpcomingAppointments(3).length,
    }

    // Add specific case context if provided
    if (caseContext) {
      context.currentCase = {
        id: caseContext.id,
        title: caseContext.title,
        status: caseContext.status,
        priority: caseContext.priority,
        clientName: caseContext.clientName,
        lastUpdated: caseContext.lastUpdated,
      }
    }

    // Add specific appointment context if provided
    if (appointmentContext) {
      context.currentAppointment = {
        id: appointmentContext.id,
        title: appointmentContext.title,
        clientName: appointmentContext.clientName,
        date: appointmentContext.date,
        time: appointmentContext.time,
        status: appointmentContext.status,
      }
    }

    return context
  }

  // Enhanced system prompt with context
  const buildSystemPrompt = (context) => {
    let prompt = `You are an expert case management assistant for healthcare/social services. Be professional, concise, and empathetic. Help with appointments, notes, best practices, and next steps.

Current system overview:
- Total cases: ${context.totalCases}
- Active cases: ${context.activeCases}
- Today's appointments: ${context.todayAppointments}
- Upcoming appointments: ${context.upcomingAppointments}`

    if (context.currentCase) {
      prompt += `

Current case context:
- Case ID: ${context.currentCase.id}
- Title: ${context.currentCase.title}
- Client: ${context.currentCase.clientName}
- Status: ${context.currentCase.status}
- Priority: ${context.currentCase.priority}
- Last updated: ${context.currentCase.lastUpdated}`
    }

    if (context.currentAppointment) {
      prompt += `

Current appointment context:
- Appointment ID: ${context.currentAppointment.id}
- Title: ${context.currentAppointment.title}
- Client: ${context.currentAppointment.clientName}
- Date: ${context.currentAppointment.date}
- Time: ${context.currentAppointment.time}
- Status: ${context.currentAppointment.status}`
    }

    prompt += `

Please provide helpful, actionable advice based on this context. Focus on practical next steps, best practices, and professional recommendations.`

    return prompt
  }

  // Handle sending messages
  const handleSendMessage = async (content) => {
    if (!content.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Build context and enhanced prompt
      const context = buildAIContext()
      const systemPrompt = buildSystemPrompt(context)
      
      // Send message with custom system prompt if OpenAI is available
      const response = await sendMessage(content, systemPrompt)
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI Assistant error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again. If the problem persists, check your connection or contact support.',
        timestamp: new Date().toISOString(),
        isError: true,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Quick action buttons
  const quickActions = [
    {
      label: 'Case Summary',
      icon: '📋',
      prompt: caseContext 
        ? `Please provide a summary and next steps for the current case: ${caseContext.title}`
        : 'Help me summarize my active cases and suggest priorities',
    },
    {
      label: 'Today\'s Schedule',
      icon: '📅',
      prompt: 'What do I need to know about today\'s appointments and any preparation needed?',
    },
    {
      label: 'Best Practices',
      icon: '💡',
      prompt: 'What are some best practices I should follow for effective case management?',
    },
    {
      label: 'Documentation',
      icon: '📝',
      prompt: 'Help me with proper documentation and note-taking for my cases',
    },
  ]

  // Handle quick actions
  const handleQuickAction = (prompt) => {
    handleSendMessage(prompt)
  }

  // Clear chat
  const handleClearChat = () => {
    if (window.confirm('Clear chat history?')) {
      const welcomeMessage = {
        id: 1,
        type: 'assistant',
        content: 'Chat cleared. How can I help you with your case management today?',
        timestamp: new Date().toISOString(),
      }
      setMessages([welcomeMessage])
      clearAiChatHistory()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 30,
          duration: 0.3 
        }}
        className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${serviceStatus.available ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {serviceStatus.provider}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearChat}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Clear chat"
            >
              🗑️
            </button>
            <button
              onClick={onToggle}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Close assistant"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Context Info */}
        {(caseContext || appointmentContext) && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
            <div className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">
              Current Context:
            </div>
            {caseContext && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                📋 Case: {caseContext.title} ({caseContext.status})
              </div>
            )}
            {appointmentContext && (
              <div className="text-xs text-blue-600 dark:text-blue-400">
                📅 Appointment: {appointmentContext.title} - {appointmentContext.date}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">Quick Actions:</div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.prompt)}
                disabled={isLoading}
                className="p-2 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center space-y-1"
              >
                <span className="text-sm">{action.icon}</span>
                <span className="text-gray-700 dark:text-gray-300">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🤖</span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <InputBar onSend={handleSendMessage} disabled={isLoading} />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            AI responses are for assistance only. Always verify important information.
          </p>
        </div>
      </motion.div>
    </>
  )
}

AIAssistant.propTypes = {
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  caseContext: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
    clientName: PropTypes.string,
    lastUpdated: PropTypes.string,
  }),
  appointmentContext: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    clientName: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    status: PropTypes.string,
  }),
}

export default AIAssistant