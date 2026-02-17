# Service Layer Architecture

## Overview

The AidFlow application uses a clean service layer architecture to separate data fetching logic from UI components and state management. This approach provides better maintainability, testability, and makes it easy to switch between mock data and real API endpoints.

## Architecture Benefits

### 1. Separation of Concerns
- **Context Layer**: Manages application state
- **Service Layer**: Handles data fetching and API communication
- **Component Layer**: Focuses on UI rendering

### 2. Easy API Integration
- Switch between mock and real API with a single environment variable
- No code changes needed in components or context
- Consistent interface regardless of data source

### 3. Better Testing
- Services can be mocked independently
- Unit tests don't need to mock network calls
- Integration tests can use real or mock services

### 4. Maintainability
- Centralized API logic
- Single source of truth for data operations
- Easy to update API endpoints or add new features

## Configuration

### Environment Variables

Configure data mode in `.env` file:

```bash
# Use mock data (default)
VITE_USE_MOCK_DATA=true

# Use real API
VITE_USE_MOCK_DATA=false

# API endpoint (used when mock mode is disabled)
VITE_API_BASE_URL=http://localhost:5000/api
```

## Service Layer Structure

### Core API Module (`src/services/api.js`)

The base API module provides:

```javascript
// Main API request handler
apiRequest(endpoint, options)

// Network delay simulation for mock data
simulateNetworkDelay(delay)

// Check if app is in mock mode
isMockMode()
```

**Features:**
- Automatic error handling
- Configurable mock/real API mode
- Network delay simulation for realistic UX
- Consistent error messages

### Service Modules

Each feature has its own service module:

#### Appointment Service (`src/services/appointmentService.js`)

```javascript
import { appointmentService } from '../services/appointmentService'

// Get all appointments
const appointments = await appointmentService.getAll()

// Get single appointment
const appointment = await appointmentService.getById(id)

// Create appointment
const newAppointment = await appointmentService.create(data)

// Update appointment
const updated = await appointmentService.update(id, data)

// Delete appointment
await appointmentService.delete(id)
```

#### Case Service (`src/services/caseService.js`)

```javascript
import { caseService } from '../services/caseService'

// Get all cases
const cases = await caseService.getAll()

// Get single case
const caseItem = await caseService.getById(id)

// Create case
const newCase = await caseService.create(data)

// Update case
const updated = await caseService.update(id, data)

// Delete case
await caseService.delete(id)
```

## How It Works

### Mock Mode (Default)

When `VITE_USE_MOCK_DATA=true` or not set:

1. Service checks `isMockMode()` returns `true`
2. Simulates network delay with `simulateNetworkDelay()`
3. Returns data from mock files (`mockAppointments.js`, `mockCases.js`)
4. Performs operations on in-memory mock data

**Example Flow:**
```javascript
// User calls service
const appointments = await appointmentService.getAll()

// Service checks mode
if (isMockMode()) {
  // Simulate network delay
  await simulateNetworkDelay(500)
  // Return mock data
  return mockAppointments
}
```

### Real API Mode

When `VITE_USE_MOCK_DATA=false`:

1. Service checks `isMockMode()` returns `false`
2. Makes actual HTTP request to backend API
3. Returns real data from server
4. Handles network errors appropriately

**Example Flow:**
```javascript
// User calls service
const appointments = await appointmentService.getAll()

// Service checks mode
if (!isMockMode()) {
  // Make real API call
  return apiRequest('/appointments')
}
```

## Context Integration

### Before (Anti-Pattern)

```javascript
// ❌ Bad: Direct mock data import and setTimeout in context
import mockAppointments from '../services/mockAppointments'

const loadAppointments = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))
  setAppointments(mockAppointments)
}
```

**Problems:**
- Tight coupling to mock data
- Hard to switch to real API
- setTimeout scattered throughout code
- No error handling
- Difficult to test

### After (Service Layer Pattern)

```javascript
// ✅ Good: Use service layer
import { appointmentService } from '../services/appointmentService'

const loadAppointments = async () => {
  try {
    setAppointmentsLoading(true)
    setAppointmentsError(null)
    const data = await appointmentService.getAll()
    setAppointments(data)
  } catch (error) {
    setAppointmentsError(error.message)
  } finally {
    setAppointmentsLoading(false)
  }
}
```

**Benefits:**
- Decoupled from data source
- Automatic mock/real API switching
- Proper error handling
- Easy to test
- Consistent pattern

## Usage in Components

### Loading Data

