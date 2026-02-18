import { useCallback, useRef, useEffect } from 'react'

/**
 * Hook for optimizing interaction delays to meet 2026 performance standards
 * 
 * Implements debouncing, throttling, and interaction scheduling to ensure
 * <100ms interaction delays and smooth 60fps performance.
 * 
 * @returns {Object} Interaction optimization utilities
 * @returns {Function} returns.debounce - Debounced function executor
 * @returns {Function} returns.throttle - Throttled function executor  
 * @returns {Function} returns.scheduleWork - Schedule work for next idle period
 * @returns {Function} returns.measureInteraction - Measure interaction timing
 * 
 * @example
 * function SearchInput() {
 *   const { debounce, measureInteraction } = useInteractionOptimization()
 *   
 *   const handleSearch = debounce((query) => {
 *     // Search logic - will be debounced to 300ms
 *     performSearch(query)
 *   }, 300)
 *   
 *   const handleClick = measureInteraction((e) => {
 *     // Click handler with performance measurement
 *     handleButtonClick(e)
 *   })
 *   
 *   return (
 *     <input 
 *       onChange={(e) => handleSearch(e.target.value)}
 *       onClick={handleClick}
 *     />
 *   )
 * }
 */
export function useInteractionOptimization() {
  const timeoutsRef = useRef(new Map())
  const throttleRef = useRef(new Map())
  const metricsRef = useRef([])

  /**
   * Debounces a function to prevent excessive calls
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  const debounce = useCallback((func, delay = 300) => {
    return (...args) => {
      const key = func.toString()
      
      if (timeoutsRef.current.has(key)) {
        clearTimeout(timeoutsRef.current.get(key))
      }
      
      const timeoutId = setTimeout(() => {
        func.apply(null, args)
        timeoutsRef.current.delete(key)
      }, delay)
      
      timeoutsRef.current.set(key, timeoutId)
    }
  }, [])

  /**
   * Throttles a function to limit execution frequency
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  const throttle = useCallback((func, limit = 100) => {
    return (...args) => {
      const key = func.toString()
      
      if (!throttleRef.current.has(key)) {
        func.apply(null, args)
        throttleRef.current.set(key, true)
        
        setTimeout(() => {
          throttleRef.current.delete(key)
        }, limit)
      }
    }
  }, [])

  /**
   * Schedules work for the next idle period
   * @param {Function} callback - Work to schedule
   * @param {Object} options - Scheduling options
   * @returns {number} Request ID for cancellation
   */
  const scheduleWork = useCallback((callback, options = {}) => {
    const { timeout = 5000, priority = 'normal' } = options
    
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      return window.requestIdleCallback(callback, { timeout })
    } else {
      // Fallback for browsers without requestIdleCallback
      const delay = priority === 'high' ? 0 : priority === 'low' ? 100 : 16
      return setTimeout(callback, delay)
    }
  }, [])

  /**
   * Measures interaction timing and reports performance
   * @param {Function} handler - Event handler to measure
   * @param {string} name - Interaction name for tracking
   * @returns {Function} Wrapped handler with measurement
   */
  const measureInteraction = useCallback((handler, name = 'interaction') => {
    return (event) => {
      const startTime = performance.now()
      
      // Execute the handler
      const result = handler(event)
      
      // Measure completion time
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Store metric
      const metric = {
        name,
        duration,
        timestamp: startTime,
        target: event?.target?.tagName || 'unknown',
        type: event?.type || 'unknown'
      }
      
      metricsRef.current.push(metric)
      
      // Keep only last 100 measurements
      if (metricsRef.current.length > 100) {
        metricsRef.current = metricsRef.current.slice(-100)
      }
      
      // Log slow interactions in development
      if (process.env.NODE_ENV === 'development' && duration > 100) {
        console.warn(`🐌 Slow interaction detected: ${name}`, {
          duration: `${duration.toFixed(2)}ms`,
          target: metric.target,
          type: metric.type,
          recommendation: duration > 200 ? 'Consider code splitting or optimization' : 'Monitor for consistency'
        })
      }
      
      // Report to Web Vitals if available
      if (typeof window !== 'undefined' && window.webVitals) {
        window.webVitals.reportInteraction({
          name,
          duration,
          startTime,
          target: metric.target
        })
      }
      
      return result
    }
  }, [])

  /**
   * Gets interaction performance statistics
   * @returns {Object} Performance statistics
   */
  const getInteractionStats = useCallback(() => {
    const metrics = metricsRef.current
    if (metrics.length === 0) return null
    
    const durations = metrics.map(m => m.duration)
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length
    const max = Math.max(...durations)
    const min = Math.min(...durations)
    const slowInteractions = metrics.filter(m => m.duration > 100).length
    
    return {
      totalInteractions: metrics.length,
      averageDuration: Math.round(avg * 100) / 100,
      maxDuration: Math.round(max * 100) / 100,
      minDuration: Math.round(min * 100) / 100,
      slowInteractions,
      slowPercentage: Math.round((slowInteractions / metrics.length) * 100),
      isGoodPerformance: avg < 100 && slowInteractions / metrics.length < 0.1
    }
  }, [])

  /**
   * Optimizes event handlers for better performance
   * @param {Function} handler - Event handler to optimize
   * @param {Object} options - Optimization options
   * @returns {Function} Optimized handler
   */
  const optimizeHandler = useCallback((handler, options = {}) => {
    const { 
      debounceMs = 0, 
      throttleMs = 0, 
      measure = true, 
      name = 'handler',
      passive = false 
    } = options
    
    let optimizedHandler = handler
    
    // Apply debouncing if specified
    if (debounceMs > 0) {
      optimizedHandler = debounce(optimizedHandler, debounceMs)
    }
    
    // Apply throttling if specified
    if (throttleMs > 0) {
      optimizedHandler = throttle(optimizedHandler, throttleMs)
    }
    
    // Apply measurement if enabled
    if (measure) {
      optimizedHandler = measureInteraction(optimizedHandler, name)
    }
    
    // Add passive event listener hint
    if (passive && typeof optimizedHandler === 'function') {
      optimizedHandler.passive = true
    }
    
    return optimizedHandler
  }, [debounce, throttle, measureInteraction])

  /**
   * Cleanup function for component unmount
   */
  useEffect(() => {
    return () => {
      // Clear all timeouts
      timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId))
      timeoutsRef.current.clear()
      throttleRef.current.clear()
    }
  }, [])

  return {
    debounce,
    throttle,
    scheduleWork,
    measureInteraction,
    optimizeHandler,
    getInteractionStats
  }
}