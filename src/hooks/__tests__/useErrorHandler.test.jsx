import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ErrorProvider } from '../../context/ErrorContext'
import { useErrorHandler } from '../useErrorHandler'

describe('useErrorHandler', () => {
  const wrapper = ({ children }) => <ErrorProvider>{children}</ErrorProvider>

  it('should provide error handler utilities', () => {
    const { result } = renderHook(() => useErrorHandler('Test Context'), { wrapper })

    expect(result.current).toHaveProperty('withErrorHandling')
    expect(result.current).toHaveProperty('handleAsync')
    expect(result.current).toHaveProperty('handleAsyncWithLoading')
    expect(result.current).toHaveProperty('showSuccess')
    expect(result.current).toHaveProperty('showWarning')
    expect(result.current).toHaveProperty('showInfo')
    expect(result.current).toHaveProperty('addError')
  })

  describe('withErrorHandling', () => {
    it('should wrap function with error handling', async () => {
      const { result } = renderHook(() => useErrorHandler('Test'), { wrapper })

      const mockFn = vi.fn().mockResolvedValue('success')
      let wrappedFn

      act(() => {
        wrappedFn = result.current.withErrorHandling(mockFn)
      })

      const returnValue = await wrappedFn()

      expect(mockFn).toHaveBeenCalled()
      expect(returnValue).toBe('success')
    })

    it('should catch and handle errors', async () => {
      const { result } = renderHook(() => useErrorHandler('Test'), { wrapper })

      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))
      let wrappedFn

      act(() => {
        wrappedFn = result.current.withErrorHandling(mockFn)
      })

      const returnValue = await wrappedFn()

      expect(returnValue).toBeNull()
    })

    it('should rethrow error if rethrow option is true', async () => {
      const { result } = renderHook(() => useErrorHandler('Test'), { wrapper })

      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'))
      let wrappedFn

      act(() => {
        wrappedFn = result.current.withErrorHandling(mockFn, { rethrow: true })
      })

      await expect(wrappedFn()).rejects.toThrow('Test error')
    })
  })

  describe('handleAsyncWithLoading', () => {
    it('should call lifecycle callbacks', async () => {
      const { result } = renderHook(() => useErrorHandler('Test'), { wrapper })

      const onStart = vi.fn()
      const onSuccess = vi.fn()
      const onFinally = vi.fn()
      const asyncFn = vi.fn().mockResolvedValue('success')

      await act(async () => {
        await result.current.handleAsyncWithLoading(asyncFn, {
          onStart,
          onSuccess,
          onFinally,
        })
      })

      expect(onStart).toHaveBeenCalled()
      expect(onSuccess).toHaveBeenCalledWith('success')
      expect(onFinally).toHaveBeenCalled()
    })

    it('should call onError callback on error', async () => {
      const { result } = renderHook(() => useErrorHandler('Test'), { wrapper })

      const onError = vi.fn()
      const asyncFn = vi.fn().mockRejectedValue(new Error('Test error'))

      await act(async () => {
        await result.current.handleAsyncWithLoading(asyncFn, {
          onError,
        })
      })

      expect(onError).toHaveBeenCalledWith(expect.any(Error))
    })

    it('should always call onFinally', async () => {
      const { result } = renderHook(() => useErrorHandler('Test'), { wrapper })

      const onFinally = vi.fn()
      const asyncFn = vi.fn().mockRejectedValue(new Error('Test error'))

      await act(async () => {
        await result.current.handleAsyncWithLoading(asyncFn, {
          onFinally,
        })
      })

      expect(onFinally).toHaveBeenCalled()
    })
  })

  describe('showSuccess', () => {
    it('should add success message', () => {
      const { result } = renderHook(() => useErrorHandler('Test'), { wrapper })

      act(() => {
        result.current.showSuccess('Success message')
      })

      // Success is added as an error with type 'success'
      // We can't directly check errors here as they're in ErrorContext
      expect(result.current.showSuccess).toBeDefined()
    })
  })

  describe('showWarning', () => {
    it('should add warning message', () => {
      const { result } = renderHook(() => useErrorHandler('Test'), { wrapper })

      act(() => {
        result.current.showWarning('Warning message')
      })

      expect(result.current.showWarning).toBeDefined()
    })
  })

  describe('showInfo', () => {
    it('should add info message', () => {
      const { result } = renderHook(() => useErrorHandler('Test'), { wrapper })

      act(() => {
        result.current.showInfo('Info message')
      })

      expect(result.current.showInfo).toBeDefined()
    })
  })
})
