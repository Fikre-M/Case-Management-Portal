# Backend Integration Guide

## Overview

This guide provides a comprehensive strategy for integrating the AidFlow frontend with a backend API. The application is designed to seamlessly switch between mock data and real API calls.

## Current Architecture

The application already has a complete service layer that supports both mock and real API modes:

```
Frontend Components
        ↓
    Context Layer (State Management)
        ↓
    Service Layer (API Abstraction)
        ↓
    API Module (HTTP Client)
        ↓
    Backend API / Mock Data
```

## Quick Start: Connecting to Backend

### Step 1: Configure Environment

Update `.env` file:

```bash
# Switch to real API mode
VITE_USE_MOCK_DATA=false

# Set your backend URL
VITE_API_BASE_URL=https://your-api.com/api

# Optional: Add authentication token
VITE_API_TOKEN=your-jwt-token
```

### Step 2: That's It!

No code changes needed. The service layer automatically switches to real API mode.

## Backend API Requirements

### Expected Endpoints

#### Appointments

```
GET    /api/appointments           # Get all appointments
GET    /api/appointments/:id       # Get single appointment
POST   /api/appointments           # Create appointment
PUT    /api/appointments/:id       # Update appointment
DELETE /api/appointments/:id       # Delete appointment
```

#### Cases

```
GET    /api/cases                  # Get all cases
GET    /api/cases/:id              # Get single case
POST   /api/cases                  # Create case
PUT    /api/cases/:id              # Update case
DELETE /api/cases/:id              # Delete case
```

#### Authentication

```
POST   /api/auth/login             # User login
POST   /api/auth/register          # User registration
POST   /api/auth/logout            # User logout
GET    /api/auth/me                # Get current user
POST   /api/auth/refresh           # Refresh token
```

### Expected Request/Response Format

#### Appointment Object

```json
{
  "id": 1,
  "title": "Client Meeting",
  "clientName": "John Doe",
  "date": "2024-01-15",
  "time": "10:00",
  "duration": "60",
  "type": "consultation",
  "status": "confirmed",
  "priority": "high",
  "notes": "Discuss case details",
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

#### Case Object

```json
{
  "id": 1,
  "caseNumber": "CASE-2024-001",
  "title": "Immigration Case",
  "clientName": "Jane Smith",
  "type": "immigration",
  "status": "active",
  "priority": "high",
  "assignedTo": "Attorney Name",
  "openedDate": "2024-01-01",
  "lastUpdated": "2024-01-15",
  "description": "Case description",
  "timeline": [
    {
      "date": "2024-01-01",
      "event": "Case opened",
      "type": "info"
    }
  ],
  "documents": [],
  "notes": []
}
```

#### Error Response

```json
{
  "error": {
    "message": "Resource not found",
    "code": "NOT_FOUND",
    "status": 404
  }
}
```

## Authentication Integration

### Update AuthContext for Real API

```javascript
// src/context/AuthContext.jsx

import { authService } from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      
      // Store token
      localStorage.setItem('token', response.token)
      
      // Set user
      setUser(response.user)
      setIsAuthenticated(true)
      
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      localStorage.removeItem('token')
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Create Auth Service

```javascript
// src/services/authService.js

import apiRequest from './api'

export const authService = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    })
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me')
  },

  refreshToken: async () => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
    })
  },
}
```

## Enhanced API Module

### Add Authentication Token

```javascript
// src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false'

/**
 * Get authentication token from storage
 */
function getAuthToken() {
  return localStorage.getItem('token')
}

/**
 * Generic API request handler with authentication
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Add authentication token
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(url, config)
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token')
      window.location.href = '/login'
      throw new Error('Unauthorized')
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API Error: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error)
    throw error
  }
}

export default apiRequest
```

## Using useFetch Hook

### Basic Usage

```javascript
import useFetch from '../hooks/useFetch'
import { appointmentService } from '../services/appointmentService'

function AppointmentList() {
  const { data, loading, error } = useFetch(
    () => appointmentService.getAll(),
    [] // Dependencies
  )

  if (loading) return <Loading />
  if (error) return <ErrorState error={error} />
  
  return (
    <div>
      {data.map(appointment => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  )
}
```

### With Dependencies

```javascript
function AppointmentDetails({ id }) {
  const { data, loading, error } = useFetch(
    () => appointmentService.getById(id),
    [id] // Refetch when id changes
  )

  if (loading) return <Loading />
  if (error) return <ErrorState error={error} />
  
  return <AppointmentView appointment={data} />
}
```

## Enhanced useFetch Hook

```javascript
// src/hooks/useFetch.js

import { useState, useEffect, useCallback } from 'react'

function useFetch(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFunction()
      setData(result)
    } catch (err) {
      setError(err.message || 'An error occurred')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [fetchFunction])

  useEffect(() => {
    fetchData()
  }, dependencies)

  // Return refetch function for manual refresh
  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData 
  }
}

export default useFetch
```

