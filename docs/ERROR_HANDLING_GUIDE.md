# Error Handling Guide

## Overview

The AidFlow application implements a comprehensive, multi-layered error handling system that catches errors at different levels and provides clear feedback to users. This guide documents the error handling architecture and best practices.

## Error Handling Layers

### 1. Error Boundary (Component Level)

**Location:** `src/components/common/ErrorBoundary.jsx`

Catches JavaScript errors anywhere in the component tree and displays a fallback UI.

**Features:**
- Catches rendering errors, lifecycle errors, and constructor errors
- Displays user-friendly error message
- Provides "Refresh" and "Try Again" options
- Shows detailed error stack in development mode
- Supports custom fallback UI
- Logs errors to console (production-ready for error tracking services)

**Usage:**

```javascript
import ErrorBoundary from './components/common/ErrorBoundary'

// Basic usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom props
<ErrorBoundary
  title="Custom Error Title"
  message="Custom error message"
  onError={(error, errorInfo) => {
    // Custom error handling
    logToService(error, errorInfo)
  }}
  onReset={() => {
    // Custom reset logic
    clearCache()
  }}
>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary
  fallback={({ error, errorInfo, resetError }) => (
    <CustomErrorUI 
      error={error} 
      onReset={resetError} 
    />
  )}
>
  <YourComponent />
</ErrorBoundary>
```

**Props:**
- `children` (required): Components to wrap
- `title`: Custom error title
- `message`: Custom error message
- `fallback`: Custom fallback render function
- `onError`: Callback when error is caught
- `onReset`: Callback when user clicks "Try Again"

### 2. Global Error Context (Application Level)

**Location:** `src/context/ErrorContext.jsx`

Manages application-wide errors and provides utilities for error handling.

**Features:**
- Centralized error state management
- Auto-dismissing error notifications
- Error queuing and display
- Async operation error handling
- Context-aware error messages

**Usage:**

```javascript
import { useError } from '../context/ErrorContext'

function MyComponent() {
  const { addError, handleAsync } = useError()

  // Manual error handling
  const handleAction = () => {
    try {
      // Some operation
    } catch (error) {
      addError(error, {
        context: 'User Action',
        type: 'error',
        duration: 5000
      })
    }
  }

  // Automatic async error handling
  const loadData = async () => {
    await handleAsync(
      async () => {
        const data = await fetchData()
        return data
      },
      {
        context: 'Loading Data',
        rethrow: false // Don't rethrow error
      }
    )
  }

  return <div>...</div>
}
```

**API:**

```javascript
const {
  errors,           // Array of current errors
  addError,         // Add a new error
  removeError,      // Remove specific error
  clearErrors,      // Clear all errors
  handleAsync,      // Handle async operations
} = useError()
```

**addError Options:**
- `type`: 'error' | 'warning' | 'info' | 'success'
- `context`: String describing where error occurred
- `dismissible`: Boolean (default: true)
- `autoClose`: Boolean (default: true)
- `duration`: Number in milliseconds (default: 5000)

### 3. Global Error Display (UI Level)

**Location:** `src/components/common/GlobalErrorDisplay.jsx`

Displays global errors as toast notifications in the top-right corner.

**Features:**
- Animated error notifications
- Auto-dismiss after duration
- Manual dismiss option
- Stacked display for multiple errors
- Context information display

**Automatic Integration:**

The GlobalErrorDisplay is automatically included in App.jsx and will display any errors added via the ErrorContext.

### 4. Error State Component (Feature Level)

**Location:** `src/components/common/ErrorState.jsx`

Displays error states within specific features or sections.

**Usage:**

```javascript
import ErrorState from './components/common/ErrorState'

function DataList() {
  const { data, loading, error, retry } = useData()

  if (loading) return <Loading />
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={retry}
        title="Failed to load data"
        showDetails={process.env.NODE_ENV === 'development'}
      />
    )
  }

  return <div>{/* Render data */}</div>
}
```

**Props:**
- `error`: Error object or string
- `onRetry`: Retry callback function
- `title`: Error title (default: "Something went wrong")
- `showDetails`: Show detailed error info (default: false)
- `className`: Additional CSS classes

### 5. Service Layer Error Handling

**Location:** `src/services/*.js`

All service methods include proper error handling and throw meaningful errors.

**Pattern:**

```javascript
export const myService = {
  getData: async () => {
    try {
      const response = await apiRequest('/data')
      return response
    } catch (error) {
      console.error('Failed to get data:', error)
      throw new Error(error.message || 'Failed to get data')
    }
  }
}
```

### 6. Context Error Handling

**Location:** `src/context/AppContext.jsx`, etc.

Contexts catch errors from services and store them in state for components to display.

**Pattern:**

```javascript
const loadData = async () => {
  try {
    setLoading(true)
    setError(null)
    const data = await service.getData()
    setData(data)
  } catch (error) {
    console.error('Failed to load data:', error)
    setError(error.message || 'Failed to load data')
  } finally {
    setLoading(false)
  }
}
```

## Error Flow Diagram

```
User Action
    ↓
Component
    ↓
Context/Service
    ↓
API Call
    ↓
[Error Occurs]
    ↓
Service catches → Throws meaningful error
    ↓
Context catches → Sets error state
    ↓
Component displays → ErrorState or Alert
    ↓
User sees error → Can retry
```

