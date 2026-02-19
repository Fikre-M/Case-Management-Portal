import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../../components/common/Card'
import SmartSuggestions from '../../components/ai/SmartSuggestions'
import ConversationHistory from '../../components/ai/ConversationHistory'
import AISettings from '../../components/ai/AISettings'
import AIAssistant from '../../components/ai/AIAssistant'
import { useAI } from '../../context/AIContext'
import { getServiceStatus } from '../../services/aiService'

/**
 * AI Dashboard Page
 * 
 * Central hub for all AI-related features including suggestions,
 * conversation history, settings, and quick access to the assistant.
 * 
 * @component
 * @returns {JSX.Element} AI Dashboard page
 */
function AIDashboard() {
  const [activeTab, setActiveTab] = useState('suggestions')
  const [serviceStatus] = useState(getServiceStatus())
  
  const {
    isAssistantOpen,
    toggleAssistant,
    conversations,
    setCurrentConversation,
    deleteConversation,
    exportConversation,
    exportAllConversations,
    clearAllConversations,
    settings,
    updateSettings,
    getStatistics,
  } = useAI()

  const statistics = getStatistics()

  const handleSuggestionClick = (prompt) => {
    toggleAssistant()
    // The prompt will be used when the assistant opens
  }

  const handleConversationSelect = (conversation) => {
    setCurrentConversation(conversation)
    toggleAssistant()
  }

  const tabs = [
    { id: 'suggestions', label: 'Smart Suggestions', icon: '💡' },
    { id: 'history', label: 'History', icon: '💬' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <span className="text-4xl mr-3">🤖</span>
            AI Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your AI assistant and view insights
          </p>
        </div>

        {/* Service Status Badge */}
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${serviceStatus.available ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {serviceStatus.provider}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({serviceStatus.model})
              </span>
            </div>
          </div>

          <button
            onClick={toggleAssistant}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <span>💬</span>
            <span>Open Assistant</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                Total Conversations
              </p>
              <p className="text-3xl font-bold text-primary-900 dark:text-primary-100 mt-1">
                {statistics.totalConversations}
              </p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Total Messages
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                {statistics.totalMessages}
              </p>
            </div>
            <div className="text-4xl">📨</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                Avg. Messages
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">
                {statistics.avgMessagesPerConversation}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                Categories
              </p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                {Object.keys(statistics.categoryCounts || {}).length}
              </p>
            </div>
            <div className="text-4xl">🏷️</div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            <SmartSuggestions
              context="dashboard"
              onSuggestionClick={handleSuggestionClick}
            />

            {/* Getting Started Guide */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Getting Started with AI Assistant
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Smart Suggestions
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get context-aware recommendations based on your current work
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Context-Aware Help
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI understands your cases and appointments for better assistance
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-2xl">💬</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Conversation History
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All your conversations are saved and searchable
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-2xl">⚙️</div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      Customizable Settings
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Configure the AI assistant to match your preferences
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'history' && (
          <Card className="p-0 overflow-hidden">
            <ConversationHistory
              conversations={conversations}
              onConversationSelect={handleConversationSelect}
              onConversationDelete={deleteConversation}
              onExport={exportConversation}
            />
          </Card>
        )}

        {activeTab === 'settings' && (
          <AISettings
            settings={settings}
            onSettingsChange={updateSettings}
            statistics={statistics}
            onClearHistory={clearAllConversations}
            onExportAll={exportAllConversations}
          />
        )}
      </motion.div>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={isAssistantOpen}
        onToggle={toggleAssistant}
      />
    </div>
  )
}

export default AIDashboard