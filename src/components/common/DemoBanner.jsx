import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

/**
 * Demo Banner Component
 * 
 * Displays a clear "DEMO ONLY" banner for public demo deployments.
 * Can be toggled via environment variable or URL parameter.
 */
function DemoBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Check if we should show demo banner
    const shouldShow = () => {
      // Environment variable override
      if (import.meta.env.VITE_SHOW_DEMO_BANNER === 'false') {
        return false
      }
      
      // URL parameter override
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('hideDemoBanner') === 'true') {
        return false
      }
      
      // Default: show in production/demo environments
      return import.meta.env.MODE === 'production' || 
             import.meta.env.VITE_DEMO_MODE === 'true'
    }

    setIsVisible(shouldShow())
  }, [])

  // Don't render if dismissed or not visible
  if (!isVisible || isDismissed) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="bg-white/20 px-2 py-1 rounded text-xs font-semibold animate-pulse">
              DEMO ONLY
            </span>
            <span className="text-sm font-medium">
              This is a demonstration environment with mock data and simulated AI responses.
            </span>
            <a 
              href="/register" 
              className="underline hover:no-underline text-white/90 hover:text-white transition-colors"
            >
              Sign up for a real account
            </a>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
            aria-label="Dismiss demo banner"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Add padding to body to account for fixed banner */}
      <style jsx>{`
        body {
          padding-top: 48px;
        }
      `}</style>
    </div>
  )
}

export default DemoBanner
