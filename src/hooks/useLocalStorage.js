import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for managing localStorage with state synchronization
 * 
 * Provides a clean interface for localStorage operations with automatic
 * state synchronization, error handling, and JSON parsing support.
 * 
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if no stored value exists
 * @param {Object} options - Configuration options
 * @param {boolean} options.serialize - Whether to serialize/deserialize as JSON (default: true)
 * @param {boolean} options.syncAcrossTabs - Whether to sync changes across browser tabs (default: true)
 * @param {Function} options.validator - Function to validate stored values
 * @returns {Array} [value, setValue, removeValue] - Current value, setter function, and remove function
 * 
 * @example
 * // Basic usage with JSON serialization
 * const [user, setUser] = useLocalStorage('user', { name: 'John' })
 * 
 * @example
 * // Simple string value
 * const [theme, setTheme] = useLocalStorage('theme', 'light', { serialize: false })
 * 
 * @example
 * // With validation
 * const [age, setAge] = useLocalStorage('age', 18, {
 *   validator: (value) => typeof value === 'number' && value >= 0
 * })
 */
export function useLocalStorage(key, initialValue, options = {}) {
  const {
    serialize = true,
    syncAcrossTabs = true,
    validator = null
  } = options

  // Get initial value from localStorage or use initialValue
  const readValue = useCallback(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue
      }

      const item = window.localStorage.getItem(key)
      if (item === null) {
        return initialValue
      }

      let parsedValue
      if (serialize) {
        parsedValue = JSON.parse(item)
      } else {
        parsedValue = item
      }

      // Validate the parsed value if validator is provided
      if (validator && !validator(parsedValue)) {
        console.warn(`Invalid value found in localStorage for key "${key}", using initial value`)
        return initialValue
      }

      return parsedValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue, serialize, validator])

  const [storedValue, setStoredValue] = useState(readValue)

  // Function to set a new value in localStorage and state
  const setValue = useCallback((value) => {
    try {
      if (typeof window === 'undefined') {
        console.warn('localStorage is not available on the server')
        return
      }

      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Validate the value if validator is provided
      if (validator && !validator(valueToStore)) {
        console.warn(`Invalid value attempted to be stored for key "${key}"`)
        return
      }

      // Save to localStorage
      if (valueToStore === undefined || valueToStore === null) {
        window.localStorage.removeItem(key)
      } else {
        const serializedValue = serialize ? JSON.stringify(valueToStore) : valueToStore
        window.localStorage.setItem(key, serializedValue)
      }

      // Save state
      setStoredValue(valueToStore)
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue, serialize, validator])

  // Function to remove the value from localStorage and reset state
  const removeValue = useCallback(() => {
    try {
      if (typeof window === 'undefined') {
        return
      }

      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Listen for changes to localStorage across tabs
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') {
      return
    }

    const handleStorageChange = (event) => {
      if (event.key === key) {
        try {
          const newValue = readValue()
          setStoredValue(newValue)
        } catch (error) {
          console.warn(`Error handling storage change for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, readValue, syncAcrossTabs])

  return [storedValue, setValue, removeValue]
}

/**
 * Hook for managing localStorage with expiration support
 * 
 * Similar to useLocalStorage but adds automatic expiration of stored values.
 * 
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if no stored value exists
 * @param {number} ttl - Time to live in milliseconds
 * @param {Object} options - Configuration options (same as useLocalStorage)
 * @returns {Array} [value, setValue, removeValue] - Current value, setter function, and remove function
 * 
 * @example
 * // Cache data for 1 hour
 * const [cachedData, setCachedData] = useLocalStorageWithExpiry('api-cache', null, 3600000)
 */
export function useLocalStorageWithExpiry(key, initialValue, ttl, options = {}) {
  const expiryKey = `${key}_expiry`
  
  const readValueWithExpiry = useCallback(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue
      }

      const expiryTime = window.localStorage.getItem(expiryKey)
      if (!expiryTime) {
        return initialValue
      }

      const now = Date.now()
      if (now > parseInt(expiryTime)) {
        // Expired, clean up
        window.localStorage.removeItem(key)
        window.localStorage.removeItem(expiryKey)
        return initialValue
      }

      // Not expired, read the actual value
      const item = window.localStorage.getItem(key)
      if (item === null) {
        return initialValue
      }

      const { serialize = true } = options
      return serialize ? JSON.parse(item) : item
    } catch (error) {
      console.warn(`Error reading localStorage with expiry for key "${key}":`, error)
      return initialValue
    }
  }, [key, expiryKey, initialValue, options])

  const [storedValue, setStoredValue] = useState(readValueWithExpiry)

  const setValueWithExpiry = useCallback((value) => {
    try {
      if (typeof window === 'undefined') {
        return
      }

      const valueToStore = value instanceof Function ? value(storedValue) : value
      const { serialize = true } = options

      // Store the value
      if (valueToStore === undefined || valueToStore === null) {
        window.localStorage.removeItem(key)
        window.localStorage.removeItem(expiryKey)
      } else {
        const serializedValue = serialize ? JSON.stringify(valueToStore) : valueToStore
        window.localStorage.setItem(key, serializedValue)
        
        // Store expiry time
        const expiryTime = Date.now() + ttl
        window.localStorage.setItem(expiryKey, expiryTime.toString())
      }

      setStoredValue(valueToStore)
    } catch (error) {
      console.warn(`Error setting localStorage with expiry for key "${key}":`, error)
    }
  }, [key, expiryKey, storedValue, ttl, options])

  const removeValueWithExpiry = useCallback(() => {
    try {
      if (typeof window === 'undefined') {
        return
      }

      window.localStorage.removeItem(key)
      window.localStorage.removeItem(expiryKey)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage with expiry for key "${key}":`, error)
    }
  }, [key, expiryKey, initialValue])

  // Check for expiry periodically
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const interval = setInterval(() => {
      const currentValue = readValueWithExpiry()
      if (JSON.stringify(currentValue) !== JSON.stringify(storedValue)) {
        setStoredValue(currentValue)
      }
    }, Math.min(ttl / 10, 60000)) // Check at least every minute

    return () => clearInterval(interval)
  }, [readValueWithExpiry, storedValue, ttl])

  return [storedValue, setValueWithExpiry, removeValueWithExpiry]
}

