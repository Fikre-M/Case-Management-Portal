import { useEffect, useState, useCallback } from 'react'

export function usePerformance() {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    fps: 0
  })

  const measureRenderTime = useCallback((componentName) => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      setMetrics(prev => ({
        ...prev,
        renderTime: Math.round(renderTime * 100) / 100
      }))
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`)
      }
    }
  }, [])

  const measureMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = performance.memory
      setMetrics(prev => ({
        ...prev,
        memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100
      }))
    }
  }, [])

  const measureFPS = useCallback(() => {
    let frames = 0
    let lastTime = performance.now()
    
    function countFrames() {
      frames++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round(frames * 1000 / (currentTime - lastTime))
        }))
        
        frames = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(countFrames)
    }
    
    requestAnimationFrame(countFrames)
  }, [])

  useEffect(() => {
    // Measure initial load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
    setMetrics(prev => ({ ...prev, loadTime }))

    // Start FPS monitoring
    measureFPS()
    
    // Monitor memory usage every 5 seconds
    const memoryInterval = setInterval(measureMemoryUsage, 5000)
    
    return () => {
      clearInterval(memoryInterval)
    }
  }, [measureFPS, measureMemoryUsage])

  return {
    metrics,
    measureRenderTime
  }
}

// Performance monitoring component for development
export function PerformanceMonitor() {
  const { metrics } = usePerformance()
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-3 rounded-lg font-mono z-50">
      <div>Load: {metrics.loadTime}ms</div>
      <div>Render: {metrics.renderTime}ms</div>
      <div>Memory: {metrics.memoryUsage}MB</div>
      <div>FPS: {metrics.fps}</div>
    </div>
  )
}