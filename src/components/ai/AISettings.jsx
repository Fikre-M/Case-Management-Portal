import { useState } from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import Card from '../common/Card'

/**
 * AI Settings Component
 * 
 * Provides configuration options for AI Assistant behavior,
 * history management, and preferences.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.settings - Current settings object
 * @param {Function} props.onSettingsChange - Callback when settings change
 * @param {Object} props.statistics - AI usage statistics
 * @param {Function} props.onClearHistory - Callback to clear history
 * @param {Function} props.onExportAll - Callback to export all conversations
 * @returns {JSX.Element} AI settings component
 */
function AISettings({ 
  settings, 
  onSettingsChange, 
  statistics,
  onClearHistory,
  onExportAll 
}) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value }
    setLocalSettings(newSettings)
    onSettingsChange?.(newSettings)
  }

  const handleClearHistory = () => {
    setShowConfirm(true)
  }

  const confirmClearHistory = () => {
    onClearHistory?.()
    setShowConfirm(false)
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          General Settings
        </h3>

        <div className="space-y-4">
          {/* Auto Suggestions */}
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900 dark:text-white">
                Smart Suggestions
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Show AI-powered suggestions based on your activity
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('autoSuggestions', !localSettings.autoSuggestions)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.autoSuggestions ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.autoSuggestions ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Save History */}
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900 dark:text-white">
                Save Conversation History
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep a record of your AI conversations
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('saveHistory', !localSettings.saveHistory)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.saveHistory ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.saveHistory ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900 dark:text-white">
                Notifications
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified about important AI suggestions
              </p>
            </div>
            <button
              onClick={() => handleSettingChange('notificationsEnabled', !localSettings.notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.notificationsEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Max History Items */}
          <div>
            <label className="font-medium text-gray-900 dark:text-white block mb-2">
              Maximum History Items: {localSettings.maxHistoryItems}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={localSettings.maxHistoryItems}
              onChange={(e) => handleSettingChange('maxHistoryItems', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
              <span>10</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      {statistics && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Usage Statistics
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {statistics.totalConversations}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Conversations
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {statistics.totalMessages}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Messages
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {statistics.avgMessagesPerConversation}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg. Messages/Conv.
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Object.keys(statistics.categoryCounts || {}).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Categories Used
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          {statistics.categoryCounts && Object.keys(statistics.categoryCounts).length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Conversations by Category
              </h4>
              <div className="space-y-2">
                {Object.entries(statistics.categoryCounts).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {category}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {count} conversation{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Data Management */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Management
        </h3>

        <div className="space-y-3">
          {/* Export All */}
          <button
            onClick={onExportAll}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>📥</span>
            <span>Export All Conversations</span>
          </button>

          {/* Clear History */}
          <button
            onClick={handleClearHistory}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>🗑️</span>
            <span>Clear All History</span>
          </button>

          {/* Confirmation Dialog */}
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowConfirm(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Clear All History?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This will permanently delete all your AI conversation history. This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmClearHistory}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Clear History
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            ⚠️ Clearing history will remove all saved conversations from your browser. 
            Consider exporting first if you want to keep a backup.
          </p>
        </div>
      </Card>

      {/* Privacy Notice */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Privacy & Data
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <p>
            🔒 All conversation data is stored locally in your browser and never sent to external servers 
            (except when communicating with the AI service).
          </p>
          <p>
            🤖 When using OpenAI integration, your messages are sent to OpenAI's servers according to 
            their privacy policy.
          </p>
          <p>
            💾 You can export your data at any time and clear your history whenever you want.
          </p>
        </div>
      </Card>
    </div>
  )
}

AISettings.propTypes = {
  settings: PropTypes.shape({
    autoSuggestions: PropTypes.bool,
    saveHistory: PropTypes.bool,
    notificationsEnabled: PropTypes.bool,
    maxHistoryItems: PropTypes.number,
  }).isRequired,
  onSettingsChange: PropTypes.func,
  statistics: PropTypes.shape({
    totalConversations: PropTypes.number,
    totalMessages: PropTypes.number,
    avgMessagesPerConversation: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoryCounts: PropTypes.object,
  }),
  onClearHistory: PropTypes.func,
  onExportAll: PropTypes.func,
}

export default AISettings