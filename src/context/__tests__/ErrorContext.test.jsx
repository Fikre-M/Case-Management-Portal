import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { ErrorProvider, useError } from '../ErrorContext'

describe('ErrorContext', () => {
  const wrapper = ({ children }) => <ErrorProvider>{children}</ErrorProvider>

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should provide error context', () => {
    const { result } = renderHook(() => useError(), { wrapper })

    expect(result.current).toHaveProperty('errors')
    expect(result.current).toHaveProperty('addError')
    expect(result.current).toHaveProperty('removeError')
    expect(result.current).toHaveProperty('clearErrors')
    expect(result.current).toHaveProperty('handleAsync')
  })

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      renderHook(() => useError())
    }).toThrow('useError must be used within an ErrorProvider')
    
    spy.mockRestore()
  })

  describe('addError', () => {
    it('should add error to state', () => {
      const { result } = renderHook(() => useError(), { wrapper })

      act(() => {
        result.current.addError('Test error')
      })

      expect(result.current.errors).toHaveLength(1)
      expect(result.current.errors[0].message).toBe('Test error')
    })

    it('should add error with options', () => {
      const { result } = renderHook(() => useError(), { wrapper })

      act(() => {
        result.current.addError('Test error', {
          type: 'warning',
          context: 'Test Context',
          dismissible: false,
        })
      })

      const error = result.current.errors[0]
      expect(error.type).toBe('warning')
      expect(error.context).toBe('Test Context')
      expect(error.dismissible).toBe(false)
    })

    it('should auto-remove error after duration', async () => {
      const { result } = renderHook(() => useError(), { wrapper })

      act(() => {
        result.current.addError('Test error', { duration: 1000 })
      })

      expect(result.current.errors).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(result.current.errors).toHaveLength(0)
      })
    })

    it('should handle Error objects', () => {
      const { result } = renderHook(() => useError(), { wrapper })

      act(() => {
        result.current.addError(new Error('Test error'))
      })

      expect(result.current.errors[0].message).toBe('Test error')
    })
  })

  describe('removeError', () => {
    it('should remove specific error', () => {
      const { result } = renderHook(() => useError(), { wrapper })

      let errorId
      act(() => {
        errorId = result.current.addError('Test error')
      })

      expect(result.current.errors).toHaveLength(1)

      act(() => {
        result.current.removeError(errorId)
      })

      expect(result.current.errors).toHaveLength(0)
    })
  })

  describe('clearErrors', () => {
    it('should clear all errors', () => {
      const { result } = renderHook(() => useError(), { wrapper })

      act(() => {
        result.current.addError('Error 1')
        result.current.addError('Error 2')
        result.current.addError('Error 3')
      })

      expect(result.current.errors).toHaveLength(3)

      act(() => {
        result.current.clearErrors()
      })

      expect(result.current.errors).toHaveLength(0)
    })
  })

  describe('handleAsync', () => {
    it('should handle successful async operation', async () => {
      const { result } = renderHook(() => useError(), { wrapper })

      const asyncFn = vi.fn().mockResolvedValue('success')

      let returnValue
      await act(async () => {
        returnValue = await result.current.handleAsync(asyncFn)
      })

      expect(asyncFn).toHaveBeenCalled()
      expect(returnValue).toBe('success')
      expect(result.current.errors).toHaveLength(0)
    })

    it('should handle async errors', async () => {
      const { result } = renderHook(() => useError(), { wrapper })

      const asyncFn = vi.fn().mockRejectedValue(new Error('Async error'))

      await act(async () => {
        await result.current.handleAsync(asyncFn, { context: 'Test' })
      })

      expect(result.current.errors).toHaveLength(1)
      expect(result.current.errors[0].message).toBe('Async error')
      expect(result.current.errors[0].context).toBe('Test')
    })

    it('should rethrow error if rethrow option is true', async () => {
      const { result } = renderHook(() => useError(), { wrapper })

      const asyncFn = vi.fn().mockRejectedValue(new Error('Async error'))

      await expect(
        act(async () => {
          await result.current.handleAsync(asyncFn, { rethrow: true })
        })
      ).rejects.toThrow('Async error')
    })
  })
})
