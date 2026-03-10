// AI Service - Integrates with secure Netlify Functions
// All AI calls are proxied through secure backend functions

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
const AI_ENABLED = import.meta.env.VITE_AI_ENABLED !== 'false' // Default to true

// Rate limiting configuration
const RATE_LIMIT_DELAY = 2000 // 2 seconds between requests
let lastRequestTime = 0
let requestCount = 0
const MAX_REQUESTS_PER_MINUTE = 20

// Get auth token from localStorage (matching AuthContext)
function getAuthToken() {
  return localStorage.getItem('ai_casemanager_current_user')
}

// Check if user is authenticated
function isAuthenticated() {
  const userData = localStorage.getItem('ai_casemanager_current_user')
  if (!userData) {
    console.warn(' No user data found - user not logged in')
    return false
  }
  
  // Check if session is still valid (24 hours)
  try {
    const parsedUser = JSON.parse(userData)
    const loginTime = parsedUser.loginTime
    const now = Date.now()
    const sessionTimeout = 24 * 60 * 60 * 1000 // 24 hours
    
    if (!loginTime || (now - loginTime) > sessionTimeout) {
      console.warn(' Session expired')
      localStorage.removeItem('ai_casemanager_current_user')
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error parsing user data for auth check:', error)
    return false
  }
}

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are a helpful AI assistant for a legal case management system. You specialize in:

1. Case Management: Analyzing cases, tracking deadlines, organizing documents
2. Appointment Scheduling: Managing calendars, scheduling meetings, sending reminders  
3. Document Drafting: Creating legal documents, letters, contracts, and correspondence
4. Legal Research: Finding relevant case law, statutes, and legal precedents
5. Client Communication: Drafting professional emails and letters

Provide helpful, professional responses that are relevant to legal practice. Keep responses concise but informative. Always maintain client confidentiality and professional standards.`

const mockResponses = {
  greeting: [
    "Hello! I'm here to help you with your legal case management needs. What would you like to know?",
    "Hi there! How can I assist you with your cases or appointments today?",
    "Greetings! I'm your AI legal assistant. What can I help you with?",
  ],
  
  caseHelp: [
    "I can help you with case management in several ways:\n\n1. **Case Analysis**: Review case details and provide insights\n2. **Document Drafting**: Help draft legal documents\n3. **Research**: Assist with legal research and precedents\n4. **Timeline Management**: Track important dates and deadlines\n5. **Client Communication**: Draft emails and letters\n\nWhat specific aspect would you like help with?",
    "For case management, I can:\n\n• Analyze case strengths and weaknesses\n• Suggest next steps and strategies\n• Help organize case documents\n• Track deadlines and milestones\n• Draft case summaries\n\nWhich would be most helpful right now?",
  ],
  
  appointmentHelp: [
    "I can assist with appointment scheduling:\n\n• Find optimal meeting times\n• Send appointment reminders\n• Reschedule conflicts\n• Prepare meeting agendas\n• Draft follow-up emails\n\nWhat do you need help with?",
    "For appointments, I can help you:\n\n1. Schedule new appointments\n2. Check availability\n3. Send reminders to clients\n4. Prepare meeting materials\n5. Document meeting notes\n\nHow can I assist?",
  ],
  
  documentDraft: [
    "I can help draft various legal documents:\n\n• Contracts and agreements\n• Letters and correspondence\n• Case briefs and summaries\n• Client intake forms\n• Motion templates\n\nWhat type of document do you need?",
    "I'm ready to help with document drafting. I can create:\n\n✓ Legal correspondence\n✓ Contract templates\n✓ Case summaries\n✓ Client communications\n✓ Court filings\n\nWhat would you like me to draft?",
  ],
  
  research: [
    "I can assist with legal research:\n\n• Case law and precedents\n• Statutory interpretation\n• Legal principles and doctrines\n• Jurisdiction-specific rules\n• Recent legal developments\n\nWhat area of law are you researching?",
    "For legal research, I can help you find:\n\n1. Relevant case law\n2. Statutory provisions\n3. Legal commentary\n4. Practice guides\n5. Recent decisions\n\nWhat's your research question?",
  ],
  
  default: [
    "That's an interesting question. While I'm designed to help with case management, appointments, and legal documentation, I'd be happy to assist you. Could you provide more details about what you need?",
    "I understand you're looking for assistance. I specialize in:\n\n• Case management and analysis\n• Appointment scheduling\n• Document drafting\n• Legal research\n• Client communication\n\nCould you clarify how I can help with your specific need?",
    "I'm here to help! To provide the best assistance, could you tell me more about:\n\n• What type of case you're working on?\n• What specific task you need help with?\n• Any deadlines or priorities?\n\nThis will help me give you more targeted support.",
  ],
}

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Analyze user input and determine response type
function analyzeInput(input) {
  const lowerInput = input.toLowerCase()
  
  if (lowerInput.match(/\b(hi|hello|hey|greetings)\b/)) {
    return 'greeting'
  }
  
  if (lowerInput.match(/\b(case|cases|litigation|lawsuit)\b/)) {
    return 'caseHelp'
  }
  
  if (lowerInput.match(/\b(appointment|schedule|meeting|calendar)\b/)) {
    return 'appointmentHelp'
  }
  
  if (lowerInput.match(/\b(draft|write|document|letter|contract)\b/)) {
    return 'documentDraft'
  }
  
  if (lowerInput.match(/\b(research|law|statute|precedent|case law)\b/)) {
    return 'research'
  }
  
  return 'default'
}

// Get random response from category
function getRandomResponse(category) {
  const responses = mockResponses[category] || mockResponses.default
  return responses[Math.floor(Math.random() * responses.length)]
}

// Rate limiting check
function checkRateLimit() {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  // Reset counter every minute
  if (timeSinceLastRequest > 60000) {
    requestCount = 0
  }
  
  // Check if we've exceeded rate limit
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error('RATE_LIMIT_EXCEEDED')
  }
  
  // Check minimum delay between requests
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    const waitTime = RATE_LIMIT_DELAY - timeSinceLastRequest
    return waitTime
  }
  
  return 0
}

// Update rate limit tracking
function updateRateLimit() {
  lastRequestTime = Date.now()
  requestCount++
}

// Get user-friendly error message
function getErrorMessage(error) {
  const errorMessage = error.message || error.toString()
  
  // Rate limit errors
  if (errorMessage.includes('rate_limit') || errorMessage.includes('429')) {
    return {
      type: 'rate_limit',
      message: 'You\'ve reached the API rate limit. Please wait a moment and try again.',
      retryAfter: 60000 // 1 minute
    }
  }
  
  // Local rate limit
  if (errorMessage.includes('RATE_LIMIT_EXCEEDED')) {
    return {
      type: 'rate_limit',
      message: 'Please slow down. You can send up to 20 messages per minute.',
      retryAfter: 60000
    }
  }
  
  // Auth errors
  if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
    return {
      type: 'auth_error',
      message: 'Please login to use AI features.',
      retryAfter: null
    }
  }
  
  // Insufficient quota
  if (errorMessage.includes('quota') || errorMessage.includes('402')) {
    return {
      type: 'quota_error',
      message: 'AI service quota exceeded. Please try again later.',
      retryAfter: null
    }
  }
  
  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return {
      type: 'network_error',
      message: 'Network error. Please check your internet connection and try again.',
      retryAfter: 5000
    }
  }
  
  // Generic error
  return {
    type: 'generic_error',
    message: 'An error occurred while processing your request. Falling back to demo mode.',
    retryAfter: null
  }
}

// Main function to send message and get response
export async function sendMessage(message, conversationId = null, customSystemPrompt = null) {
  // Check if AI is enabled
  if (!AI_ENABLED) {
    await delay(500 + Math.random() * 1000)
    const category = analyzeInput(message)
    return getRandomResponse(category)
  }
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Return a helpful message instead of throwing error
    return " Please login to use AI features. Click the login button in the top right to get started with AI assistance."
  }
  
  // Check rate limit
  const waitTime = checkRateLimit()
  if (waitTime > 0) {
    await delay(waitTime)
  }
  
  // Update rate limit tracking
  updateRateLimit()
  
  // Try secure Netlify proxy first (primary method)
  try {
    const userData = localStorage.getItem('ai_casemanager_current_user')
    if (!userData) {
      console.log(' No user data found - this should not happen if auth passed')
      throw new Error('No user data found')
    }

    let token
    try {
      const parsedUser = JSON.parse(userData)
      // Create a simple token for backend compatibility
      token = btoa(JSON.stringify({
        userId: parsedUser.id,
        email: parsedUser.email,
        name: parsedUser.name,
        loginTime: parsedUser.loginTime
      }))
    } catch (error) {
      console.error('Error parsing user data for token:', error)
      throw new Error('Failed to create authentication token')
    }
    
    console.log(' Using secure Netlify proxy for AI request')
    const proxyResponse = await fetch(`${API_BASE_URL}/ai/proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        messages: [
          ...(customSystemPrompt ? [{ role: 'system', content: customSystemPrompt }] : []),
          { role: 'user', content: message }
        ],
        model: 'gemini-1.5-flash',
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (proxyResponse.ok) {
      const data = await proxyResponse.json()
      console.log(' Secure proxy response received:', data)
      
      // Check if this is a real AI response or demo fallback
      if (data.choices && data.choices[0]?.message?.content) {
        console.log(' Real AI response received')
        return data.choices[0].message.content
      } else if (data.error) {
        console.error('AI service error:', data.error)
        throw new Error(data.error)
      } else {
        console.warn('Unexpected response format:', data)
        throw new Error('Invalid response format from AI service')
      }
    }

    // If proxy fails, log error and fall back to mock
    const errorData = await proxyResponse.json().catch(() => ({}))
    console.error('Proxy error:', errorData)
    throw new Error(errorData.error || `Proxy error ${proxyResponse.status}`)
    
  } catch (error) {
    console.error('Secure proxy failed:', error)
    
    // Get user-friendly error message
    const errorInfo = getErrorMessage(error)
    
    // Log error details for debugging
    console.error('Error details:', {
      type: errorInfo.type,
      message: errorInfo.message,
      retryAfter: errorInfo.retryAfter
    })
    
    // For auth errors, return helpful message instead of throwing
    if (errorInfo.type === 'auth_error') {
      return errorInfo.message
    }
    
    // For network or other errors, try to continue with demo but log clearly
    console.warn(' Falling back to demo responses due to proxy failure')
    console.warn(' This is a DEMO response - real AI service is unavailable')
    console.warn(' To fix: Check AidFlow_API_KEY in Netlify environment variables')
  }
  
  // Fallback to mock responses
  await delay(500 + Math.random() * 1000)
  const category = analyzeInput(message)
  return getRandomResponse(category)
}

