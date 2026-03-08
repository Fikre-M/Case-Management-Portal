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

// Register handler
export const handler = async (event, context, callback) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS(callback)
  }

  if (event.httpMethod !== 'POST') {
    return handleResponse(callback, 405, { error: 'Method not allowed' })
  }

  try {
    const { username, email, password } = JSON.parse(event.body)

    // Validate input
    if (!username || !email || !password) {
      return handleResponse(callback, 400, { error: 'All fields are required' })
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return handleResponse(callback, 400, { error: 'User already exists' })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = { 
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    }
    
    users.push(user)

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return handleResponse(callback, 201, {
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return handleResponse(callback, 500, { error: 'Registration failed' })
  }
}
