// Mock AI Service - Simulates AI responses
// In production, this would connect to a real AI API

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

// Main function to send message and get response
export async function sendMessage(message) {
  // Simulate network delay (500-1500ms)
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

export default {
  sendMessage,
  getSuggestedPrompts,
  getQuickActions,
}