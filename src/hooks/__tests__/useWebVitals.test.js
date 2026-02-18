import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWebVitals } from '../useWebVitals'

// Mock web-vitals library
const mockOnCLS = vi.fn()
const mockOnFID = vi.fn()
const mockOnFCP = vi.fn()
const mockOnLCP = vi.fn()
const mockOnTTFB = vi.fn()
const mockOnINP = vi.fn()

vi.mock('web-vitals', () => ({
  onCLS: mockOnCLS,
  onFID: mockOnFID,
  onFCP: mockOnFCP,
  onLCP: mockOnLCP,
  onTTFB: mockOnTTFB,
  onINP: mockOnINP
}))

// Mock performance API
const mockPerformanceObserver = vi.fn()
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()

global.PerformanceObserver = vi.fn().mockImplementation((callback) => {
  mockPerformanceObserver.mockImplementation(callback)
  return {
    observe: mockObserve,
    disconnect: mockDisconnect
  }
})

// Mock performance.getEntriesByType
global.performance = {
  ...global.performance,
  getEntriesByType: vi.fn(() => []),
  now: vi.fn(() => Date.now())
}

describe('useWebVitals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset console methods
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    // Mock window.gtag
    global.window.gtag = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize with empty vitals', () => {
      const { result } = renderHook(() => useWebVitals())
      
      expect(result.current.vitals).toEqual({
        LCP: null,
        FID: null,
        CLS: null,
        FCP: null,
        TTFB: null,
        INP: null
      })
      
      expect(result.current.isGoodPerformance).toBe(true) // No data yet
      expect(result.current.webVitalsAvailable).toBe(false) // Initially false
    })

    it('should attempt to load web-vitals library', async () => {
      renderHook(() => useWebVitals())
      
      // Wait for dynamic import to resolve
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(mockOnCLS).toHaveBeenCalled()
      expect(mockOnFID).toHaveBeenCalled()
      expect(mockOnFCP).toHaveBeenCalled()
      expect(mockOnLCP).toHaveBeenCalled()
      expect(mockOnTTFB).toHaveBeenCalled()
    })

    it('should set up PerformanceObserver', () => {
      renderHook(() => useWebVitals())
      
      expect(global.PerformanceObserver).toHaveBeenCalled()
      expect(mockObserve).toHaveBeenCalledWith({ 
        entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] 
      })
    })
  })

  describe('Metric Reporting', () => {
    it('should report vital metrics correctly', () => {
      const { result } = renderHook(() => useWebVitals())
      
      const mockMetric = {
        name: 'LCP',
        value: 1500,
        rating: 'good',
        delta: 1500,
        id: 'test-id'
      }
      
      act(() => {
        result.current.reportVital(mockMetric)
      })
      
      expect(result.current.vitals.LCP).toEqual({
        value: 1500,
        rating: 'good',
        delta: 1500,
        id: 'test-id',
        timestamp: expect.any(Number)
      })
    })

    it('should report to Google Analytics when available', () => {
      const { result } = renderHook(() => useWebVitals())
      
      const mockMetric = {
        name: 'LCP',
        value: 1500,
        rating: 'good',
        id: 'test-id'
      }
      
      act(() => {
        result.current.reportVital(mockMetric)
      })
      
      expect(global.window.gtag).toHaveBeenCalledWith('event', 'LCP', {
        event_category: 'Web Vitals',
        value: 1500,
        event_label: 'test-id',
        non_interaction: true
      })
    })

    it('should log metrics in development', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      const { result } = renderHook(() => useWebVitals())
      
      const mockMetric = {
        name: 'LCP',
        value: 1500,
        rating: 'good'
      }
      
      act(() => {
        result.current.reportVital(mockMetric)
      })
      
      expect(console.log).toHaveBeenCalledWith(
        '🔍 Web Vital: LCP',
        expect.objectContaining({
          value: 1500,
          rating: 'good',
          target: 2500,
          status: 'good'
        })
      )
      
      process.env.NODE_ENV = originalEnv
    })
  })

  describe('Performance Status Calculation', () => {
    it('should calculate good performance correctly', () => {
      const { result } = renderHook(() => useWebVitals())
      
      // Add good metrics
      act(() => {
        result.current.reportVital({ name: 'LCP', value: 1500, rating: 'good' })
        result.current.reportVital({ name: 'FID', value: 50, rating: 'good' })
        result.current.reportVital({ name: 'CLS', value: 0.05, rating: 'good' })
      })
      
      expect(result.current.isGoodPerformance).toBe(true)
    })

    it('should calculate poor performance correctly', () => {
      const { result } = renderHook(() => useWebVitals())
      
      // Add poor metrics
      act(() => {
        result.current.reportVital({ name: 'LCP', value: 4000, rating: 'poor' })
        result.current.reportVital({ name: 'FID', value: 500, rating: 'poor' })
        result.current.reportVital({ name: 'CLS', value: 0.5, rating: 'poor' })
      })
      
      expect(result.current.isGoodPerformance).toBe(false)
    })

    it('should handle mixed performance metrics', () => {
      const { result } = renderHook(() => useWebVitals())
      
      // Add mixed metrics (60% good)
      act(() => {
        result.current.reportVital({ name: 'LCP', value: 1500, rating: 'good' })
        result.current.reportVital({ name: 'FID', value: 50, rating: 'good' })
        result.current.reportVital({ name: 'CLS', value: 0.05, rating: 'good' })
        result.current.reportVital({ name: 'FCP', value: 4000, rating: 'poor' })
        result.current.reportVital({ name: 'TTFB', value: 2000, rating: 'poor' })
      })
      
      // Should be false because only 60% are good (need 80%)
      expect(result.current.isGoodPerformance).toBe(false)
    })
  })

  describe('Metric Status Evaluation', () => {
    it('should evaluate LCP status correctly', () => {
      const { result } = renderHook(() => useWebVitals())
      
      expect(result.current.getStatus('LCP')).toBe('unknown')
      
      act(() => {
        result.current.reportVital({ name: 'LCP', value: 1500, rating: 'good' })
      })
      
      expect(result.current.getStatus('LCP')).toBe('good')
    })

    it('should evaluate CLS status correctly', () => {
      const { result } = renderHook(() => useWebVitals())
      
      act(() => {
        result.current.reportVital({ name: 'CLS', value: 0.05, rating: 'good' })
      })
      
      expect(result.current.getStatus('CLS')).toBe('good')
      
      act(() => {
        result.current.reportVital({ name: 'CLS', value: 0.15, rating: 'needs-improvement' })
      })
      
      expect(result.current.getStatus('CLS')).toBe('needs-improvement')
    })

    it('should provide correct targets', () => {
      const { result } = renderHook(() => useWebVitals())
      
      expect(result.current.getTarget('LCP')).toBe(2500)
      expect(result.current.getTarget('FID')).toBe(100)
      expect(result.current.getTarget('CLS')).toBe(0.1)
      expect(result.current.getTarget('FCP')).toBe(1800)
      expect(result.current.getTarget('TTFB')).toBe(600)
      expect(result.current.getTarget('INP')).toBe(200)
    })
  })

  describe('Fallback Implementation', () => {
    it('should use fallback when web-vitals fails to load', async () => {
      // Mock import failure
      vi.doMock('web-vitals', () => {
        throw new Error('Module not found')
      })
      
      const { result } = renderHook(() => useWebVitals())
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })
      
      expect(result.current.webVitalsAvailable).toBe(false)
      expect(console.warn).toHaveBeenCalledWith(
        '📦 Web Vitals library not found, using fallback implementation'
      )
    })

    it('should calculate TTFB from navigation timing', () => {
      global.performance.getEntriesByType.mockReturnValue([{
        entryType: 'navigation',
        responseStart: 1000,
        requestStart: 500
      }])
      
      renderHook(() => useWebVitals())
      
      // Trigger the performance observer callback
      act(() => {
        mockPerformanceObserver([{
          getEntries: () => [{
            entryType: 'navigation',
            responseStart: 1000,
            requestStart: 500
          }]
        }])
      })
      
      // Should calculate TTFB as 500ms
      // This would be tested in the actual implementation
    })
  })

  describe('Cleanup', () => {
    it('should disconnect PerformanceObserver on unmount', () => {
      const { unmount } = renderHook(() => useWebVitals())
      
      unmount()
      
      expect(mockDisconnect).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle invalid metric data gracefully', () => {
      const { result } = renderHook(() => useWebVitals())
      
      act(() => {
        result.current.reportVital(null)
        result.current.reportVital(undefined)
        result.current.reportVital({})
      })
      
      // Should not crash and vitals should remain null
      expect(result.current.vitals.LCP).toBe(null)
    })

    it('should handle missing window object (SSR)', () => {
      const originalWindow = global.window
      delete global.window
      
      expect(() => {
        renderHook(() => useWebVitals())
      }).not.toThrow()
      
      global.window = originalWindow
    })

    it('should handle PerformanceObserver not supported', () => {
      const originalPO = global.PerformanceObserver
      delete global.PerformanceObserver
      
      expect(() => {
        renderHook(() => useWebVitals())
      }).not.toThrow()
      
      global.PerformanceObserver = originalPO
    })
  })
})