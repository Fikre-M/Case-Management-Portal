// Universal AI Service - Works in both local and Netlify environments
// Automatically detects environment and uses appropriate method

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
const AI_ENABLED = import.meta.env.VITE_AI_ENABLED !== 'false'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

// API Keys - Try multiple sources
const LOCAL_API_KEY = import.meta.env.VITE_AidFlow_API_KEY || import.meta.env.AidFlow_API_KEY || ''
const IS_NETLIFY = import.meta.env.MODE === 'production' || window.location.hostname.includes('netlify.app')

// Rate limiting
const RATE_LIMIT_DELAY = 2000
let lastRequestTime = 0
let requestCount = 0
const MAX_REQUESTS_PER_MINUTE = 20

// Authentication
function isAuthenticated() {
  const userData = localStorage.getItem('ai_casemanager_current_user')
  if (!userData) {
    console.warn('🔐 No user data found')
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
    console.error('Error parsing user data:', error)
    return false
  }
}

// Mock responses
const mockResponses = {
  greeting: [
    "Hello! I'm here to help you with your legal case management needs.",
    "Hi there! How can I assist you with your cases today?",
    "Greetings! I'm your AI legal assistant. What can I help you with?",
  ],
  default: [
    "That's an interesting question. I'm here to help with case management, appointments, and legal documentation. Could you provide more details?",
    "I understand you're looking for assistance. I specialize in case management, appointment scheduling, document drafting, and legal research.",
    "I'm here to help! Tell me more about what you need assistance with.",
  ],
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const getRandomResponse = (category) => {
  const responses = mockResponses[category] || mockResponses.default
  return responses[Math.floor(Math.random() * responses.length)]
}

// Rate limiting
function checkRateLimit() {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest > 60000) {
    requestCount = 0
    lastRequestTime = now
  }
  
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error('RATE_LIMIT_EXCEEDED')
  }
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    return RATE_LIMIT_DELAY - timeSinceLastRequest
  }
  
  return 0
}

function updateRateLimit() {
  lastRequestTime = Date.now()
  requestCount++
}

// Direct Gemini API call (for local development)
async function callDirectGeminiAPI(message) {
  if (!LOCAL_API_KEY || LOCAL_API_KEY.length < 10) {
    throw new Error('No valid API key available')
  }
  
  console.log('🔒 Using direct Gemini API call')
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${LOCAL_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: message }] }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error?.message || `Gemini API error ${response.status}`)
  }

  const data = await response.json()
  
  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    console.log('🤖 Real Gemini AI response received')
    return data.candidates[0].content.parts[0].text
  }
  
  throw new Error('Invalid response format from Gemini API')
}

// Netlify proxy call (for production)
async function callNetlifyProxy(message) {
  const userData = localStorage.getItem('ai_casemanager_current_user')
  if (!userData) {
    throw new Error('No user data found')
  }

  const parsedUser = JSON.parse(userData)
  const token = btoa(JSON.stringify({
    userId: parsedUser.id,
    email: parsedUser.email,
    name: parsedUser.name,
    loginTime: parsedUser.loginTime
  }))
  
  console.log('🔒 Using Netlify proxy for AI request')
  
  const proxyResponse = await fetch(`${API_BASE_URL}/ai/proxy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: message }],
      model: 'gemini-1.5-flash',
      max_tokens: 1000,
      temperature: 0.7
    })
  })

  if (!proxyResponse.ok) {
    const errorData = await proxyResponse.json().catch(() => ({}))
    throw new Error(errorData.error || `Proxy error ${proxyResponse.status}`)
  }

  const data = await proxyResponse.json()
  
  if (data.choices?.[0]?.message?.content) {
    console.log('🤖 Real AI response received via Netlify proxy')
    return data.choices[0].message.content
  }
  
  throw new Error('Invalid response format from Netlify proxy')
}

// Main AI function
export async function sendMessage(message, conversationId = null, customSystemPrompt = null) {
  console.log('🤖 AI Service called with:', message)
  
  // Check if AI is enabled
  if (!AI_ENABLED) {
    console.log('❌ AI is disabled')
    await delay(500 + Math.random() * 1000)
    return getRandomResponse('default')
  }
  
  // Check authentication
  if (!isAuthenticated()) {
    console.log('❌ User not authenticated')
    return "🔐 Please login to use AI features. Click the login button in the top right to get started."
  }
  
  // Check rate limit
  const waitTime = checkRateLimit()
  if (waitTime > 0) {
    await delay(waitTime)
  }
  updateRateLimit()
  
  // Force mock data if explicitly enabled
  if (USE_MOCK_DATA) {
    console.log('🎭 Using mock responses (USE_MOCK_DATA=true)')
    await delay(500 + Math.random() * 1000)
    return getRandomResponse('default')
  }
  
  console.log('✅ Attempting real AI response')
  
  try {
    // Try local API first (development)
    if (!IS_NETLIFY && LOCAL_API_KEY) {
      return await callDirectGeminiAPI(message)
    }
    
    // Try Netlify proxy (production)
    if (IS_NETLIFY) {
      return await callNetlifyProxy(message)
    }
    
    // Fallback for local development without API key
    if (!IS_NETLIFY && !LOCAL_API_KEY) {
      console.warn('⚠️ No API key available for local development')
      console.warn('🔧 Set VITE_AidFlow_API_KEY in your .env file')
      throw new Error('No API key available')
    }
    
  } catch (error) {
    console.error('❌ AI service failed:', error)
    console.warn('🔄 Falling back to demo responses')
  }
  
  // Final fallback
  console.log('🎭 Using demo fallback responses')
  await delay(500 + Math.random() * 1000)
  return getRandomResponse('default')
}

// Export other functions
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

export function getQuickActions() {
  return [
    { icon: '📋', label: 'Analyze Case', prompt: 'Help me analyze my current case' },
    { icon: '📅', label: 'Schedule Meeting', prompt: 'Help me schedule a client meeting' },
    { icon: '✍️', label: 'Draft Document', prompt: 'Help me draft a legal document' },
    { icon: '🔍', label: 'Legal Research', prompt: 'Help me research relevant case law' },
  ]
}

export function isOpenAIAvailable() {
  return AI_ENABLED && isAuthenticated()
}

export function getServiceStatus() {
  if (!AI_ENABLED) {
    return { provider: 'Disabled', available: false, model: 'AI disabled', enabled: false }
  }
  
  let provider = 'Mock'
  let available = false
  let model = 'mock-responses'
  
  if (IS_NETLIFY) {
    provider = 'Netlify Proxy'
    available = isAuthenticated()
    model = 'gemini-1.5-flash (proxy)'
  } else if (LOCAL_API_KEY) {
    provider = 'Direct Gemini API'
    available = isAuthenticated()
    model = 'gemini-1.5-flash (direct)'
  }
  
  return { provider, available, model, enabled: true }
}

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

// Mock conversation functions
export async function createConversation(title, category = 'general') {
  return { id: Date.now(), title, category, messages: [], createdAt: new Date().toISOString(), lastUpdated: new Date().toISOString() }
}

export async function getConversations() { return [] }
export async function getConversation(id) { return null }
export async function deleteConversation(id) { return false }
export async function getUsageStatistics() { return { totalRequests: 0, totalTokens: 0, dailyUsage: [] } }

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
