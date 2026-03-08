import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// In-memory storage for fallback
const conversations = []
const usage = []

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

// Verify JWT token
const verifyToken = (event) => {
  const token = event.headers?.authorization?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('Access denied. No token provided.')
  }

  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Mock responses for fallback
function getMockResponse(message) {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
    return "Hello! I'm here to help you with your legal case management needs. What would you like to know?"
  }
  
  if (lowerMessage.match(/\b(case|cases|litigation|lawsuit)\b/)) {
    return "I can help you with case management in several ways: Case Analysis, Document Drafting, Research, Timeline Management, and Client Communication. What specific aspect would you like help with?"
  }
  
  return "I'm here to help! I specialize in case management and analysis, appointment scheduling, document drafting, legal research, and client communication. Could you clarify how I can help with your specific need?"
}

// Chat handler
export const handler = async (event, context, callback) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS(callback)
  }

  if (event.httpMethod !== 'POST') {
    return handleResponse(callback, 405, { error: 'Method not allowed' })
  }

  try {
    const user = verifyToken(event)
    const { message, conversationId } = JSON.parse(event.body)

    if (!message) {
      return handleResponse(callback, 400, { error: 'Message is required' })
    }

    // Track usage
    const today = new Date().toISOString().split('T')[0]
    const existingUsage = usage.find(u => u.userId === user.userId && u.date === today)
    if (existingUsage) {
      existingUsage.requestCount++
      existingUsage.lastRequest = new Date().toISOString()
    } else {
      usage.push({
        userId: user.userId,
        date: today,
        requestCount: 1,
        tokensUsed: 0,
        lastRequest: new Date().toISOString()
      })
    }

    // Get mock response
    const response = getMockResponse(message)

    // Save conversation if conversationId provided
    if (conversationId) {
      const conv = conversations.find(c => c.id === conversationId)
      if (conv) {
        conv.messages.push(
          { type: 'user', content: message, timestamp: new Date().toISOString() },
          { type: 'assistant', content: response, timestamp: new Date().toISOString() }
        )
        conv.lastUpdated = new Date().toISOString()
      }
    }

    return handleResponse(callback, 200, { response })

  } catch (error) {
    console.error('AI chat error:', error)
    if (error.message.includes('Access denied') || error.message.includes('Invalid token')) {
      return handleResponse(callback, 401, { error: error.message })
    }
    return handleResponse(callback, 500, { error: 'Failed to get AI response' })
  }
}
