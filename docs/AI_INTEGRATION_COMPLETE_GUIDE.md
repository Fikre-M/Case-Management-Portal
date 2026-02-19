# Complete AI Integration Guide

## Overview

This guide covers the complete AI integration system for the Case Management application, including all components, contexts, and features.

## Architecture

### Core Components

```
AI Integration System
├── Services
│   └── aiService.js - OpenAI integration with fallback
├── Context
│   └── AIContext.jsx - Global AI state management
├── Components
│   ├── AIAssistant.jsx - Main sidebar assistant
│   ├── AIAssistantToggle.jsx - Floating toggle button
│   ├── SmartSuggestions.jsx - Context-aware suggestions
│   ├── ConversationHistory.jsx - Chat history manager
│   ├── AISettings.jsx - Configuration panel
│   ├── ChatMessage.jsx - Message display
│   └── InputBar.jsx - Message input
├── Hooks
│   └── useAIAssistant.js - Assistant state management
└── Pages
    ├── AIDashboard.jsx - AI management hub
    └── AiChatPage.jsx - Full-page chat interface
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install openai framer-motion
```

### 2. Configure Environment

Add to `.env`:
```env
VITE_OPENAI_API_KEY=sk-your-actual-key-here
```

### 3. Wrap App with AIProvider

```javascript
// src/App.jsx
import { AIProvider } from './context/AIContext'

function App() {
  return (
    <AppProvider>
      <AIProvider>
        {/* Your app content */}
      </AIProvider>
    </AppProvider>
  )
}
```

### 4. Add to MainLayout

```javascript
// src/layouts/MainLayout.jsx
import AIAssistant from '../components/ai/AIAssistant'
import AIAssistantToggle from '../components/ai/AIAssistantToggle'

function MainLayout() {
  const [aiOpen, setAiOpen] = useState(false)
  
  return (
    <div>
      {/* Your layout */}
      <AIAssistant isOpen={aiOpen} onToggle={() => setAiOpen(!aiOpen)} />
      <AIAssistantToggle isOpen={aiOpen} onToggle={() => setAiOpen(!aiOpen)} />
    </div>
  )
}
```

## Features

### 1. AI Assistant Sidebar

**Location**: `src/components/ai/AIAssistant.jsx`

**Features**:
- Collapsible sidebar with Framer Motion animations
- Context-aware responses (case/appointment data)
- Persistent chat history
- Quick action buttons
- Service status indicator
- Auto-scroll to latest messages

**Usage**:
```javascript
<AIAssistant
  isOpen={isOpen}
  onToggle={toggleFunction}
  caseContext={currentCase}
  appointmentContext={currentAppointment}
/>
```

### 2. Smart Suggestions

**Location**: `src/components/ai/SmartSuggestions.jsx`

**Features**:
- Context-aware AI suggestions
- Priority-based sorting
- Category filtering
- Dismissible suggestions
- Automatic generation based on user activity

**Usage**:
```javascript
<SmartSuggestions
  context="dashboard" // or 'case', 'appointment'
  contextData={currentData}
  onSuggestionClick={(prompt) => openAIWithPrompt(prompt)}
/>
```

**Suggestion Types**:
- Today's appointment preparation
- High priority case alerts
- Weekly planning assistance
- Workload management
- Case analysis
- Documentation help

### 3. Conversation History

**Location**: `src/components/ai/ConversationHistory.jsx`

**Features**:
- Search conversations
- Filter by category
- Sort by date/messages
- Export individual conversations
- Delete conversations
- Grouped by date (Today, Yesterday, etc.)

**Usage**:
```javascript
<ConversationHistory
  conversations={conversations}
  onConversationSelect={handleSelect}
  onConversationDelete={handleDelete}
  onExport={handleExport}
/>
```

### 4. AI Settings

**Location**: `src/components/ai/AISettings.jsx`

**Features**:
- Toggle smart suggestions
- Enable/disable history saving
- Notification preferences
- Maximum history items slider
- Usage statistics display
- Export all conversations
- Clear all history

**Usage**:
```javascript
<AISettings
  settings={settings}
  onSettingsChange={updateSettings}
  statistics={getStatistics()}
  onClearHistory={clearAll}
  onExportAll={exportAll}
/>
```

### 5. AI Context

**Location**: `src/context/AIContext.jsx`

