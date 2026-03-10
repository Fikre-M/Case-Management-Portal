// Local AI Service - For development testing only
// Uses direct Gemini API calls instead of Netlify proxy

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
const AI_ENABLED = import.meta.env.VITE_AI_ENABLED !== 'false'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

// Get API key from environment (for local development only)
const GEMINI_API_KEY = import.meta.env.AidFlow_API_KEY || ''

// Rate limiting configuration
const RATE_LIMIT_DELAY = 2000
let lastRequestTime = 0
let requestCount = 0
const MAX_REQUESTS_PER_MINUTE = 20

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('ai_casemanager_current_user')
}

// Check if user is authenticated
function isAuthenticated() {
  const userData = localStorage.getItem('ai_casemanager_current_user')
  if (!userData) {
    console.warn('🔐 No user data found - user not logged in')
    return false
  }
  
  try {
    const parsedUser = JSON.parse(userData)
    const loginTime = parsedUser.loginTime
    const now = Date.now()
    const sessionTimeout = 24 * 60 * 60 * 1000 // 24 hours
    
    if (!loginTime || (now - loginTime) > sessionTimeout) {
      console.warn('🔐 Session expired')
      localStorage.removeItem('ai_casemanager_current_user')
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error parsing user data for auth check:', error)
    return false
  }
}

// Mock responses for fallback
const mockResponses = {
  greeting: [
    "Hello! I'm here to help you with your legal case management needs. What would you like to know?",
    "Hi there! How can I assist you with your cases or appointments today?",
    "Greetings! I'm your AI legal assistant. What can I help you with?",
  ],
  
  default: [
    "That's an interesting question. While I'm designed to help with case management, appointments, and legal documentation, I'd be happy to assist you. Could you provide more details about what you need?",
    "I understand you're looking for assistance. I specialize in case management, appointment scheduling, document drafting, legal research, and client communication. Could you clarify how I can help with your specific need?",
    "I'm here to help! To provide the best assistance, could you tell me more about what type of case you're working on and what specific task you need help with?",
  ],
}

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Get random response from category
function getRandomResponse(category) {
  const responses = mockResponses[category] || mockResponses.default
  return responses[Math.floor(Math.random() * responses.length)]
}

// Rate limiting check
function checkRateLimit() {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest > 60000) {
    requestCount = 0
  }
  
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error('RATE_LIMIT_EXCEEDED')
  }
  
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

// Main function to send message and get response
export async function sendMessage(message, conversationId = null, customSystemPrompt = null) {
  console.log('🤖 AI Service called with message:', message)
  console.log('🔧 Raw environment variables:')
  console.log('  - VITE_AI_ENABLED:', import.meta.env.VITE_AI_ENABLED)
  console.log('  - VITE_USE_MOCK_DATA:', import.meta.env.VITE_USE_MOCK_DATA)
  console.log('  - AidFlow_API_KEY length:', import.meta.env.AidFlow_API_KEY?.length || 0)
  
  console.log('🔧 Processed configuration:')
  console.log('  - AI_ENABLED:', AI_ENABLED)
  console.log('  - USE_MOCK_DATA:', USE_MOCK_DATA)
  console.log('  - API Key available:', !!GEMINI_API_KEY, 'Length:', GEMINI_API_KEY?.length || 0)
  
  // Check if AI is enabled
  if (!AI_ENABLED) {
    console.log('❌ AI is disabled (VITE_AI_ENABLED=false)')
    await delay(500 + Math.random() * 1000)
    return getRandomResponse('default')
  }
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    console.log('❌ User not authenticated')
    return "🔐 Please login to use AI features. Click the login button in the top right to get started with AI assistance."
  }
  
  // Check rate limit
  const waitTime = checkRateLimit()
  if (waitTime > 0) {
    await delay(waitTime)
  }
  
  updateRateLimit()
  
  // If mock data is enabled, return mock responses
  if (USE_MOCK_DATA) {
    console.log('🎭 Using mock responses (USE_MOCK_DATA=true)')
    await delay(500 + Math.random() * 1000)
    return getRandomResponse('default')
  }
  
  console.log('✅ Passed all checks, attempting real AI call')
  
  // Try direct Gemini API call for local development
  if (GEMINI_API_KEY && GEMINI_API_KEY.length > 10) {
    try {
      console.log('🔒 Using direct Gemini API call')
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Gemini API response received:', data)
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          console.log('🤖 Real Gemini AI response received')
          return data.candidates[0].content.parts[0].text
        } else {
          console.warn('Unexpected Gemini response format:', data)
          throw new Error('Invalid response format from Gemini API')
        }
      } else {
        const errorData = await response.json()
        console.error('Gemini API error:', errorData)
        throw new Error(errorData.error?.message || `Gemini API error ${response.status}`)
      }
      
    } catch (error) {
      console.error('Direct Gemini API call failed:', error)
      console.warn('🔄 Falling back to demo responses')
    }
  } else {
    console.warn('⚠️ No valid Gemini API key found in environment')
    console.warn('🔧 Set AidFlow_API_KEY in your .env file')
  }
  
  // Fallback to mock responses
  console.log('🎭 Using demo fallback responses')
  await delay(500 + Math.random() * 1000)
  return getRandomResponse('default')
}

// Get suggested prompts
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
      icon: '📋',
      label: 'Analyze Case',
      prompt: 'Help me analyze my current case and suggest next steps',
    },
    {
      icon: '📅',
      label: 'Schedule Meeting',
      prompt: 'Help me schedule a client meeting',
    },
    {
      icon: '✍️',
      label: 'Draft Document',
      prompt: 'Help me draft a legal document',
    },
    {
      icon: '🔍',
      label: 'Legal Research',
      prompt: 'Help me research relevant case law',
    },
  ]
}

// Check if AI is available
export function isOpenAIAvailable() {
  return AI_ENABLED && isAuthenticated()
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
  
  const hasApiKey = GEMINI_API_KEY && GEMINI_API_KEY.length > 10
  
  return {
    provider: hasApiKey ? 'Direct Gemini API' : 'Mock',
    available: hasApiKey && isAuthenticated(),
    model: hasApiKey ? 'gemini-1.5-flash (direct)' : 'mock-responses',
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

// Conversation management functions (mock for local)
export async function createConversation(title, category = 'general') {
  return {
    id: Date.now(),
    title,
    category,
    messages: [],
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  }
}

export async function getConversations() {
  return []
}

export async function getConversation(id) {
  return null
}

export async function deleteConversation(id) {
  return false
}

export async function getUsageStatistics() {
  return {
    totalRequests: 0,
    totalTokens: 0,
    dailyUsage: []
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
