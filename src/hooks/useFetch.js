import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Custom hook for data fetching with loading/error states and automatic
 * request cancellation on unmount or dependency change.
 *
 * @param {Function} fetchFunction - Async function that accepts an AbortSignal
 *   and returns data.  Signature: (signal: AbortSignal) => Promise<any>
 * @param {Array}    dependencies  - Re-fetch when these change (like useEffect deps)
 * @returns {{ data, loading, error, refetch }}
 */
function useFetch(fetchFunction, dependencies = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Keep a stable ref to the latest fetchFunction so refetch always uses it
  const fetchRef = useRef(fetchFunction)
  useEffect(() => { fetchRef.current = fetchFunction }, [fetchFunction])

  const fetchData = useCallback((signal) => {
    setLoading(true)
    setError(null)

    fetchRef.current(signal)
      .then(result => {
        if (signal?.aborted) return
        setData(result)
      })
      .catch(err => {
        if (err.name === 'AbortError') return // intentional cancellation — ignore
        setError(err.message || 'An error occurred')
        console.error('Fetch error:', err)
      })
      .finally(() => {
        if (!signal?.aborted) setLoading(false)
      })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchData(controller.signal)
    return () => controller.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  // Manual refetch creates its own controller; previous in-flight request is
  // already gone (component is still mounted, deps haven't changed).
  const refetch = useCallback(() => {
    const controller = new AbortController()
    fetchData(controller.signal)
    // Return abort so callers can cancel a manual refetch if needed
    return () => controller.abort()
  }, [fetchData])

  return { data, loading, error, refetch }
}

export default useFetch
