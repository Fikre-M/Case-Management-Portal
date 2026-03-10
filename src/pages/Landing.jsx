import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function Landing() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations and case analysis powered by advanced AI technology'
    },
    {
      icon: '📅',
      title: 'Smart Scheduling',
      description: 'Efficiently manage appointments with automated scheduling and reminder systems'
    },
    {
      icon: '📋',
      title: 'Case Management',
      description: 'Organize and track all your cases in one centralized platform with detailed analytics'
    },
    {
      icon: '👥',
      title: 'Client Relations',
      description: 'Build stronger client relationships with comprehensive communication and tracking tools'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Visualize your performance with detailed reports and real-time data insights'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Enterprise-grade security ensures your sensitive data remains protected and confidential'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Cases Managed' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-blue-600/10"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center">
            <div className={`transform transition-all duration-1000 ${isClient && isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Logo */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-8 shadow-lg">
                <span className="text-4xl">🤖</span>
              </div>
              
              {/* Main Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-primary-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
                  AI-Powered Case Management
                </span>
                <br />
                <span className="text-3xl md:text-4xl text-gray-700 font-semibold mt-4 block">
                  for Nonprofits
                </span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed"
              >
                Transform your nonprofit's impact with intelligent case management. 
                Streamline client services, automate administrative tasks, and focus on what matters most—
                <span className="font-semibold text-primary-600"> your mission</span>.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                >
                  Start Free Today
                </Link>
                <Link
                  to="/demo"
                  className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 shadow-md hover:shadow-lg text-lg"
                >
                  Watch Demo
                </Link>
              </motion.div>
            
            {/* Quick Demo - Interactive */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/80 px-4 py-2 rounded-full backdrop-blur cursor-pointer hover:bg-white hover:shadow-md transition-all duration-300"
              onClick={() => {
                if (isClient) {
                  // Navigate to login with demo credentials
                  window.location.href = '/login?demo=true'
                }
              }}
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Try interactive demo - No registration required</span>
            </motion.div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"></div>
      </section>

      {/* Demo Video Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See It in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how AI Case Manager transforms nonprofit operations in just 2 minutes
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl aspect-video">
              {/* Video Placeholder with Play Button */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-blue-600/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer hover:bg-white/30 transition-all duration-300 hover:scale-110">
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Product Demo</h3>
                  <p className="text-white/80 mb-6">Click to watch the full demonstration</p>
                  <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                    <span>2:45</span>
                    <span>•</span>
                    <span>HD Quality</span>
                  </div>
                </div>
              </div>
              
              {/* Thumbnail overlay effect */}
              <div className="absolute inset-0 bg-black/10"></div>
              
              {/* Video controls hint */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur">
                  ▶️ Click to play
                </div>
                <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur">
                  🔊 Sound on
                </div>
              </div>
            </div>
            
            {/* Video Description */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600 mb-6">
                Learn how nonprofits like yours are saving 10+ hours per week with AI-powered automation, 
                intelligent case tracking, and streamlined client management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/demo"
                  className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Try Live Demo
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300"
                >
                  Start Free Trial
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your workflow and enhance productivity
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1, 
                  ease: "easeOut" 
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white/50 backdrop-blur">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple onboarding process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Sign Up', description: 'Create your free account in seconds' },
              { step: '02', title: 'Set Up', description: 'Configure your workspace and preferences' },
              { step: '03', title: 'Manage', description: 'Start organizing cases and appointments' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals who have already streamlined their workflow with AI Case Manager
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg"
              >
                Start Free Trial
              </Link>
              <Link
                to="/demo"
                className="px-8 py-4 bg-white/20 backdrop-blur text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                Try Live Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="space-y-8">
            {/* Logo section - centered at top */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🤖</span>
              </div>
            </div>
            
            {/* Brand info and 3 columns side by side */}
            <div className="space-y-6 md:space-y-8">
              {/* Brand info */}
              <div className="text-center">
                <h3 className="font-bold text-lg md:text-xl mb-3">AI Case Manager</h3>
                <p className="text-gray-400 text-sm md:text-base">
                  Empowering professionals with intelligent case management solutions.
                </p>
              </div>
              
              {/* Product, Company, Support - 3 columns side by side */}
              <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-8">
                {/* Product */}
                <div className="text-center">
                  <h4 className="font-semibold mb-4 text-sm md:text-base">Product</h4>
                  <ul className="space-y-2 text-gray-400 text-xs md:text-sm">
                    <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                    <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                    <li><Link to="/demo" className="hover:text-white transition-colors">Demo</Link></li>
                  </ul>
                </div>
                
                {/* Company */}
                <div className="text-center">
                  <h4 className="font-semibold mb-4 text-sm md:text-base">Company</h4>
                  <ul className="space-y-2 text-gray-400 text-xs md:text-sm">
                    <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                    <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                    <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  </ul>
                </div>
                
                {/* Support */}
                <div className="text-center">
                  <h4 className="font-semibold mb-4 text-sm md:text-base">Support</h4>
                  <ul className="space-y-2 text-gray-400 text-xs md:text-sm">
                    <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                    <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                    <li><Link to="/status" className="hover:text-white transition-colors">Status</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 AI Case Manager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
