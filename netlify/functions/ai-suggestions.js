import jwt from 'jsonwebtoken'

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

// Generate suggestions based on context
function generateSuggestions(context, caseData) {
  const suggestions = []
  
  if (context === 'case') {
    suggestions.push(
      { text: 'Review case timeline', action: 'timeline' },
      { text: 'Check upcoming deadlines', action: 'deadlines' },
      { text: 'Draft status update', action: 'draft' }
    )
    
    if (caseData?.status === 'active') {
      suggestions.push({ text: 'Schedule client meeting', action: 'meeting' })
    }
  } else if (context === 'appointment') {
    suggestions.push(
      { text: 'Send reminder to client', action: 'reminder' },
      { text: 'Prepare meeting agenda', action: 'agenda' },
      { text: 'Review case notes', action: 'notes' }
    )
  } else {
    suggestions.push(
      { text: 'View recent cases', action: 'cases' },
      { text: 'Check appointments', action: 'appointments' },
      { text: 'Review AI usage', action: 'usage' }
    )
  }
  
  return suggestions
}

// Suggestions handler
export const handler = async (event, context, callback) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS(callback)
  }

  if (event.httpMethod !== 'POST') {
    return handleResponse(callback, 405, { error: 'Method not allowed' })
  }

  try {
    const user = verifyToken(event)
    const { context: suggestionContext, caseData } = JSON.parse(event.body || '{}')

    const suggestions = generateSuggestions(suggestionContext, caseData)

    return handleResponse(callback, 200, { suggestions })

  } catch (error) {
    console.error('AI suggestions error:', error)
    if (error.message.includes('Access denied') || error.message.includes('Invalid token')) {
      return handleResponse(callback, 401, { error: error.message })
    }
    return handleResponse(callback, 500, { error: 'Failed to generate suggestions' })
  }
}