## Pagination Support

### Backend Pagination

```javascript
// src/services/appointmentService.js

export const appointmentService = {
  getAll: async (page = 1, limit = 20) => {
    if (isMockMode()) {
      await simulateNetworkDelay()
      const start = (page - 1) * limit
      const end = start + limit
      return {
        data: mockAppointments.slice(start, end),
        total: mockAppointments.length,
        page,
        limit,
      }
    }
    return apiRequest(`/appointments?page=${page}&limit=${limit}`)
  },
}
```

### Using Pagination

```javascript
function AppointmentList() {
  const [page, setPage] = useState(1)
  const { data, loading, error } = useFetch(
    () => appointmentService.getAll(page, 20),
    [page]
  )

  return (
    <div>
      {data?.data.map(appointment => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
      <Pagination 
        page={page} 
        total={data?.total} 
        onPageChange={setPage} 
      />
    </div>
  )
}
```

## Search and Filtering

### Backend Search

```javascript
export const appointmentService = {
  search: async (query, filters = {}) => {
    if (isMockMode()) {
      await simulateNetworkDelay()
      return mockAppointments.filter(apt => 
        apt.title.toLowerCase().includes(query.toLowerCase()) ||
        apt.clientName.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    const params = new URLSearchParams({
      q: query,
      ...filters,
    })
    
    return apiRequest(`/appointments/search?${params}`)
  },
}
```

## File Upload

### Upload Service

```javascript
// src/services/uploadService.js

export const uploadService = {
  uploadFile: async (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100
          onProgress(percentComplete)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(new Error('Upload failed'))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      const token = localStorage.getItem('token')
      xhr.open('POST', `${API_BASE_URL}/upload`)
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }
      xhr.send(formData)
    })
  },
}
```

## WebSocket Integration

### Real-time Updates

```javascript
// src/services/websocketService.js

class WebSocketService {
  constructor() {
    this.ws = null
    this.listeners = new Map()
  }

  connect(url) {
    this.ws = new WebSocket(url)

    this.ws.onopen = () => {
      console.log('WebSocket connected')
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      const listeners = this.listeners.get(data.type) || []
      listeners.forEach(callback => callback(data.payload))
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      // Reconnect after 5 seconds
      setTimeout(() => this.connect(url), 5000)
    }
  }

  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, [])
    }
    this.listeners.get(eventType).push(callback)

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType)
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
    }
  }
}

export default new WebSocketService()
```

## Error Handling

### Retry Logic

```javascript
// src/utils/retry.js

export async function retryRequest(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
}

// Usage
const data = await retryRequest(
  () => appointmentService.getAll(),
  3,
  1000
)
```

## Caching Strategy

### Simple Cache

```javascript
// src/utils/cache.js

class Cache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map()
    this.ttl = ttl
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    })
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    const age = Date.now() - item.timestamp
    if (age > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  clear() {
    this.cache.clear()
  }
}

export default new Cache()
```

### Using Cache

```javascript
import cache from '../utils/cache'

export const appointmentService = {
  getAll: async () => {
    const cacheKey = 'appointments'
    const cached = cache.get(cacheKey)
    
    if (cached) {
      return cached
    }

    const data = await apiRequest('/appointments')
    cache.set(cacheKey, data)
    return data
  },
}
```

## Testing with Backend

### Mock Server for Development

```javascript
// server/mockServer.js

import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// Mock data
let appointments = [/* mock data */]

// Endpoints
app.get('/api/appointments', (req, res) => {
  res.json(appointments)
})

app.post('/api/appointments', (req, res) => {
  const newAppointment = {
    id: appointments.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
  }
  appointments.push(newAppointment)
  res.status(201).json(newAppointment)
})

app.listen(5000, () => {
  console.log('Mock server running on http://localhost:5000')
})
```

## Deployment Checklist

- [ ] Update `.env` with production API URL
- [ ] Set `VITE_USE_MOCK_DATA=false`
- [ ] Configure authentication tokens
- [ ] Test all API endpoints
- [ ] Set up error tracking
- [ ] Configure CORS on backend
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure caching headers
- [ ] Test error scenarios
- [ ] Monitor API performance

## Summary

The AidFlow frontend is **backend-ready** with:

✅ **Service layer** - Complete API abstraction
✅ **Mock/Real mode** - Easy switching via environment variable
✅ **Authentication** - Token-based auth ready
✅ **Error handling** - Comprehensive error management
✅ **useFetch hook** - Reusable data fetching
✅ **Type safety** - PropTypes validation
✅ **Testing** - Service layer tests included

**To connect to your backend:**
1. Set `VITE_USE_MOCK_DATA=false`
2. Set `VITE_API_BASE_URL=your-api-url`
3. Done! No code changes needed.