// Get suggested prompts for initial screen
export function getSuggestedPrompts() {
  return [
    "Help me analyze a case",
    "Schedule an appointment",
    "Draft a client letter",
    "Research case precedents",
    "Summarize case documents",
    "Prepare for a meeting",
  ]
}

// Get quick actions
export function getQuickActions() {
  return [
    {
      icon: '',
      label: 'Analyze Case',
      prompt: 'Help me analyze my current case and suggest next steps',
    },
    {
      icon: '',
      label: 'Schedule Meeting',
      prompt: 'Help me schedule a client meeting',
    },
    {
      icon: '',
      label: 'Draft Document',
      prompt: 'Help me draft a legal document',
    },
    {
      icon: '',
      label: 'Legal Research',
      prompt: 'Help me research relevant case law',
    },
  ]
}

// Check if AI is available
export function isOpenAIAvailable() {
  const token = getAuthToken()
  return AI_ENABLED && token !== null
}

// Get AI service status
export function getServiceStatus() {
  if (!AI_ENABLED) {
    return {
      provider: 'Disabled',
      available: false,
      model: 'AI features disabled',
      enabled: false
    }
  }
  
  const token = getAuthToken()
  
  return {
    provider: token ? 'Secure Backend' : 'Mock',
    available: token !== null,
    model: token ? 'gemini-1.5-flash (secure backend)' : 'mock-responses',
    enabled: true
  }
}

