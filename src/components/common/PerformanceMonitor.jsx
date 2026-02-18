import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePerformance } from '../../hooks/usePerformance'
import { useWebVitals } from '../../hooks/useWebVitals'
import { useDraggable } from '../../hooks/useDraggable'

/**
 * Enhanced Performance Monitor for 2026 Web Standards
 * 
 * Monitors Core Web Vitals (LCP, FID, CLS, INP) alongside traditional metrics.
 * Provides real-time performance insights and optimization recommendations.
 * 
 * @component
 * @returns {JSX.Element|null} Performance monitoring panel or null in production
 */
function PerformanceMonitor() {
  const { metrics } = usePerformance()
  const { vitals, isGoodPerformance, getStatus } = useWebVitals()
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState('vitals') // 'vitals' | 'metrics'
  
  // Separate draggable instances for button and panel
  const buttonDraggable = useDraggable({ 
    x: -60, 
    y: -60  
  })
  const panelDraggable = useDraggable({ 
    x: -280, // Wider panel for Web Vitals
    y: -200  
  })
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  /**
   * Formats metric values for display
   */
  const formatMetric = (name, vital) => {
    if (!vital) return 'N/A'
    
    const value = vital.value
    if (name === 'CLS') return (value * 1000).toFixed(1)
    if (name === 'LCP' || name === 'FCP' || name === 'TTFB') return `${Math.round(value)}ms`
    if (name === 'FID' || name === 'INP') return `${Math.round(value)}ms`
    return Math.round(value)
  }

  /**
   * Gets color for metric status
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-400'
      case 'needs-improvement': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  if (!isVisible) {
    return (
      <motion.button
        ref={buttonDraggable.elementRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          left: buttonDraggable.position.x,
          top: buttonDraggable.position.y,
          zIndex: 50
        }}
        className={`w-12 h-12 ${isGoodPerformance ? 'bg-green-600/80 hover:bg-green-600/90' : 'bg-red-600/80 hover:bg-red-600/90'} text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-600 transition-colors shadow-lg select-none ${
          buttonDraggable.isDragging ? 'shadow-2xl scale-110' : ''
        } ${buttonDraggable.dragHandleProps.className}`}
        title={`Performance: ${isGoodPerformance ? 'Good' : 'Needs Attention'} (Drag to move)`}
        {...buttonDraggable.dragHandleProps}
      >
        <span className="pointer-events-none">⚡</span>
      </motion.button>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={panelDraggable.elementRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          position: 'fixed',
          left: panelDraggable.position.x,
          top: panelDraggable.position.y,
          zIndex: 50
        }}
        className={`bg-black/90 text-white text-xs rounded-lg font-mono backdrop-blur-sm border border-gray-600 shadow-lg select-none max-w-[280px] ${
          panelDraggable.isDragging ? 'shadow-2xl scale-105' : ''
        } transition-all duration-200`}
      >
        {/* Draggable Header */}
        <div 
          {...panelDraggable.dragHandleProps}
          className={`flex items-center justify-between p-2 border-b border-gray-600 bg-gray-800/50 rounded-t-lg ${panelDraggable.dragHandleProps.className} hover:bg-gray-700/50 transition-colors`}
          title="Drag to move this panel"
        >
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-xs">⋮⋮</span>
            <span className={`font-bold ${isGoodPerformance ? 'text-green-400' : 'text-red-400'}`}>⚡</span>
            <span className={`font-bold ${isGoodPerformance ? 'text-green-400' : 'text-red-400'}`}>Performance 2026</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMinimized(!isMinimized)
              }}
              className="w-5 h-5 hover:bg-gray-700 rounded flex items-center justify-center transition-colors text-gray-300 hover:text-white"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? '□' : '−'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsVisible(false)
              }}
              className="w-5 h-5 hover:bg-gray-700 rounded flex items-center justify-center transition-colors text-gray-300 hover:text-white"
              title="Hide"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="min-w-[240px]"
            >
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-600">
                <button
                  onClick={() => setActiveTab('vitals')}
                  className={`flex-1 p-2 text-xs transition-colors ${
                    activeTab === 'vitals' 
                      ? 'bg-blue-600/50 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Web Vitals
                </button>
                <button
                  onClick={() => setActiveTab('metrics')}
                  className={`flex-1 p-2 text-xs transition-colors ${
                    activeTab === 'metrics' 
                      ? 'bg-blue-600/50 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Runtime
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-3 space-y-2">
                {activeTab === 'vitals' ? (
                  <>
                    {/* Core Web Vitals */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">LCP:</span>
                        <span className={`font-medium ${getStatusColor(getStatus('LCP'))}`}>
                          {formatMetric('LCP', vitals.LCP)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">FID:</span>
                        <span className={`font-medium ${getStatusColor(getStatus('FID'))}`}>
                          {formatMetric('FID', vitals.FID)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">CLS:</span>
                        <span className={`font-medium ${getStatusColor(getStatus('CLS'))}`}>
                          {formatMetric('CLS', vitals.CLS)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">INP:</span>
                        <span className={`font-medium ${getStatusColor(getStatus('INP'))}`}>
                          {formatMetric('INP', vitals.INP)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">TTFB:</span>
                        <span className={`font-medium ${getStatusColor(getStatus('TTFB'))}`}>
                          {formatMetric('TTFB', vitals.TTFB)}
                        </span>
                      </div>
                    </div>

                    {/* Overall Status */}
                    <div className="pt-2 border-t border-gray-600">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isGoodPerformance ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <span className="text-xs text-gray-300">
                          {isGoodPerformance ? '2026 Ready' : 'Needs Optimization'}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Runtime Metrics */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Load:</span>
                        <span className="text-white font-medium">{metrics.loadTime}ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Render:</span>
                        <span className="text-white font-medium">{metrics.renderTime}ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Memory:</span>
                        <span className="text-white font-medium">{metrics.memoryUsage}MB</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">FPS:</span>
                        <span className={`font-medium ${
                          metrics.fps >= 50 ? 'text-green-400' : 
                          metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {metrics.fps}
                        </span>
                      </div>
                    </div>

                    {/* Performance Status */}
                    <div className="pt-2 border-t border-gray-600">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          metrics.fps >= 50 && metrics.memoryUsage < 100 ? 'bg-green-400' :
                          metrics.fps >= 30 && metrics.memoryUsage < 200 ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                        <span className="text-xs text-gray-300">
                          {metrics.fps >= 50 && metrics.memoryUsage < 100 ? 'Excellent' :
                           metrics.fps >= 30 && metrics.memoryUsage < 200 ? 'Good' : 'Needs Optimization'}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Drag Hint */}
                <div className="pt-1 border-t border-gray-700">
                  <span className="text-xs text-gray-500">💡 Drag header to move</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

export default PerformanceMonitor