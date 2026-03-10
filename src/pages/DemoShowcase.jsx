import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function DemoShowcase() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeDemo, setActiveDemo] = useState('dashboard')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const demos = [
    {
      id: 'dashboard',
      title: 'AI-Powered Dashboard',
      description: 'Real-time metrics, analytics, and intelligent insights powered by AI',
      features: ['Real-time Analytics', 'Interactive Charts', 'AI Suggestions', 'Performance Monitoring'],
      image: '/demo-screenshots/dashboard-overview.png'
    },
    {
      id: 'ai-assistant',
      title: 'Intelligent AI Assistant',
      description: 'Context-aware conversational AI that understands your cases and appointments',
      features: ['Natural Language Chat', 'Context Awareness', 'Smart Suggestions', 'Conversation History'],
      image: '/demo-screenshots/ai-sidebar.png'
    },
    {
      id: 'case-management',
      title: 'Smart Case Management',
      description: 'Organize, track, and manage all your cases with intelligent automation',
      features: ['Case Tracking', 'Document Management', 'Timeline View', 'Smart Search'],
      image: '/demo-screenshots/case-list.png'
    },
    {
      id: 'mobile',
      title: 'Mobile-First Design',
      description: 'Seamless experience across all devices with responsive design',
      features: ['Touch Optimized', 'Responsive Layout', 'Mobile Navigation', 'Fast Performance'],
      image: '/demo-screenshots/mobile-dashboard.png'
    }
  ]

  const metrics = [
    { number: '19.2.4', label: 'React Version', icon: '⚛️' },
    { number: '85+', label: 'Lighthouse Score', icon: '🚀' },
    { number: '388KB', label: 'Bundle Size', icon: '📦' },
    { number: '<2s', label: 'Load Time', icon: '⚡' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-blue-600/10"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-8 shadow-lg">
                <span className="text-4xl">🤖</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                  AI Case Manager
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Production-ready demo showcasing modern React development with AI integration,
                responsive design, and exceptional user experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/landing"
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Try Live App
                </Link>
                <a
                  href="https://github.com/yourusername/ai-case-manager"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300"
                >
                  View Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 bg-white/50 backdrop-blur">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {metric.icon} {metric.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Interactive Demo Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the key features that make this application production-ready
            </p>
          </div>

          {/* Demo Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeDemo === demo.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {demo.title}
              </button>
            ))}
          </div>

          {/* Active Demo Display */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {demos.find(d => d.id === activeDemo)?.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {demos.find(d => d.id === activeDemo)?.description}
                </p>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Key Features:</h4>
                  <ul className="space-y-2">
                    {demos.find(d => d.id === activeDemo)?.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    to="/landing"
                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Try Live App
                    <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
              
              <div className="bg-gray-100 p-8 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="bg-white rounded-lg shadow-lg p-4">
                    <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-center">
                        📸 {demos.find(d => d.id === activeDemo)?.title} Screenshot
                      </span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Interactive demo screenshot
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-white/50 backdrop-blur">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Modern Tech Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with cutting-edge technologies for optimal performance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">React 19.2.4</h3>
              <p className="text-gray-600">Latest React with concurrent features and proper hydration</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern UI</h3>
              <p className="text-gray-600">TailwindCSS, Framer Motion, and professional design system</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Integration</h3>
              <p className="text-gray-600">OpenAI GPT-3.5-turbo with context-aware assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience the Demo?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Try the live interactive demo with AI-powered features and modern UI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/landing"
                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg"
              >
                Launch Live App
              </Link>
              <a
                href="/DEMO_SHOWCASE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/20 backdrop-blur text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DemoShowcase
