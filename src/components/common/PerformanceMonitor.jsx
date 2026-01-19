import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePerformance } from '../../hooks/usePerformance'
import { useDraggable } from '../../hooks/useDraggable'

// Performance monitoring component for development
function PerformanceMonitor() {
  const { metrics } = usePerformance()
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  
  // Separate draggable instances for button and panel
  // Use safer initial positions that work on all screen sizes
  const buttonDraggable = useDraggable({ 
    x: -60, // Will be adjusted by responsive positioning to right side
    y: -60  // Will be adjusted to bottom right
  })
  const panelDraggable = useDraggable({ 
    x: -200, // Will be adjusted by responsive positioning to right side
    y: -200  // Will be adjusted to bottom right
  })
  
  if (process.env.NODE_ENV !== 'development') {
    return null
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
        className={`w-12 h-12 bg-black/80 hover:bg-black/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-gray-600 transition-colors shadow-lg select-none ${
          buttonDraggable.isDragging ? 'shadow-2xl scale-110' : ''
        } ${buttonDraggable.dragHandleProps.className}`}
        title="Show Performance Monitor (Drag to move)"
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
        className={`bg-black/90 text-white text-xs rounded-lg font-mono backdrop-blur-sm border border-gray-600 shadow-lg select-none max-w-[220px] ${
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
            <span className="text-green-400 font-bold">⚡</span>
            <span className="text-green-400 font-bold">Performance</span>
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
              className="p-3 space-y-2 min-w-[160px]"
            >
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

              {/* Drag Hint */}
              <div className="pt-1 border-t border-gray-700">
                <span className="text-xs text-gray-500">💡 Drag header to move</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

export default PerformanceMonitor