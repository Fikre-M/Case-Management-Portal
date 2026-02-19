// AI Service - Integrates with OpenAI API
// Falls back to mock responses if API key is not configured
import OpenAI from 'openai'

// Configuration
const AI_ENABLED = import.meta.env.VITE_AI_ENABLED !== 'false' // Default to true
const apiKey = import.meta.env.VITE_OPENAI_API_KEY
const USE_LOW_COST_MODEL = import.meta.env.VITE_USE_LOW_COST_MODEL === 'true'

// Rate limiting configuration
const RATE_LIMIT_DELAY = 2000 // 2 seconds between requests
let lastRequestTime = 0
let requestCount = 0
const MAX_REQUESTS_PER_MINUTE = 20

// Initialize OpenAI client
let openai = null

// Only initialize if AI is enabled and we have a real API key
if (AI_ENABLED && apiKey && apiKey !== 'sk-placeholder-replace-with-actual-key' && apiKey.startsWith('sk-')) {
  try {
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
    })
    console.info('✅ OpenAI client initialized successfully')
  } catch (error) {
    console.warn('⚠️ Failed to initialize OpenAI client:', error.message)
  }
} else if (!AI_ENABLED) {
  console.info('ℹ️ AI features disabled via VITE_AI_ENABLED')
} else {
  console.info('ℹ️ Using mock AI responses (no API key configured)')
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
  
  // Invalid API key
  if (errorMessage.includes('401') || errorMessage.includes('invalid_api_key')) {
    return {
      type: 'auth_error',
      message: 'Invalid API key. Please check your OpenAI API key configuration.',
      retryAfter: null
    }
  }
  
  // Insufficient quota
  if (errorMessage.includes('insufficient_quota') || errorMessage.includes('quota')) {
    return {
      type: 'quota_error',
      message: 'OpenAI API quota exceeded. Please check your billing or use mock mode.',
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
export async function sendMessage(message, systemPrompt = null) {
  // Check if AI is enabled
  if (!AI_ENABLED) {
    await delay(500 + Math.random() * 1000)
    const category = analyzeInput(message)
    return getRandomResponse(category)
  }
  
  // Try OpenAI API first if available
  if (openai) {
    try {
      // Check rate limit
      const waitTime = checkRateLimit()
      if (waitTime > 0) {
        await delay(waitTime)
      }
      
      // Update rate limit tracking
      updateRateLimit()
      
      const messages = [
        { role: "system", content: systemPrompt || SYSTEM_PROMPT },
        { role: "user", content: message }
      ]

      // Use low-cost model if configured
      const model = USE_LOW_COST_MODEL ? "gpt-3.5-turbo" : "gpt-3.5-turbo"
      
      const completion = await openai.chat.completions.create({
        model: model,
        messages: messages,
        max_tokens: USE_LOW_COST_MODEL ? 300 : 500, // Reduce tokens for cost savings
        temperature: 0.7,
      })
      
      const response = completion.choices[0]?.message?.content
      
      if (!response) {
        throw new Error('Empty response from API')
      }
      
      return response
      
    } catch (error) {
      console.error('OpenAI API error:', error)
      
      // Get user-friendly error message
      const errorInfo = getErrorMessage(error)
      
      // Log error details for debugging
      console.error('Error details:', {
        type: errorInfo.type,
        message: errorInfo.message,
        retryAfter: errorInfo.retryAfter
      })
      
      // For auth and quota errors, throw to show user
      if (errorInfo.type === 'auth_error' || errorInfo.type === 'quota_error') {
        throw new Error(errorInfo.message)
      }
      
      // For other errors, fall back to mock
      console.info('Falling back to mock responses')
    }
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

// Check if OpenAI is available
export function isOpenAIAvailable() {
  return AI_ENABLED && openai !== null
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
  
  return {
    provider: openai ? 'OpenAI' : 'Mock',
    available: openai !== null,
    model: openai ? (USE_LOW_COST_MODEL ? 'gpt-3.5-turbo (cost-optimized)' : 'gpt-3.5-turbo') : 'mock-responses',
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

export default {
  sendMessage,
  getSuggestedPrompts,
  getQuickActions,
  isOpenAIAvailable,
  getServiceStatus,
  getRateLimitStatus,
}