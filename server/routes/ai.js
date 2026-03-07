import express from 'express'
import { verifyToken } from './auth.js'
import { Conversation, Usage } from '../config/db.js'

const router = express.Router()

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

// Send message to AI
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { message, conversationId } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Track usage
    const today = new Date().toISOString().split('T')[0]
    await Usage.findOneAndUpdate(
      { userId: req.user.userId, date: today },
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
          { userId: req.user.userId, date: today },
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

    res.json({ response })

  } catch (error) {
    console.error('AI chat error:', error)
    res.status(500).json({ error: 'Failed to get AI response' })
  }
})

// Create new conversation
router.post('/conversations', verifyToken, async (req, res) => {
  try {
    const { title, category } = req.body

    const conversation = new Conversation({
      userId: req.user.userId,
      title: title || 'New Conversation',
      category: category || 'general'
    })

    await conversation.save()
    res.status(201).json(conversation)
  } catch (error) {
    console.error('Create conversation error:', error)
    res.status(500).json({ error: 'Failed to create conversation' })
  }
})

// Get user conversations
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.userId })
      .sort({ lastUpdated: -1 })
      .select('-__v')

    res.json(conversations)
  } catch (error) {
    console.error('Get conversations error:', error)
    res.status(500).json({ error: 'Failed to get conversations' })
  }
})

// Get single conversation
router.get('/conversations/:id', verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.userId
    }).select('-__v')

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    res.json(conversation)
  } catch (error) {
    console.error('Get conversation error:', error)
    res.status(500).json({ error: 'Failed to get conversation' })
  }
})

// Delete conversation
router.delete('/conversations/:id', verifyToken, async (req, res) => {
  try {
    const result = await Conversation.deleteOne({
      _id: req.params.id,
      userId: req.user.userId
    })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    res.json({ message: 'Conversation deleted successfully' })
  } catch (error) {
    console.error('Delete conversation error:', error)
    res.status(500).json({ error: 'Failed to delete conversation' })
  }
})

// Get usage statistics
router.get('/usage', verifyToken, async (req, res) => {
  try {
    const usage = await Usage.find({ userId: req.user.userId })
      .sort({ date: -1 })
      .limit(30)

    const totalRequests = usage.reduce((sum, u) => sum + u.requestCount, 0)
    const totalTokens = usage.reduce((sum, u) => sum + u.tokensUsed, 0)

    res.json({
      totalRequests,
      totalTokens,
      dailyUsage: usage
    })
  } catch (error) {
    console.error('Get usage error:', error)
    res.status(500).json({ error: 'Failed to get usage statistics' })
  }
})

// Get suggested prompts
router.get('/suggestions', (req, res) => {
  res.json([
    "Help me analyze a case",
    "Schedule an appointment",
    "Draft a client letter",
    "Research case precedents",
    "Summarize case documents",
    "Prepare for a meeting"
  ])
})

export default router
