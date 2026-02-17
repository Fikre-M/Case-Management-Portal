# Error Handling Examples

## Practical Examples of Error Handling in AidFlow

This document provides real-world examples of how to implement error handling in different scenarios.

## Example 1: Form Submission with Error Handling

```javascript
import { useState } from 'react'
import { useErrorHandler } from '../hooks/useErrorHandler'
import { appointmentService } from '../services/appointmentService'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

function AppointmentForm() {
  const [formData, setFormData] = useState({ title: '', date: '' })
  const [loading, setLoading] = useState(false)
  const { handleAsyncWithLoading, showSuccess } = useErrorHandler('Appointment Form')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    await handleAsyncWithLoading(
      async () => {
        const result = await appointmentService.create(formData)
        setFormData({ title: '', date: '' }) // Reset form
        return result
      },
      {
        onStart: () => setLoading(true),
        onSuccess: () => showSuccess('Appointment created successfully!'),
        onFinally: () => setLoading(false),
        context: 'Creating Appointment'
      }
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <Input
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />
      <Button type="submit" loading={loading}>
        Create Appointment
      </Button>
    </form>
  )
}
```

## Example 2: Data Loading with Error State

```javascript
import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import ErrorState from '../components/common/ErrorState'
import Loading from '../components/common/Loading'
import AppointmentCard from '../components/appointments/AppointmentCard'

function AppointmentList() {
  const { 
    appointments, 
    appointmentsLoading, 
    appointmentsError,
    retryLoadAppointments 
  } = useApp()

  // Show loading state
  if (appointmentsLoading) {
    return <Loading />
  }

  // Show error state with retry
  if (appointmentsError) {
    return (
      <ErrorState
        error={appointmentsError}
        onRetry={retryLoadAppointments}
        title="Failed to load appointments"
      />
    )
  }

  // Show empty state
  if (appointments.length === 0) {
    return <EmptyState message="No appointments found" />
  }

  // Render data
  return (
    <div className="grid gap-4">
      {appointments.map(appointment => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  )
}
```

## Example 3: Delete Operation with Confirmation

```javascript
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useErrorHandler } from '../hooks/useErrorHandler'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'

function DeleteAppointmentButton({ appointmentId }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { deleteAppointment } = useApp()
  const { handleAsyncWithLoading, showSuccess } = useErrorHandler('Delete Appointment')

  const handleDelete = async () => {
    await handleAsyncWithLoading(
      async () => {
        await deleteAppointment(appointmentId)
        setShowConfirm(false)
      },
      {
        onStart: () => setDeleting(true),
        onSuccess: () => showSuccess('Appointment deleted successfully'),
        onFinally: () => setDeleting(false),
        context: 'Deleting Appointment'
      }
    )
  }

  return (
    <>
      <Button 
        variant="danger" 
        onClick={() => setShowConfirm(true)}
      >
        Delete
      </Button>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete this appointment?</p>
        <div className="flex gap-2 mt-4">
          <Button 
            variant="danger" 
            onClick={handleDelete}
            loading={deleting}
          >
            Delete
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  )
}
```

## Example 4: Multiple Async Operations

```javascript
import { useState } from 'react'
import { useErrorHandler } from '../hooks/useErrorHandler'
import { appointmentService } from '../services/appointmentService'
import { caseService } from '../services/caseService'

function DashboardData() {
  const [data, setData] = useState({ appointments: [], cases: [] })
  const [loading, setLoading] = useState(true)
  const { handleAsync, addError } = useErrorHandler('Dashboard')

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    
    // Load multiple resources in parallel
    const results = await Promise.allSettled([
      handleAsync(() => appointmentService.getAll(), { 
        context: 'Loading Appointments',
        rethrow: false 
      }),
      handleAsync(() => caseService.getAll(), { 
        context: 'Loading Cases',
        rethrow: false 
      })
    ])

    // Process results
    const [appointmentsResult, casesResult] = results
    
    setData({
      appointments: appointmentsResult.status === 'fulfilled' 
        ? appointmentsResult.value 
        : [],
      cases: casesResult.status === 'fulfilled' 
        ? casesResult.value 
        : []
    })

    setLoading(false)

    // Show warning if any failed
    const failedCount = results.filter(r => r.status === 'rejected').length
    if (failedCount > 0) {
      addError(`Failed to load ${failedCount} data source(s)`, {
        type: 'warning',
        context: 'Dashboard Load'
      })
    }
  }

  if (loading) return <Loading />

  return (
    <div>
      <AppointmentSection appointments={data.appointments} />
      <CaseSection cases={data.cases} />
    </div>
  )
}
```

## Example 5: Form Validation Errors

