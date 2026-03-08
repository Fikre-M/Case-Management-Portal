import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectDB } from '../../server/config/db.js'
import { User } from '../../server/config/db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

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
export const register = async (event, context, callback) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS(callback)
  }

  if (event.httpMethod !== 'POST') {
    return handleResponse(callback, 405, { error: 'Method not allowed' })
  }

  try {
    await connectDB()
    const { username, email, password } = JSON.parse(event.body)

    // Validate input
    if (!username || !email || !password) {
      return handleResponse(callback, 400, { error: 'All fields are required' })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return handleResponse(callback, 400, { error: 'User already exists' })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    })

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return handleResponse(callback, 201, {
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
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

// Login handler
export const login = async (event, context, callback) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS(callback)
  }

  if (event.httpMethod !== 'POST') {
    return handleResponse(callback, 405, { error: 'Method not allowed' })
  }

  try {
    await connectDB()
    const { email, password } = JSON.parse(event.body)

    if (!email || !password) {
      return handleResponse(callback, 400, { error: 'Email and password are required' })
    }

    // Find user
    const user = await User.findOne({ email })
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
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return handleResponse(callback, 200, {
      message: 'Login successful',
      token,
      user: {
        id: user._id,
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
