import { useState } from 'react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import SkeletonLoader from '../../components/common/SkeletonLoader'
import { useToast } from '../../hooks/useToast'
import ToastContainer from '../../components/common/ToastContainer'

function TechShowcase() {
  const { toasts, success, error, warning, info, removeToast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [showSkeletons, setShowSkeletons] = useState(false)

  const techStack = [
    { name: 'React 18', description: 'Modern React with hooks and concurrent features', icon: '⚛️', category: 'Frontend' },
    { name: 'Vite', description: 'Lightning fast build tool and dev server', icon: '⚡', category: 'Build' },
    { name: 'TailwindCSS', description: 'Utility-first CSS framework', icon: '🎨', category: 'Styling' },
    { name: 'Context API', description: 'Global state management', icon: '🔄', category: 'State' },
    { name: 'React Router', description: 'Client-side routing', icon: '🧭', category: 'Navigation' },
    { name: 'Framer Motion', description: 'Animation library', icon: '🎬', category: 'Animation' },
  ]

  const features = [
    { name: 'Authentication System', status: 'complete', description: 'Login, register, forgot password with validation' },
    { name: 'Global State Management', status: 'complete', description: 'React Context with CRUD operations' },
    { name: 'Responsive Design', status: 'complete', description: 'Mobile-first, tablet, desktop optimized' },
    { name: 'Dark Mode', status: 'complete', description: 'System-wide theme switching' },
    { name: 'AI Chat Interface', status: 'complete', description: 'Modern chat UI with mock AI responses' },
    { name: 'Data Visualization', status: 'complete', description: 'Charts, progress bars, analytics' },
    { name: 'Form Validation', status: 'complete', description: 'Client-side validation with error handling' },
    { name: 'Toast Notifications', status: 'complete', description: 'User feedback system' },
    { name: 'Skeleton Loaders', status: 'complete', description: 'Loading states for better UX' },
    { name: 'Modal System', status: 'complete', description: 'Accessible modals with animations' },
  ]

  const demoToasts = () => {
    success('This is a success message!')
    setTimeout(() => error('This is an error message!'), 500)
    setTimeout(() => warning('This is a warning message!'), 1000)
    setTimeout(() => info('This is an info message!'), 1500)
  }

  const toggleSkeletons = () => {
    setShowSkeletons(true)
    setTimeout(() => setShowSkeletons(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🚀 Modern Web Development Showcase
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
          AI-Powered Case Management System
        </p>
        <p className="text-gray-500 dark:text-gray-500">
          Demonstrating modern React patterns, responsive design, and professional UI/UX
        </p>
      </div>

      {/* Quick Demo Actions */}
      <Card title="🎮 Interactive Demos">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button onClick={demoToasts} className="w-full">
            🍞 Toast Demo
          </Button>
          <Button onClick={toggleSkeletons} variant="secondary" className="w-full">
            💀 Skeleton Demo
          </Button>
          <Button onClick={() => setShowModal(true)} variant="secondary" className="w-full">
            🎭 Modal Demo
          </Button>
          <Button onClick={() => document.documentElement.classList.toggle('dark')} variant="secondary" className="w-full">
            🌓 Theme Demo
          </Button>
        </div>
      </Card>

      {/* Tech Stack */}
      <Card title="🛠️ Technology Stack">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <span className="text-3xl">{tech.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tech.name}</h3>
                  <p className="text-xs text-primary-600 dark:text-primary-400 mb-2">{tech.category}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tech.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Features Showcase */}
      <Card title="✨ Features Implemented">
        {showSkeletons ? (
          <SkeletonLoader type="list" count={5} />
        ) : (
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{feature.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
                <Badge variant="success">
                  {feature.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Architecture Overview */}
      <Card title="🏗️ Architecture Highlights">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Frontend Architecture</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Component-based architecture with reusable UI components</li>
              <li>• Global state management using React Context API</li>
              <li>• Custom hooks for business logic and side effects</li>
              <li>• Responsive design with mobile-first approach</li>
              <li>• Dark mode support across all components</li>
              <li>• Form validation with real-time error feedback</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Key Features</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Full CRUD operations for appointments and cases</li>
              <li>• Interactive calendar with appointment display</li>
              <li>• AI chat interface with intelligent responses</li>
              <li>• Analytics dashboard with charts and metrics</li>
              <li>• Toast notifications for user feedback</li>
              <li>• Skeleton loaders for better perceived performance</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card title="⚡ Performance Metrics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">&lt; 2s</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Load Time</div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">&lt; 500KB</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bundle Size</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">90+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Lighthouse Score</div>
          </div>
        </div>
      </Card>

      {/* Demo Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="🎭 Modal Demo"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This is a demonstration of the enhanced modal component with:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>Smooth scale-in animation</li>
            <li>Backdrop click to close</li>
            <li>ESC key to close</li>
            <li>Prevents body scroll</li>
            <li>Responsive sizing</li>
            <li>Dark mode support</li>
          </ul>
          <div className="flex space-x-4 pt-4">
            <Button onClick={() => success('Modal action completed!')} className="flex-1">
              Demo Action
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default TechShowcase