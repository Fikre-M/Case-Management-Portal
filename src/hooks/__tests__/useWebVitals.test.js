import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWebVitals } from '../useWebVitals'

// Mock web-vitals — resolved dynamically inside the hook
vi.mock('web-vitals', () => ({
  onCLS: vi.fn(),
  onFID: vi.fn(),
  onFCP: vi.fn(),
  onLCP: vi.fn(),
  onTTFB: vi.fn(),
  onINP: vi.fn(),
}))

// Minimal PerformanceObserver stub — must be a real class so `new` works
const mockDisconnect = vi.fn()
const mockObserve = vi.fn()
class MockPerformanceObserver {
  constructor() {}
  observe(...args) { mockObserve(...args) }
  disconnect() { mockDisconnect() }
}
global.PerformanceObserver = MockPerformanceObserver

global.performance = {
  ...global.performance,
  getEntriesByType: vi.fn(() => []),
  now: vi.fn(() => 100),
}

describe('useWebVitals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('initialises all vitals as null', () => {
      const { result } = renderHook(() => useWebVitals())

      expect(result.current.vitals).toEqual({
        LCP: null,
        FID: null,
        CLS: null,
        FCP: null,
        TTFB: null,
        INP: null,
      })
    })

    it('starts with isGoodPerformance true (no data yet)', () => {
      const { result } = renderHook(() => useWebVitals())
      expect(result.current.isGoodPerformance).toBe(true)
    })

    it('exposes reportVital, getStatus, getTarget functions', () => {
      const { result } = renderHook(() => useWebVitals())
      expect(typeof result.current.reportVital).toBe('function')
      expect(typeof result.current.getStatus).toBe('function')
      expect(typeof result.current.getTarget).toBe('function')
    })
  })

  describe('reportVital', () => {
    it('updates the matching vital entry', () => {
      const { result } = renderHook(() => useWebVitals())

      act(() => {
        result.current.reportVital({ name: 'LCP', value: 1800, rating: 'good', delta: 1800, id: 'lcp-1' })
      })

      expect(result.current.vitals.LCP).toMatchObject({
        value: 1800,
        rating: 'good',
        id: 'lcp-1',
      })
    })

    it('does not affect other vitals when one is reported', () => {
      const { result } = renderHook(() => useWebVitals())

      act(() => {
        result.current.reportVital({ name: 'CLS', value: 0.05, rating: 'good', delta: 0.05, id: 'cls-1' })
      })

      expect(result.current.vitals.LCP).toBe(null)
      expect(result.current.vitals.FID).toBe(null)
      expect(result.current.vitals.CLS).not.toBe(null)
    })

    it('handles null/undefined gracefully without throwing', () => {
      const { result } = renderHook(() => useWebVitals())

      expect(() => {
        act(() => {
          result.current.reportVital(null)
          result.current.reportVital(undefined)
        })
      }).not.toThrow()
    })
  })

  describe('getTarget', () => {
    it('returns correct targets for all core vitals', () => {
      const { result } = renderHook(() => useWebVitals())

      expect(result.current.getTarget('LCP')).toBe(2500)
      expect(result.current.getTarget('FID')).toBe(100)
      expect(result.current.getTarget('CLS')).toBe(0.1)
      expect(result.current.getTarget('FCP')).toBe(1800)
      expect(result.current.getTarget('TTFB')).toBe(600)
      expect(result.current.getTarget('INP')).toBe(200)
    })
  })

  describe('getStatus', () => {
    it('returns "unknown" when vital has no data', () => {
      const { result } = renderHook(() => useWebVitals())
      expect(result.current.getStatus('LCP')).toBe('unknown')
    })

    it('returns the rating from the reported vital', () => {
      const { result } = renderHook(() => useWebVitals())

      act(() => {
        result.current.reportVital({ name: 'LCP', value: 1500, rating: 'good', delta: 1500, id: 'x' })
      })

      expect(result.current.getStatus('LCP')).toBe('good')
    })

    it('reflects needs-improvement rating', () => {
      const { result } = renderHook(() => useWebVitals())

      act(() => {
        result.current.reportVital({ name: 'CLS', value: 0.15, rating: 'needs-improvement', delta: 0.15, id: 'x' })
      })

      expect(result.current.getStatus('CLS')).toBe('needs-improvement')
    })
  })

  describe('isGoodPerformance', () => {
    it('is true when all reported vitals are good', () => {
      const { result } = renderHook(() => useWebVitals())

      act(() => {
        result.current.reportVital({ name: 'LCP', value: 1500, rating: 'good', delta: 1500, id: '1' })
        result.current.reportVital({ name: 'FID', value: 50, rating: 'good', delta: 50, id: '2' })
        result.current.reportVital({ name: 'CLS', value: 0.05, rating: 'good', delta: 0.05, id: '3' })
      })

      expect(result.current.isGoodPerformance).toBe(true)
    })

    it('is false when majority of vitals are poor', () => {
      const { result } = renderHook(() => useWebVitals())

      act(() => {
        result.current.reportVital({ name: 'LCP', value: 5000, rating: 'poor', delta: 5000, id: '1' })
        result.current.reportVital({ name: 'FID', value: 400, rating: 'poor', delta: 400, id: '2' })
        result.current.reportVital({ name: 'CLS', value: 0.4, rating: 'poor', delta: 0.4, id: '3' })
      })

      expect(result.current.isGoodPerformance).toBe(false)
    })
  })

  describe('PerformanceObserver', () => {
    it('sets up observer on mount', () => {
      renderHook(() => useWebVitals())
      expect(mockObserve).toHaveBeenCalledWith(
        expect.objectContaining({ entryTypes: expect.any(Array) })
      )
    })

    it('disconnects observer on unmount', () => {
      const { unmount } = renderHook(() => useWebVitals())
      unmount()
      expect(mockDisconnect).toHaveBeenCalled()
    })
  })
})
