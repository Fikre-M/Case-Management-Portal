import jwt from 'jsonwebtoken'
import { connectDB } from '../../server/config/db.js'
import { Conversation, Usage } from '../../server/config/db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Initialize OpenAI client only if we have a real API key
let openai = null
const apiKey = process.env.OPENAI_API_KEY

if (apiKey && apiKey !== 'sk-placeholder-replace-with-actual-key' && apiKey.startsWith('sk-')) {
  import('openai').then(OpenAI => {
    openai = new OpenAI.default({
      apiKey: apiKey,
    })
    console.log('✅ OpenAI client initialized')
  }).catch(error => {
    console.error('❌ Failed to initialize OpenAI:', error.message)
  })
} else {
  console.log('ℹ️ Using mock AI responses (no valid API key)')
}

// Helper function to handle responses
const handleResponse = (callback, statusCode, body) => {
  callback(null, {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
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
  
  if (lowerMessage.match(/\b(appointment|schedule|meeting|calendar)\b/)) {
    return "I can assist with appointment scheduling: Find optimal meeting times, Send appointment reminders, Reschedule conflicts, Prepare meeting agendas, and Draft follow-up emails. What do you need help with?"
  }
  
  if (lowerMessage.match(/\b(draft|write|document|letter|contract)\b/)) {
    return "I can help draft various legal documents: Contracts and agreements, Letters and correspondence, Case briefs and summaries, Client intake forms, and Motion templates. What type of document do you need?"
  }
  
  if (lowerMessage.match(/\b(research|law|statute|precedent|case law)\b/)) {
    return "I can assist with legal research: Case law and precedents, Statutory interpretation, Legal principles and doctrines, Jurisdiction-specific rules, and Recent legal developments. What area of law are you researching?"
  }
  
  return "I'm here to help! I specialize in case management and analysis, appointment scheduling, document drafting, legal research, and client communication. Could you clarify how I can help with your specific need?"
}

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are a helpful AI assistant for a legal case management system. You specialize in:

1. Case Management: Analyzing cases, tracking deadlines, organizing documents
2. Appointment Scheduling: Managing calendars, scheduling meetings, sending reminders  
3. Document Drafting: Creating legal documents, letters, contracts, and correspondence
4. Legal Research: Finding relevant case law, statutes, and legal precedents
5. Client Communication: Drafting professional emails and letters

Provide helpful, professional responses that are relevant to legal practice. Keep responses concise but informative. Always maintain client confidentiality and professional standards.`

// Chat handler
export const chat = async (event, context, callback) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS(callback)
  }

  if (event.httpMethod !== 'POST') {
    return handleResponse(callback, 405, { error: 'Method not allowed' })
  }

  try {
    const user = verifyToken(event)
    await connectDB()
    
    const { message, conversationId } = JSON.parse(event.body)

    if (!message) {
      return handleResponse(callback, 400, { error: 'Message is required' })
    }

    // Track usage
    const today = new Date().toISOString().split('T')[0]
    await Usage.findOneAndUpdate(
      { userId: user.userId, date: today },
      { 
        $inc: { requestCount: 1 },
        $set: { lastRequest: new Date() }
      },
      { upsert: true }
    )

    let response

    // Try OpenAI API if available
    if (openai) {
      try {
        // Prepare messages for OpenAI
        const messages = [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ]

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        })

        response = completion.choices[0]?.message?.content
        
        if (!response) {
          throw new Error('Empty response from AI')
        }

        // Update token usage
        const tokensUsed = completion.usage?.total_tokens || 0
        await Usage.findOneAndUpdate(
          { userId: user.userId, date: today },
          { $inc: { tokensUsed } }
        )

      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError)
        // Fall back to mock responses
        response = getMockResponse(message)
      }
    } else {
      // Use mock responses
      response = getMockResponse(message)
    }

    // Save conversation if conversationId provided
    if (conversationId) {
      await Conversation.findByIdAndUpdate(
        conversationId,
        {
          $push: {
            messages: [
              { type: 'user', content: message },
              { type: 'assistant', content: response }
            ]
          },
          lastUpdated: new Date()
        }
      )
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

// Create conversation handler
export const createConversation = async (event, context, callback) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS(callback)
  }

  if (event.httpMethod !== 'POST') {
    return handleResponse(callback, 405, { error: 'Method not allowed' })
  }

  try {
    const user = verifyToken(event)
    await connectDB()
    
    const { title, category } = JSON.parse(event.body)

    const conversation = new Conversation({
      userId: user.userId,
      title: title || 'New Conversation',
      category: category || 'general'
    })

    await conversation.save()
    return handleResponse(callback, 201, conversation)
  } catch (error) {
    console.error('Create conversation error:', error)
    if (error.message.includes('Access denied') || error.message.includes('Invalid token')) {
      return handleResponse(callback, 401, { error: error.message })
    }
    return handleResponse(callback, 500, { error: 'Failed to create conversation' })
  }
}

// Get conversations handler
export const getConversations = async (event, context, callback) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS(callback)
  }

  if (event.httpMethod !== 'GET') {
    return handleResponse(callback, 405, { error: 'Method not allowed' })
  }

  try {
    const user = verifyToken(event)
    await connectDB()
    
    const conversations = await Conversation.find({ userId: user.userId })
      .sort({ lastUpdated: -1 })
      .select('-__v')

    return handleResponse(callback, 200, conversations)
  } catch (error) {
    console.error('Get conversations error:', error)
    if (error.message.includes('Access denied') || error.message.includes('Invalid token')) {
      return handleResponse(callback, 401, { error: error.message })
    }
    return handleResponse(callback, 500, { error: 'Failed to get conversations' })
  }
}

// Get usage statistics handler
export const getUsage = async (event, context, callback) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS(callback)
  }

  if (event.httpMethod !== 'GET') {
    return handleResponse(callback, 405, { error: 'Method not allowed' })
  }

  try {
    const user = verifyToken(event)
    await connectDB()
    
    const usage = await Usage.find({ userId: user.userId })
      .sort({ date: -1 })
      .limit(30)

    const totalRequests = usage.reduce((sum, u) => sum + u.requestCount, 0)
    const totalTokens = usage.reduce((sum, u) => sum + u.tokensUsed, 0)

    return handleResponse(callback, 200, {
      totalRequests,
      totalTokens,
      dailyUsage: usage
    })
  } catch (error) {
    console.error('Get usage error:', error)
    if (error.message.includes('Access denied') || error.message.includes('Invalid token')) {
      return handleResponse(callback, 401, { error: error.message })
    }
    return handleResponse(callback, 500, { error: 'Failed to get usage statistics' })
  }
}

// Get suggestions handler
export const suggestions = async (event, context, callback) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleCORS(callback)
  }

  if (event.httpMethod !== 'GET') {
    return handleResponse(callback, 405, { error: 'Method not allowed' })
  }

  return handleResponse(callback, 200, [
    "Help me analyze a case",
    "Schedule an appointment",
    "Draft a client letter",
    "Research case precedents",
    "Summarize case documents",
    "Prepare for a meeting"
  ])
}