// Get rate limit status
export function getRateLimitStatus() {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  return {
    requestCount,
    maxRequests: MAX_REQUESTS_PER_MINUTE,
    remaining: Math.max(0, MAX_REQUESTS_PER_MINUTE - requestCount),
    resetIn: timeSinceLastRequest > 60000 ? 0 : 60000 - timeSinceLastRequest
  }
}

// Conversation management functions
export async function createConversation(title, category = 'general') {
  try {
    const token = getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/ai/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, category })
    })

    if (!response.ok) {
      throw new Error('Failed to create conversation')
    }

    return await response.json()
  } catch (error) {
    console.error('Create conversation error:', error)
    // Return mock conversation for fallback
    return {
      id: Date.now(),
      title,
      category,
      messages: [],
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
  }
}

export async function getConversations() {
  try {
    const token = getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/ai/conversations`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to get conversations')
    }

    return await response.json()
  } catch (error) {
    console.error('Get conversations error:', error)
    return []
  }
}

export async function getConversation(id) {
  try {
    const token = getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/ai/conversations/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to get conversation')
    }

    return await response.json()
  } catch (error) {
    console.error('Get conversation error:', error)
    return null
  }
}

export async function deleteConversation(id) {
  try {
    const token = getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/ai/conversations/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to delete conversation')
    }

    return true
  } catch (error) {
    console.error('Delete conversation error:', error)
    return false
  }
}

export async function getUsageStatistics() {
  try {
    const token = getAuthToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/ai/usage`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to get usage statistics')
    }

    return await response.json()
  } catch (error) {
    console.error('Get usage error:', error)
    return {
      totalRequests: 0,
      totalTokens: 0,
      dailyUsage: []
    }
  }
}

export default {
  sendMessage,
  getSuggestedPrompts,
  getQuickActions,
  isOpenAIAvailable,
  getServiceStatus,
  getRateLimitStatus,
  createConversation,
  getConversations,
  getConversation,
  deleteConversation,
  getUsageStatistics
}