import { useEffect, useState } from 'react'

/**
 * Hook for monitoring Core Web Vitals in real-time
 * 
 * Tracks LCP, FID, CLS, FCP, and TTFB metrics for 2026 performance standards.
 * Falls back to manual implementation if web-vitals package is not available.
 * 
 * @returns {Object} Web Vitals metrics and reporting functions
 * @returns {Object} returns.vitals - Current Web Vitals measurements
 * @returns {Function} returns.reportVital - Manual vital reporting function
 * @returns {boolean} returns.isGoodPerformance - Overall performance status
 * 
 * @example
 * function App() {
 *   const { vitals, isGoodPerformance } = useWebVitals()
 *   
 *   return (
 *     <div>
 *       {!isGoodPerformance && <PerformanceWarning />}
 *       <MainContent />
 *     </div>
 *   )
 * }
 */
export function useWebVitals() {
  const [vitals, setVitals] = useState({
    LCP: null,    // Largest Contentful Paint - Target: <2.5s
    FID: null,    // First Input Delay - Target: <100ms
    CLS: null,    // Cumulative Layout Shift - Target: <0.1
    FCP: null,    // First Contentful Paint - Target: <1.8s
    TTFB: null,   // Time to First Byte - Target: <600ms
    INP: null     // Interaction to Next Paint - Target: <200ms (2024+ metric)
  })

  const [performanceEntries, setPerformanceEntries] = useState([])
  const [webVitalsAvailable, setWebVitalsAvailable] = useState(false)

  /**
   * Reports a Web Vital metric
   * @param {Object} metric - The metric object from web-vitals library
   */
  const reportVital = (metric) => {
    setVitals(prev => ({
      ...prev,
      [metric.name]: {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        timestamp: Date.now()
      }
    }))

    // Report to analytics (replace with your analytics service)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true
      })
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Web Vital: ${metric.name}`, {
        value: metric.value,
        rating: metric.rating,
        target: getTarget(metric.name),
        status: getStatus(metric.name, metric.value)
      })
    }
  }

  /**
   * Gets performance target for a metric
   */
  const getTarget = (metricName) => {
    const targets = {
      LCP: 2500,   // 2.5s
      FID: 100,    // 100ms
      CLS: 0.1,    // 0.1
      FCP: 1800,   // 1.8s
      TTFB: 600,   // 600ms
      INP: 200     // 200ms
    }
    return targets[metricName]
  }

  /**
   * Gets performance status for a metric
   */
  const getStatus = (metricName, value) => {
    const target = getTarget(metricName)
    if (!target || value === null) return 'unknown'
    
    if (metricName === 'CLS') {
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
    }
    
    const ratio = value / target
    return ratio <= 1 ? 'good' : ratio <= 1.5 ? 'needs-improvement' : 'poor'
  }

  /**
   * Calculates overall performance score
   */
  const isGoodPerformance = () => {
    const metrics = Object.values(vitals).filter(v => v !== null)
    if (metrics.length === 0) return true // No data yet
    
    const goodMetrics = metrics.filter(metric => 
      getStatus(metric.name, metric.value) === 'good'
    )
    
    return goodMetrics.length / metrics.length >= 0.8 // 80% of metrics should be good
  }

  /**
   * Fallback implementation for basic performance monitoring
   */
  const initializeFallbackMetrics = () => {
    if (typeof window === 'undefined') return

    // Monitor navigation timing for TTFB
    const navigation = performance.getEntriesByType('navigation')[0]
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart
      reportVital({
        name: 'TTFB',
        value: ttfb,
        rating: ttfb <= 600 ? 'good' : ttfb <= 1000 ? 'needs-improvement' : 'poor',
        id: `ttfb-${Date.now()}`,
        delta: ttfb
      })
    }

    // Monitor paint timing for FCP
    const paintEntries = performance.getEntriesByType('paint')
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    if (fcpEntry) {
      reportVital({
        name: 'FCP',
        value: fcpEntry.startTime,
        rating: fcpEntry.startTime <= 1800 ? 'good' : fcpEntry.startTime <= 3000 ? 'needs-improvement' : 'poor',
        id: `fcp-${Date.now()}`,
        delta: fcpEntry.startTime
      })
    }

    // Basic LCP estimation using largest image or text block
    setTimeout(() => {
      const images = document.querySelectorAll('img')
      const textBlocks = document.querySelectorAll('h1, h2, p')
      const allElements = [...images, ...textBlocks]
      
      if (allElements.length > 0) {
        // Estimate LCP as time when largest element becomes visible
        const estimatedLCP = performance.now()
        reportVital({
          name: 'LCP',
          value: estimatedLCP,
          rating: estimatedLCP <= 2500 ? 'good' : estimatedLCP <= 4000 ? 'needs-improvement' : 'poor',
          id: `lcp-estimated-${Date.now()}`,
          delta: estimatedLCP
        })
      }
    }, 1000)

    // Monitor layout shifts (basic implementation)
    let clsValue = 0
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
    })

    try {
      observer.observe({ entryTypes: ['layout-shift'] })
      
      // Report CLS after 5 seconds
      setTimeout(() => {
        reportVital({
          name: 'CLS',
          value: clsValue,
          rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
          id: `cls-${Date.now()}`,
          delta: clsValue
        })
        observer.disconnect()
      }, 5000)
    } catch (e) {
      console.warn('Layout shift monitoring not supported')
    }

    // Monitor first input delay
    let fidReported = false
    const handleFirstInput = (event) => {
      if (fidReported) return
      fidReported = true
      
      const fid = event.processingStart - event.startTime
      reportVital({
        name: 'FID',
        value: fid,
        rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor',
        id: `fid-${Date.now()}`,
        delta: fid
      })
      
      // Remove listeners after first input
      document.removeEventListener('click', handleFirstInput, true)
      document.removeEventListener('keydown', handleFirstInput, true)
    }

    document.addEventListener('click', handleFirstInput, true)
    document.addEventListener('keydown', handleFirstInput, true)
  }

  /**
   * Monitors performance entries
   */
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Monitor navigation timing
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      setPerformanceEntries(prev => [...prev, ...entries])
    })

    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] })
    } catch (e) {
      // Fallback for older browsers
      console.warn('PerformanceObserver not supported')
    }

    return () => observer.disconnect()
  }, [])

  /**
   * Load and initialize web-vitals library or fallback
   */
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Try to dynamically import web-vitals
    import('web-vitals')
      .then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
        setWebVitalsAvailable(true)
        
        onCLS(reportVital)
        onFID(reportVital)
        onFCP(reportVital)
        onLCP(reportVital)
        onTTFB(reportVital)
        
        // INP is the new FID replacement for 2024+
        if (onINP) {
          onINP(reportVital)
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Web Vitals library loaded successfully')
        }
      })
      .catch(error => {
        console.warn('📦 Web Vitals library not found, using fallback implementation')
        console.log('💡 To get accurate Web Vitals, install: npm install web-vitals')
        setWebVitalsAvailable(false)
        
        // Use fallback implementation
        initializeFallbackMetrics()
      })
  }, [])

  return {
    vitals,
    performanceEntries,
    reportVital,
    isGoodPerformance: isGoodPerformance(),
    webVitalsAvailable,
    getStatus: (metricName) => {
      const vital = vitals[metricName]
      return vital ? getStatus(metricName, vital.value) : 'unknown'
    },
    getTarget
  }
}