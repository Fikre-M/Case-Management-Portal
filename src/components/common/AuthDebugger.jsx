import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useDraggable } from '../../hooks/useDraggable'

function AuthDebugger() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  
  // Separate draggable instances for button and panel
  // Use safer initial positions that work on all screen sizes
  const buttonDraggable = useDraggable({ 
    x: -60, // Will be adjusted by responsive positioning
    y: 100 
  })
  const panelDraggable = useDraggable({ 
    x: -250, // Will be adjusted by responsive positioning
    y: 150 
  })
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <>
      {/* Draggable Toggle Button */}
      <motion.button
        ref={buttonDraggable.elementRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: 'fixed',
          left: buttonDraggable.position.x,
          top: buttonDraggable.position.y,
          zIndex: 50
        }}
        className={`w-10 h-10 bg-blue-600/80 hover:bg-blue-600/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-400 transition-colors shadow-lg select-none ${
          buttonDraggable.isDragging ? 'shadow-2xl scale-110' : ''
        } ${buttonDraggable.dragHandleProps.className}`}
        title="Auth Status (Drag to move)"
        {...buttonDraggable.dragHandleProps}
      >
        <span className="pointer-events-none">👤</span>
      </motion.button>

      {/* Auth Status Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={panelDraggable.elementRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed',
              left: panelDraggable.position.x,
              top: panelDraggable.position.y,
              zIndex: 51
            }}
            className={`bg-blue-900/90 text-white text-xs rounded-lg font-mono backdrop-blur-sm border border-blue-600 shadow-lg min-w-[200px] max-w-[280px] select-none ${
              panelDraggable.isDragging ? 'shadow-2xl scale-105' : ''
            } transition-all duration-200`}
          >
            {/* Draggable Header */}
            <div 
              {...panelDraggable.dragHandleProps}
              className={`flex items-center justify-between p-2 border-b border-blue-600 bg-blue-800/50 rounded-t-lg ${panelDraggable.dragHandleProps.className} hover:bg-blue-700/50 transition-colors`}
              title="Drag to move this panel"
            >
              <div className="flex items-center space-x-2">
                <span className="text-blue-400 text-xs">⋮⋮</span>
                <span className="text-blue-300 font-bold">🔐 Auth Status</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsVisible(false)
                }}
                className="w-5 h-5 hover:bg-blue-700 rounded flex items-center justify-center transition-colors text-blue-300 hover:text-white"
                title="Close"
              >
                ×
              </button>
            </div>
            
            <div className="p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Loading:</span>
                <span className={isLoading ? 'text-yellow-300' : 'text-green-300'}>
                  {isLoading ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Authenticated:</span>
                <span className={isAuthenticated ? 'text-green-300' : 'text-red-300'}>
                  {isAuthenticated ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-blue-200">User:</span>
                <span className="text-white truncate max-w-[100px]" title={user?.name || 'None'}>
                  {user?.name || 'None'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Email:</span>
                <span className="text-white truncate max-w-[100px]" title={user?.email || 'None'}>
                  {user?.email || 'None'}
                </span>
              </div>
              
              <div className="pt-2 border-t border-blue-600">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isAuthenticated ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <span className="text-xs text-blue-200">
                    {isAuthenticated ? 'Session Active' : 'Not Logged In'}
                  </span>
                </div>
              </div>

              {/* Drag Hint */}
              <div className="pt-1 border-t border-blue-700">
                <span className="text-xs text-blue-400">💡 Drag header or button to move</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AuthDebugger