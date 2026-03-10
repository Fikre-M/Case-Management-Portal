import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Dashboard from './dashboard/Dashboard'
import AIAssistant from '../components/ai/AIAssistant'

function Demo() {
  const navigate = useNavigate()
  const [showAI, setShowAI] = useState(false)

  useEffect(() => {
    // Set demo user in localStorage for demo mode
    const demoUser = {
      id: 'demo-user-123',
      email: 'demo@example.com',
      name: 'Demo User',
      loginTime: Date.now(),
      isDemo: true
    }
    localStorage.setItem('ai_casemanager_current_user', JSON.stringify(demoUser))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Case Manager - Demo Mode</h1>
              <p className="text-sm opacity-90">Experience the full application without registration</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">
              LIVE DEMO
            </div>
            <Link
              to="/landing"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              Exit Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          <Dashboard />
        </div>

        {/* AI Assistant Toggle */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowAI(!showAI)}
            className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 hover:scale-110"
          >
            {showAI ? '✕' : '🤖'}
          </button>
        </div>

        {/* AI Assistant Sidebar */}
        {showAI && (
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-40">
            <AIAssistant />
          </div>
        )}
      </div>

      {/* Demo Instructions Overlay */}
      <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
        <h3 className="font-bold text-gray-900 mb-2">🎯 Demo Features</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click the 🤖 button to open AI Assistant</li>
          <li>• Explore the dashboard with real metrics</li>
          <li>• Try the case and appointment management</li>
          <li>• Experience the responsive design</li>
        </ul>
        <button
          onClick={() => navigate('/register')}
          className="mt-3 w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition-colors text-sm"
        >
          Create Your Account
        </button>
      </div>
    </div>
  )
}

export default Demo
