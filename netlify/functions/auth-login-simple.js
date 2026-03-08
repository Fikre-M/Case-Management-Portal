import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// In-memory storage for fallback
const users = []

// Helper function to handle responses
const handleResponse = (callback, statusCode, body) => {
  callback(null, {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

// Handle CORS preflight
const handleCORS = (callback) => {
  handleResponse(callback, 200, {})
}

// Login handler
export const handler = async (event, context, callback) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS(callback)
  }

  if (event.httpMethod !== 'POST') {
    return handleResponse(callback, 405, { error: 'Method not allowed' })
  }

  try {
    const { email, password } = JSON.parse(event.body)

    if (!email || !password) {
      return handleResponse(callback, 400, { error: 'Email and password are required' })
    }

    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      return handleResponse(callback, 401, { error: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return handleResponse(callback, 401, { error: 'Invalid credentials' })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return handleResponse(callback, 200, {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return handleResponse(callback, 500, { error: 'Login failed' })
  }
}