**Features**:
- Global AI state management
- Conversation persistence
- Settings management
- Statistics tracking
- Export/import functionality

**Available Methods**:
```javascript
const {
  // Assistant control
  isAssistantOpen,
  openAssistant,
  closeAssistant,
  toggleAssistant,
  updateContext,
  
  // Conversations
  conversations,
  createConversation,
  addMessageToConversation,
  deleteConversation,
  clearAllConversations,
  exportConversation,
  exportAllConversations,
  
  // Settings
  settings,
  updateSettings,
  
  // Statistics
  getStatistics,
} = useAI()
```

### 6. AI Dashboard

**Location**: `src/pages/ai/AIDashboard.jsx`

**Features**:
- Centralized AI management
- Quick statistics overview
- Tabbed interface (Suggestions, History, Settings)
- Service status display
- Quick access to assistant

## Integration Patterns

### Pattern 1: Basic Integration (Global Access)

Already implemented in MainLayout - users can access AI from anywhere via the floating button.

### Pattern 2: Context-Aware Integration

```javascript
// In a case detail page
function CaseDetail() {
  const { id } = useParams()
  const { getCaseById } = useApp()
  const { openAssistant } = useAI()
  
  const caseData = getCaseById(id)
  
  const handleAskAI = () => {
    openAssistant({ caseContext: caseData })
  }
  
  return (
    <div>
      <button onClick={handleAskAI}>Ask AI about this case</button>
    </div>
  )
}
```

### Pattern 3: Smart Suggestions Integration

```javascript
// In dashboard
function Dashboard() {
  const { openAssistant } = useAI()
  
  const handleSuggestionClick = (prompt) => {
    openAssistant()
    // AI will receive the prompt
  }
  
  return (
    <div>
      <SmartSuggestions
        context="dashboard"
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  )
}
```

### Pattern 4: Custom Hook Usage

```javascript
import { useAIAssistant } from '../hooks/useAIAssistant'

function MyComponent() {
  const ai = useAIAssistant()
  
  // Open with case context
  ai.openWithCase(caseData)
  
  // Open with appointment context
  ai.openWithAppointment(appointmentData)
  
  // Open with both
  ai.openWithBoth(caseData, appointmentData)
  
  return (
    <AIAssistant
      isOpen={ai.isOpen}
      onToggle={ai.toggle}
      caseContext={ai.context?.caseContext}
      appointmentContext={ai.context?.appointmentContext}
    />
  )
}
```

## Data Flow

### 1. Message Flow

```
User Input → InputBar
    ↓
AIAssistant (buildContext)
    ↓
aiService.sendMessage(message, systemPrompt)
    ↓
OpenAI API (if available) OR Mock Response
    ↓
Response → ChatMessage
    ↓
AIContext (addMessageToConversation)
    ↓
localStorage (persistence)
```

### 2. Context Flow

```
Page/Component (case/appointment data)
    ↓
AIContext (updateContext)
    ↓
AIAssistant (buildSystemPrompt)
    ↓
Enhanced prompt with context
    ↓
AI Service (contextual response)
```

### 3. Settings Flow

```
AISettings Component
    ↓
AIContext (updateSettings)
    ↓
localStorage (persistence)
    ↓
Applied across all AI components
```

## API Reference

### aiService.js

```javascript
// Send message to AI
sendMessage(message: string, systemPrompt?: string): Promise<string>

// Get suggested prompts
getSuggestedPrompts(): string[]

// Get quick actions
getQuickActions(): Array<{icon, label, prompt}>

// Check if OpenAI is available
isOpenAIAvailable(): boolean

// Get service status
getServiceStatus(): {provider, available, model}
```

### AIContext

```javascript
// Assistant control
openAssistant(context?: object): void
closeAssistant(): void
toggleAssistant(): void
updateContext(context: object): void

// Conversations
createConversation(title: string, category?: string): Conversation
addMessageToConversation(id: number, message: Message): void
deleteConversation(id: number): void
clearAllConversations(): void
exportConversation(conversation: Conversation): void
exportAllConversations(): void

// Settings
updateSettings(settings: Partial<Settings>): void

// Statistics
getStatistics(): Statistics
```

## Configuration

### AI Service Configuration