```javascript
import { useState } from 'react'
import { useErrorHandler } from '../hooks/useErrorHandler'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const { showWarning } = useErrorHandler('Login Form')

  const validate = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      showWarning('Please fix the form errors', {
        context: 'Form Validation'
      })
      return
    }

    // Submit form...
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
      />
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
      />
      <Button type="submit">Login</Button>
    </form>
  )
}
```

## Example 6: Network Error Handling

```javascript
import { useEffect, useState } from 'react'
import { useErrorHandler } from '../hooks/useErrorHandler'
import { appointmentService } from '../services/appointmentService'

function AppointmentDetails({ id }) {
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const { handleAsync, addError } = useErrorHandler('Appointment Details')

  useEffect(() => {
    loadAppointment()
  }, [id])

  const loadAppointment = async () => {
    setLoading(true)
    
    const result = await handleAsync(
      async () => {
        const data = await appointmentService.getById(id)
        return data
      },
      {
        context: 'Loading Appointment',
        rethrow: false
      }
    )

    if (result) {
      setAppointment(result)
    } else {
      // Handle specific error cases
      if (!navigator.onLine) {
        addError('You are offline. Please check your internet connection.', {
          type: 'warning',
          context: 'Network Status'
        })
      }
    }

    setLoading(false)
  }

  if (loading) return <Loading />
  if (!appointment) return <ErrorState onRetry={loadAppointment} />

  return <div>{/* Render appointment */}</div>
}
```

## Example 7: Optimistic Updates with Rollback

```javascript
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useErrorHandler } from '../hooks/useErrorHandler'

function AppointmentStatusToggle({ appointment }) {
  const { updateAppointment } = useApp()
  const [localStatus, setLocalStatus] = useState(appointment.status)
  const { addError, showSuccess } = useErrorHandler('Status Update')

  const handleToggle = async () => {
    const previousStatus = localStatus
    const newStatus = localStatus === 'confirmed' ? 'pending' : 'confirmed'
    
    // Optimistic update
    setLocalStatus(newStatus)

    try {
      await updateAppointment(appointment.id, { status: newStatus })
      showSuccess('Status updated successfully')
    } catch (error) {
      // Rollback on error
      setLocalStatus(previousStatus)
      addError(error, {
        context: 'Updating Status',
        type: 'error'
      })
    }
  }

  return (
    <button onClick={handleToggle}>
      Status: {localStatus}
    </button>
  )
}
```

## Example 8: Error Boundary with Custom Fallback

```javascript
import ErrorBoundary from '../components/common/ErrorBoundary'
import Button from '../components/common/Button'

function CustomErrorFallback({ error, resetError }) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">
        Oops! The appointment module crashed
      </h2>
      <p className="text-gray-600 mb-4">
        {error.message}
      </p>
      <div className="space-x-2">
        <Button onClick={resetError}>
          Try Again
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => window.location.href = '/dashboard'}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}

function AppointmentModule() {
  return (
    <ErrorBoundary fallback={CustomErrorFallback}>
      <AppointmentList />
      <AppointmentForm />
    </ErrorBoundary>
  )
}
```

## Example 9: Global Error Notifications

```javascript
import { useEffect } from 'react'
import { useErrorHandler } from '../hooks/useErrorHandler'

function App() {
  const { addError } = useErrorHandler('App')

  useEffect(() => {
    // Handle global unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      addError(event.reason, {
        context: 'Unhandled Promise Rejection',
        type: 'error'
      })
    }

    // Handle global errors
    const handleError = (event) => {
      addError(event.error, {
        context: 'Global Error',
        type: 'error'
      })
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [addError])

  return <div>{/* App content */}</div>
}
```

## Example 10: Retry with Exponential Backoff

```javascript
import { useState } from 'react'
import { useErrorHandler } from '../hooks/useErrorHandler'

function DataFetcher() {
  const [retryCount, setRetryCount] = useState(0)
  const { handleAsync, addError } = useErrorHandler('Data Fetch')

  const fetchWithRetry = async (maxRetries = 3) => {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const data = await fetchData()
        setRetryCount(0) // Reset on success
        return data
      } catch (error) {
        if (i === maxRetries) {
          addError(`Failed after ${maxRetries} attempts`, {
            context: 'Data Fetch',
            type: 'error'
          })
          throw error
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        setRetryCount(i + 1)
      }
    }
  }

  return (
    <div>
      {retryCount > 0 && (
        <div>Retrying... Attempt {retryCount}</div>
      )}
      {/* Component content */}
    </div>
  )
}
```

## Summary

These examples demonstrate:

✅ Form submission with error handling
✅ Data loading with error states
✅ Delete operations with confirmation
✅ Multiple async operations
✅ Form validation errors
✅ Network error handling
✅ Optimistic updates with rollback
✅ Custom error boundaries
✅ Global error notifications
✅ Retry with exponential backoff

Use these patterns as templates for implementing error handling throughout your application.