```javascript
import { useApp } from '../context/AppContext'

function AppointmentList() {
  const { 
    appointments, 
    appointmentsLoading, 
    appointmentsError,
    retryLoadAppointments 
  } = useApp()

  if (appointmentsLoading) return <Loading />
  if (appointmentsError) return <Error onRetry={retryLoadAppointments} />
  
  return <div>{/* Render appointments */}</div>
}
```

### Creating Data

```javascript
import { useApp } from '../context/AppContext'

function CreateAppointment() {
  const { createAppointment } = useApp()

  const handleSubmit = async (formData) => {
    try {
      const newAppointment = await createAppointment(formData)
      // Success handling
    } catch (error) {
      // Error handling
    }
  }

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>
}
```

## Error Handling

### Service Level

Services provide consistent error handling:

```javascript
try {
  const data = await appointmentService.getAll()
  return data
} catch (error) {
  console.error('Failed to load appointments:', error)
  throw new Error(error.message || 'Failed to load appointments')
}
```

### Context Level

Context catches and stores errors:

```javascript
const loadAppointments = async () => {
  try {
    setAppointmentsLoading(true)
    setAppointmentsError(null)
    const data = await appointmentService.getAll()
    setAppointments(data)
  } catch (error) {
    console.error('Failed to load appointments:', error)
    setAppointmentsError(error.message || 'Failed to load appointments')
  } finally {
    setAppointmentsLoading(false)
  }
}
```

### Component Level

Components display errors to users:

```javascript
if (appointmentsError) {
  return (
    <ErrorState 
      message={appointmentsError}
      onRetry={retryLoadAppointments}
    />
  )
}
```

## Testing

### Testing Services

```javascript
import { appointmentService } from '../services/appointmentService'

describe('appointmentService', () => {
  it('should fetch all appointments', async () => {
    const appointments = await appointmentService.getAll()
    expect(appointments).toBeInstanceOf(Array)
  })

  it('should create appointment', async () => {
    const data = { title: 'Test', date: '2024-01-01' }
    const result = await appointmentService.create(data)
    expect(result).toHaveProperty('id')
  })
})
```

### Testing Context

```javascript
import { renderHook, act } from '@testing-library/react'
import { AppProvider, useApp } from '../context/AppContext'

describe('AppContext', () => {
  it('should load appointments on mount', async () => {
    const { result } = renderHook(() => useApp(), {
      wrapper: AppProvider
    })

    await act(async () => {
      // Wait for data to load
    })

    expect(result.current.appointments).toBeInstanceOf(Array)
  })
})
```

## Migration Path to Real API

### Step 1: Set Up Backend

Create a backend API with matching endpoints:
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Step 2: Update Environment

```bash
# .env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://your-api.com/api
```

### Step 3: Test

No code changes needed! The service layer automatically switches to real API mode.

### Step 4: Remove Mock Data (Optional)

Once fully migrated, you can remove mock data files:
- `src/services/mockAppointments.js`
- `src/services/mockCases.js`

## Best Practices

### 1. Always Use Services

```javascript
// ✅ Good
const data = await appointmentService.getAll()

// ❌ Bad
const data = mockAppointments
```

### 2. Handle Errors Properly

```javascript
// ✅ Good
try {
  const data = await appointmentService.getAll()
  setData(data)
} catch (error) {
  setError(error.message)
}

// ❌ Bad
const data = await appointmentService.getAll()
setData(data) // No error handling
```

### 3. Use Loading States

```javascript
// ✅ Good
setLoading(true)
try {
  const data = await appointmentService.getAll()
  setData(data)
} finally {
  setLoading(false)
}

// ❌ Bad
const data = await appointmentService.getAll()
setData(data) // No loading state
```

### 4. Provide Retry Functionality

```javascript
// ✅ Good
const retryLoadAppointments = loadAppointments

// Component can retry on error
<ErrorState onRetry={retryLoadAppointments} />
```

## File Structure

```
src/
├── services/
│   ├── api.js                    # Core API module
│   ├── appointmentService.js     # Appointment operations
│   ├── caseService.js            # Case operations
│   ├── authService.js            # Authentication
│   ├── mockAppointments.js       # Mock appointment data
│   └── mockCases.js              # Mock case data
├── context/
│   ├── AppContext.jsx            # Uses services for data
│   ├── AuthContext.jsx           # Authentication state
│   └── ThemeContext.jsx          # Theme state
└── components/
    └── ...                        # UI components
```

## Summary

The service layer architecture provides:

✅ **Clean separation** between data and UI
✅ **Easy API integration** with environment variables
✅ **Better error handling** at multiple levels
✅ **Improved testability** with mockable services
✅ **Maintainable code** with centralized logic
✅ **Realistic UX** with network delay simulation
✅ **Production ready** architecture pattern

This pattern makes the application more professional, maintainable, and ready for real-world deployment.
