import { useState } from 'react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import ToastContainer from '../../components/common/ToastContainer'

function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { toasts, success, removeToast } = useToast()
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: true,
    },
    preferences: {
      language: 'en',
      timezone: 'UTC-5',
      dateFormat: 'MM/DD/YYYY',
    },
    privacy: {
      profileVisible: true,
      activityTracking: false,
    }
  })

  const handleNotificationChange = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }))
    success(`${type} notifications ${settings.notifications[type] ? 'disabled' : 'enabled'}`)
  }

  const handlePreferenceChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
    success('Preferences updated')
  }

  const handlePrivacyChange = (key) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key]
      }
    }))
    success('Privacy settings updated')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account preferences and app settings</p>
      </div>

      {/* Theme Settings */}
      <Card title="Appearance">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card title="Notifications">
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {key} Notifications
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive {key} notifications for important updates
                </p>
              </div>
              <button
                onClick={() => handleNotificationChange(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Preferences */}
      <Card title="Preferences">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={settings.preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="input-field"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={settings.preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="input-field"
            >
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-7">Mountain Time (UTC-7)</option>
              <option value="UTC-6">Central Time (UTC-6)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC+0">UTC</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Format
            </label>
            <select
              value={settings.preferences.dateFormat}
              onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
              className="input-field"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card title="Privacy & Security">
        <div className="space-y-4">
          {Object.entries(settings.privacy).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {key === 'profileVisible' ? 'Profile Visibility' : 'Activity Tracking'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {key === 'profileVisible' 
                    ? 'Make your profile visible to other users'
                    : 'Allow tracking for analytics and improvements'
                  }
                </p>
              </div>
              <button
                onClick={() => handlePrivacyChange(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Tech Stack Showcase */}
      <Card title="🚀 Built With Modern Tech Stack">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'React 18', icon: '⚛️', color: 'bg-blue-100 text-blue-800' },
            { name: 'Vite', icon: '⚡', color: 'bg-purple-100 text-purple-800' },
            { name: 'TailwindCSS', icon: '🎨', color: 'bg-cyan-100 text-cyan-800' },
            { name: 'Context API', icon: '🔄', color: 'bg-green-100 text-green-800' },
          ].map((tech, index) => (
            <div key={index} className={`p-3 rounded-lg ${tech.color} text-center`}>
              <div className="text-2xl mb-1">{tech.icon}</div>
              <div className="text-sm font-medium">{tech.name}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Showcase Features:</strong> Responsive design, dark mode, animations, 
            state management, mock AI integration, and modern UI patterns.
          </p>
        </div>
      </Card>

      {/* Account Actions */}
      <Card title="Account">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Export Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Download all your data</p>
            </div>
            <Button variant="secondary">Export</Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-red-900 dark:text-red-400">Delete Account</h3>
              <p className="text-sm text-red-600 dark:text-red-500">Permanently delete your account</p>
            </div>
            <Button variant="danger">Delete</Button>
          </div>
        </div>
      </Card>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default Settings