## Best Practices

### 1. Always Provide Retry Functionality

```javascript
// ✅ Good
if (error) {
  return <ErrorState error={error} onRetry={loadData} />
}

// ❌ Bad
if (error) {
  return <div>Error: {error}</div>
}
```

### 2. Use Appropriate Error Messages

```javascript
// ✅ Good - User-friendly
throw new Error('Failed to save appointment. Please try again.')

// ❌ Bad - Technical jargon
throw new Error('ERR_CONNECTION_REFUSED: ECONNREFUSED')
```

### 3. Log Errors for Debugging

```javascript
// ✅ Good
try {
  await operation()
} catch (error) {
  console.error('Operation failed:', error)
  setError(error.message)
}

// ❌ Bad - Silent failure
try {
  await operation()
} catch (error) {
  setError(error.message)
}
```

### 4. Handle Async Errors Properly

```javascript
// ✅ Good
const handleSubmit = async () => {
  try {
    await saveData()
  } catch (error) {
    addError(error, { context: 'Save Data' })
  }
}

// ❌ Bad - Unhandled promise rejection
const handleSubmit = async () => {
  await saveData() // No error handling
}
```

### 5. Provide Context in Error Messages

```javascript
// ✅ Good
addError(error, {
  context: 'Creating Appointment',
  type: 'error'
})

// ❌ Bad
addError(error)
```

### 6. Use Error Boundaries for Component Errors

```javascript
// ✅ Good
<ErrorBoundary>
  <ComplexComponent />
</ErrorBoundary>

// ❌ Bad - No error boundary
<ComplexComponent />
```

## Error Types

### Network Errors

```javascript
try {
  const data = await apiRequest('/endpoint')
} catch (error) {
  if (error.message.includes('Network')) {
    addError('Network connection failed. Please check your internet.', {
      context: 'Network Error',
      type: 'error'
    })
  }
}
```

### Validation Errors

```javascript
const validateForm = (data) => {
  if (!data.email) {
    addError('Email is required', {
      context: 'Form Validation',
      type: 'warning'
    })
    return false
  }
  return true
}
```

### Permission Errors

```javascript
try {
  await deleteItem(id)
} catch (error) {
  if (error.status === 403) {
    addError('You do not have permission to delete this item', {
      context: 'Permission Error',
      type: 'error'
    })
  }
}
```

### Not Found Errors

```javascript
try {
  const item = await getItem(id)
} catch (error) {
  if (error.status === 404) {
    addError('Item not found', {
      context: 'Data Retrieval',
      type: 'warning'
    })
  }
}
```

## Testing Error Handling

### Testing Error Boundaries

```javascript
import { render } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary'

const ThrowError = () => {
  throw new Error('Test error')
}

test('catches errors and displays fallback', () => {
  const { getByText } = render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )
  
  expect(getByText(/something went wrong/i)).toBeInTheDocument()
})
```

### Testing Error Context

```javascript
import { renderHook, act } from '@testing-library/react'
import { ErrorProvider, useError } from './ErrorContext'

test('adds and removes errors', () => {
  const { result } = renderHook(() => useError(), {
    wrapper: ErrorProvider
  })
  
  act(() => {
    result.current.addError('Test error')
  })
  
  expect(result.current.errors).toHaveLength(1)
  
  act(() => {
    result.current.clearErrors()
  })
  
  expect(result.current.errors).toHaveLength(0)
})
```

### Testing Error States

```javascript
import { render, fireEvent } from '@testing-library/react'
import ErrorState from './ErrorState'

test('displays error and calls retry', () => {
  const onRetry = jest.fn()
  const { getByText } = render(
    <ErrorState 
      error="Test error" 
      onRetry={onRetry} 
    />
  )
  
  expect(getByText('Test error')).toBeInTheDocument()
  
  fireEvent.click(getByText(/try again/i))
  expect(onRetry).toHaveBeenCalled()
})
```

## Production Error Tracking

### Integration with Error Tracking Services

```javascript
// In ErrorBoundary.jsx
componentDidCatch(error, errorInfo) {
  // Send to Sentry
  if (window.Sentry) {
    window.Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    })
  }
  
  // Send to LogRocket
  if (window.LogRocket) {
    window.LogRocket.captureException(error, {
      extra: errorInfo
    })
  }
}
```

### Error Logging Service

```javascript
// src/services/errorLogger.js
export const logError = (error, context) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to your error tracking service
    fetch('/api/errors', {
      method: 'POST',
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      })
    })
  }
}
```

## Accessibility

All error components include proper ARIA attributes:

- `role="alert"` for error messages
- `aria-live="assertive"` for critical errors
- `aria-label` for icon-only elements
- Keyboard navigation support
- Screen reader friendly messages

## Summary

The error handling system provides:

✅ **Multi-layered protection** - Errors caught at every level
✅ **User-friendly messages** - Clear, actionable error messages
✅ **Retry functionality** - Users can recover from errors
✅ **Developer tools** - Detailed error info in development
✅ **Global error management** - Centralized error state
✅ **Animated notifications** - Smooth, non-intrusive error display
✅ **Production ready** - Ready for error tracking integration
✅ **Accessible** - WCAG compliant error handling
✅ **Testable** - Easy to test error scenarios

This comprehensive error handling system ensures users always know what went wrong and how to recover, while providing developers with the information needed to debug issues.