/**
 * Utility function to safely get a value from localStorage
 * 
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @param {boolean} parseAsJSON - Whether to parse as JSON (default: true)
 * @returns {any} The stored value or default value
 */
export function getLocalStorageItem(key, defaultValue = null, parseAsJSON = true) {
  try {
    if (typeof window === 'undefined') {
      return defaultValue
    }

    const item = window.localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }

    return parseAsJSON ? JSON.parse(item) : item
  } catch (error) {
    console.warn(`Error getting localStorage item "${key}":`, error)
    return defaultValue
  }
}

/**
 * Utility function to safely set a value in localStorage
 * 
 * @param {string} key - The localStorage key
 * @param {any} value - The value to store
 * @param {boolean} stringify - Whether to stringify as JSON (default: true)
 * @returns {boolean} True if successful, false otherwise
 */
export function setLocalStorageItem(key, value, stringify = true) {
  try {
    if (typeof window === 'undefined') {
      return false
    }

    const serializedValue = stringify ? JSON.stringify(value) : value
    window.localStorage.setItem(key, serializedValue)
    return true
  } catch (error) {
    console.warn(`Error setting localStorage item "${key}":`, error)
    return false
  }
}

/**
 * Utility function to safely remove a value from localStorage
 * 
 * @param {string} key - The localStorage key
 * @returns {boolean} True if successful, false otherwise
 */
export function removeLocalStorageItem(key) {
  try {
    if (typeof window === 'undefined') {
      return false
    }

    window.localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`Error removing localStorage item "${key}":`, error)
    return false
  }
}

export default useLocalStorage
