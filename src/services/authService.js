// Authentication Service - Handles user authentication with secure backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Store auth token in localStorage
export function setAuthToken(token) {
  localStorage.setItem('authToken', token)
}

// Get auth token from localStorage
export function getAuthToken() {
  return localStorage.getItem('authToken')
}

// Remove auth token from localStorage
export function removeAuthToken() {
  localStorage.removeItem('authToken')
}

// Check if user is authenticated
export function isAuthenticated() {
  const token = getAuthToken()
  if (!token) return false
  
  try {
    // Simple JWT token validation (check expiration)
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Date.now() / 1000
    return payload.exp > now
  } catch (error) {
    console.error('Invalid token format:', error)
    removeAuthToken()
    return false
  }
}

// Register new user
export async function register(username, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Registration failed (${response.status})`)
    }

    const data = await response.json()
    
    // Store token
    setAuthToken(data.token)
    
    return {
      success: true,
      user: data.user,
      token: data.token
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Login user
export async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Login failed (${response.status})`)
    }

    const data = await response.json()
    
    // Store token
    setAuthToken(data.token)
    
    return {
      success: true,
      user: data.user,
      token: data.token
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Logout user
export function logout() {
  removeAuthToken()
  return { success: true }
}

// Get current user info from token
export function getCurrentUser() {
  const token = getAuthToken()
  if (!token) return null
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      id: payload.userId,
      username: payload.username
    }
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null
  }
}

export default {
  register,
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  setAuthToken,
  getAuthToken,
  removeAuthToken
}
