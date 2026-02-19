import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PropTypes from 'prop-types'
import { formatTime, formatDate } from '../../utils/formatters'

/**
 * Conversation History Component
 * 
 * Displays and manages past AI conversations with search,
 * filter, and export capabilities.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.conversations - Array of conversation objects
 * @param {Function} props.onConversationSelect - Callback when conversation is selected
 * @param {Function} props.onConversationDelete - Callback when conversation is deleted
 * @param {Function} props.onExport - Callback to export conversation
 * @returns {JSX.Element} Conversation history component
 */
function ConversationHistory({ 
  conversations = [], 
  onConversationSelect,
  onConversationDelete,
  onExport 
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  // Group conversations by date
  const groupConversationsByDate = (convs) => {
    const groups = {}
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    convs.forEach(conv => {
      const convDate = new Date(conv.timestamp).toDateString()
      let groupKey

      if (convDate === today) {
        groupKey = 'Today'
      } else if (convDate === yesterday) {
        groupKey = 'Yesterday'
      } else {
        groupKey = formatDate(new Date(conv.timestamp))
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(conv)
    })

    return groups
  }

  // Filter and sort conversations
  const getFilteredConversations = () => {
    let filtered = [...conversations]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(conv =>
        conv.messages?.some(msg => 
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        ) || conv.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(conv => conv.category === filterCategory)
    }

    // Sort
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    } else if (sortBy === 'messages') {
      filtered.sort((a, b) => (b.messages?.length || 0) - (a.messages?.length || 0))
    }

    return filtered
  }

  const filteredConversations = getFilteredConversations()
  const groupedConversations = groupConversationsByDate(filteredConversations)

  const handleDelete = (convId, e) => {
    e.stopPropagation()
    if (window.confirm('Delete this conversation?')) {
      onConversationDelete?.(convId)
    }
  }

  const handleExport = (conv, e) => {
    e.stopPropagation()
    onExport?.(conv)
  }

  const getConversationPreview = (messages) => {
    if (!messages || messages.length === 0) return 'No messages'
    const lastUserMessage = [...messages].reverse().find(m => m.type === 'user')
    return lastUserMessage?.content.substring(0, 100) || 'No preview available'
  }

  const categories = ['all', 'cases', 'appointments', 'planning', 'documentation', 'general']

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Conversation History
        </h2>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="messages">Most Messages</option>
          </select>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>{filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}</span>
          <span>
            {conversations.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0)} total messages
          </span>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(groupedConversations).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filterCategory !== 'all' 
                ? 'No conversations found' 
                : 'No conversation history yet'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Start chatting with the AI Assistant to see your history here
            </p>
          </div>
        ) : (
          Object.entries(groupedConversations).map(([dateGroup, convs]) => (
            <div key={dateGroup}>
              {/* Date Header */}
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                {dateGroup}
              </div>

              {/* Conversations */}
              <div className="space-y-2">
                <AnimatePresence>
                  {convs.map((conv) => (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      onClick={() => onConversationSelect?.(conv)}
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600 cursor-pointer transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {/* Title or Preview */}
                          <h3 className="font-medium text-sm text-gray-900 dark:text-white mb-1 truncate">
                            {conv.title || getConversationPreview(conv.messages)}
                          </h3>

                          {/* Metadata */}
                          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatTime(new Date(conv.timestamp))}</span>
                            <span>•</span>
                            <span>{conv.messages?.length || 0} messages</span>
                            {conv.category && (
                              <>
                                <span>•</span>
                                <span className="px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                                  {conv.category}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button
                            onClick={(e) => handleExport(conv, e)}
                            className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded"
                            title="Export"
                          >
                            📥
                          </button>
                          <button
                            onClick={(e) => handleDelete(conv.id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

ConversationHistory.propTypes = {
  conversations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      messages: PropTypes.array,
      timestamp: PropTypes.string.isRequired,
      category: PropTypes.string,
    })
  ),
  onConversationSelect: PropTypes.func,
  onConversationDelete: PropTypes.func,
  onExport: PropTypes.func,
}

export default ConversationHistory