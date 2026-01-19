import { usePerformance } from '../../hooks/usePerformance'

// Performance monitoring component for development
function PerformanceMonitor() {
  const { metrics } = usePerformance()
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-3 rounded-lg font-mono z-50 backdrop-blur-sm">
      <div className="text-green-400 font-bold mb-1">⚡ Performance</div>
      <div>Load: {metrics.loadTime}ms</div>
      <div>Render: {metrics.renderTime}ms</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
      <div>FPS: {metrics.fps}</div>
    </div>
  )
}

export default PerformanceMonitor