```javascript
// src/services/aiService.js
const SYSTEM_PROMPT = `Your custom system prompt here`

// OpenAI settings
{
  model: "gpt-3.5-turbo",
  max_tokens: 500,
  temperature: 0.7,
}
```

### Default Settings

```javascript
{
  autoSuggestions: true,
  saveHistory: true,
  notificationsEnabled: true,
  maxHistoryItems: 50,
}
```

## Performance Optimization

### 1. Lazy Loading

Components are loaded only when needed:
```javascript
const AIAssistant = lazy(() => import('./components/ai/AIAssistant'))
```

### 2. Memoization

Context values are memoized:
```javascript
const value = useMemo(() => ({
  // context values
}), [dependencies])
```

### 3. Local Storage Throttling

Settings and conversations are saved with debouncing to prevent excessive writes.

### 4. Message Virtualization

For long conversations, consider implementing virtual scrolling.

## Security Considerations

### 1. API Key Management

⚠️ **Current Implementation**: Client-side API key (demo only)

**Production Recommendations**:
- Use backend proxy for API calls
- Never expose API keys in frontend
- Implement rate limiting
- Add authentication/authorization

### 2. Data Privacy

- All data stored locally in browser
- No external data transmission (except AI API)
- User control over data export/deletion
- Clear privacy notices

### 3. Input Sanitization

- Validate user inputs
- Sanitize AI responses
- Prevent XSS attacks
- Handle malicious prompts

## Testing

### Unit Tests

```javascript
// Test AI Assistant
test('opens with case context', () => {
  render(<AIAssistant caseContext={mockCase} />)
  expect(screen.getByText(/Case:/)).toBeInTheDocument()
})

// Test Smart Suggestions
test('generates context-aware suggestions', () => {
  render(<SmartSuggestions context="dashboard" />)
  expect(screen.getByText(/Prepare for Today/)).toBeInTheDocument()
})
```

### Integration Tests

```javascript
// Test full workflow
test('complete AI conversation flow', async () => {
  render(<App />)
  
  // Open assistant
  fireEvent.click(screen.getByTitle('Open AI Assistant'))
  
  // Send message
  const input = screen.getByPlaceholderText(/Type your message/)
  fireEvent.change(input, { target: { value: 'Help me' } })
  fireEvent.click(screen.getByText('Send'))
  
  // Verify response
  await waitFor(() => {
    expect(screen.getByText(/I can help/)).toBeInTheDocument()
  })
})
```

## Troubleshooting

### Issue: AI Assistant not opening

**Solutions**:
- Check console for errors
- Verify AIProvider is wrapping the app
- Ensure Framer Motion is installed
- Check z-index conflicts

### Issue: Conversations not persisting

**Solutions**:
- Check localStorage permissions
- Verify saveHistory setting is enabled
- Check browser storage limits
- Clear corrupted localStorage data

### Issue: OpenAI not working

**Solutions**:
- Verify API key is correct
- Check API key format (starts with sk-)
- Ensure API key has credits
- Check network connectivity
- Review browser console for API errors

### Issue: Slow performance

**Solutions**:
- Limit conversation history
- Implement message virtualization
- Reduce animation complexity
- Optimize re-renders with React.memo

## Best Practices

### 1. Context Management

- Only pass relevant context
- Update context when data changes
- Clear context when navigating away
- Use specific context over generic data

### 2. User Experience

- Provide clear loading states
- Show error messages gracefully
- Enable keyboard shortcuts
- Maintain conversation continuity

### 3. Performance

- Lazy load AI components
- Debounce user inputs
- Limit history size
- Use React.memo for expensive components

### 4. Accessibility

- Keyboard navigation support
- Screen reader compatibility
- Focus management
- ARIA labels

## Future Enhancements

### Planned Features

1. **Voice Integration**
   - Speech-to-text input
   - Text-to-speech responses
   - Voice commands

2. **Advanced Context**
   - Document analysis
   - Email integration
   - Calendar synchronization

3. **Collaboration**
   - Share conversations
   - Team suggestions
   - Collaborative notes

4. **Analytics**
   - Usage tracking
   - Performance metrics
   - User behavior insights

5. **Mobile App**
   - React Native version
   - Offline support
   - Push notifications

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
- [localStorage Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## Support

For issues or questions:
1. Check this documentation
2. Review the troubleshooting section
3. Check browser console for errors
4. Review component PropTypes
5. Consult the example implementations