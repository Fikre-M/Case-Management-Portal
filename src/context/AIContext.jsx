import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { getServiceStatus } from '../services/aiService'

const AIContext = createContext()

/**
 * AI Context Provider
 * 
 * Manages global AI-related state including conversations,
 * suggestions, and assistant visibility.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} AI context provider
 */
export function AIProvider({ children }) {
  // AI Assistant State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const [currentContext, setCurrentContext] = useState(null)
  
  // Conversations State
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('aiConversations')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.warn('Failed to load AI conversations:', error)
      return []
    }
  })

  // Current conversation
  const [currentConversation, setCurrentConversation] = useState(null)

  // Service status
  const [serviceStatus] = useState(getServiceStatus())

  // Settings
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('aiSettings')
      return saved ? JSON.parse(saved) : {
        autoSuggestions: true,
        saveHistory: true,
        notificationsEnabled: true,
        maxHistoryItems: 50,
      }
    } catch (error) {
      console.warn('Failed to load AI settings:', error)
      return {
        autoSuggestions: true,
        saveHistory: true,
        notificationsEnabled: true,
        maxHistoryItems: 50,
      }
    }
  })

  // Save conversations to localStorage
  useEffect(() => {
    if (settings.saveHistory) {
      try {
        localStorage.setItem('aiConversations', JSON.stringify(conversations))
      } catch (error) {
        console.warn('Failed to save AI conversations:', error)
      }
    }
  }, [conversations, settings.saveHistory])

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aiSettings', JSON.stringify(settings))
    } catch (error) {
      console.warn('Failed to save AI settings:', error)
    }
  }, [settings])

  // Open assistant
  const openAssistant = useCallback((context = null) => {
    setCurrentContext(context)
    setIsAssistantOpen(true)
  }, [])

  // Close assistant
  const closeAssistant = useCallback(() => {
    setIsAssistantOpen(false)
  }, [])

  // Toggle assistant
  const toggleAssistant = useCallback(() => {
    setIsAssistantOpen(prev => !prev)
  }, [])

  // Update context
  const updateContext = useCallback((context) => {
    setCurrentContext(context)
  }, [])

  // Create new conversation
  const createConversation = useCallback((title, category = 'general') => {
    const newConversation = {
      id: Date.now(),
      title,
      category,
      messages: [],
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }

    setConversations(prev => [newConversation, ...prev])
    setCurrentConversation(newConversation)
    return newConversation
  }, [])

  // Add message to conversation
  const addMessageToConversation = useCallback((conversationId, message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...(conv.messages || []), message],
          lastUpdated: new Date().toISOString(),
        }
      }
      return conv
    }))
  }, [])

  // Delete conversation
  const deleteConversation = useCallback((conversationId) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId))
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null)
    }
  }, [currentConversation])

  // Clear all conversations
  const clearAllConversations = useCallback(() => {
    if (window.confirm('Delete all conversation history? This cannot be undone.')) {
      setConversations([])
      setCurrentConversation(null)
      localStorage.removeItem('aiConversations')
    }
  }, [])

  // Export conversation
  const exportConversation = useCallback((conversation) => {
    const exportData = {
      title: conversation.title || 'AI Conversation',
      date: new Date(conversation.timestamp).toLocaleString(),
      category: conversation.category,
      messages: conversation.messages?.map(msg => ({
        role: msg.type === 'user' ? 'User' : 'AI Assistant',
        content: msg.content,
        timestamp: new Date(msg.timestamp).toLocaleString(),
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-conversation-${conversation.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  // Export all conversations
  const exportAllConversations = useCallback(() => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalConversations: conversations.length,
      conversations: conversations.map(conv => ({
        id: conv.id,
        title: conv.title,
        category: conv.category,
        timestamp: conv.timestamp,
        messageCount: conv.messages?.length || 0,
        messages: conv.messages,
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-conversations-export-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [conversations])

  // Update settings
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  // Get conversation statistics
  const getStatistics = useCallback(() => {
    const totalMessages = conversations.reduce((sum, conv) => 
      sum + (conv.messages?.length || 0), 0
    )
    
    const categoryCounts = conversations.reduce((acc, conv) => {
      acc[conv.category || 'general'] = (acc[conv.category || 'general'] || 0) + 1
      return acc
    }, {})

    const avgMessagesPerConversation = conversations.length > 0 
      ? (totalMessages / conversations.length).toFixed(1)
      : 0

    return {
      totalConversations: conversations.length,
      totalMessages,
      avgMessagesPerConversation,
      categoryCounts,
      oldestConversation: conversations.length > 0 
        ? new Date(Math.min(...conversations.map(c => new Date(c.timestamp))))
        : null,
      newestConversation: conversations.length > 0
        ? new Date(Math.max(...conversations.map(c => new Date(c.timestamp))))
        : null,
    }
  }, [conversations])

  const value = {
    // Assistant state
    isAssistantOpen,
    currentContext,
    openAssistant,
    closeAssistant,
    toggleAssistant,
    updateContext,

    // Conversations
    conversations,
    currentConversation,
    setCurrentConversation,
    createConversation,
    addMessageToConversation,
    deleteConversation,
    clearAllConversations,
    exportConversation,
    exportAllConversations,

    // Settings
    settings,
    updateSettings,

    // Service
    serviceStatus,

    // Statistics
    getStatistics,
  }

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>
}

AIProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

/**
 * Custom hook to access AI Context
 * 
 * @returns {Object} AI context object
 * @throws {Error} When used outside of AIProvider
 */
export function useAI() {
  const context = useContext(AIContext)
  if (!context) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}

export default AIContext