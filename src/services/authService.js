// Authentication Service - Handles user authentication with secure backend

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

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

// Decode a JWT payload segment (base64url → JSON) without verifying signature.
// Verification is done server-side; this is only used for reading exp/userId client-side.
function decodePayload(token) {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const padded = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - part.length % 4) % 4)
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

// Check if user is authenticated
export function isAuthenticated() {
  const token = getAuthToken()
  if (!token) return false
  
  try {
    const payload = decodePayload(token)
    if (!payload) { removeAuthToken(); return false }
    return payload.exp > Date.now() / 1000
  } catch (error) {
    console.error('Invalid token format:', error)
    removeAuthToken()
    return false
  }
}

// Register new user
export async function register(username, email, password, signal) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      signal,
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
    if (error.name === 'AbortError') return { success: false, error: 'Request cancelled' }
    console.error('Registration error:', error)
    return { success: false, error: error.message }
  }
}

export async function login(email, password, signal) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal,
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
    if (error.name === 'AbortError') return { success: false, error: 'Request cancelled' }
    console.error('Login error:', error)
    return { success: false, error: error.message }
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
    const payload = decodePayload(token)
    if (!payload) return null
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
