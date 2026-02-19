# AI Integration Quick Reference

## Quick Start

### 1. Basic Setup (Already Done ✅)

```javascript
// App is wrapped with AIProvider
// MainLayout includes AIAssistant and toggle button
// Users can access AI from anywhere via floating button
```

### 2. Use AI in Your Component

```javascript
import { useAI } from '../context/AIContext'

function MyComponent() {
  const { openAssistant } = useAI()
  
  return (
    <button onClick={() => openAssistant()}>
      Ask AI
    </button>
  )
}
```

### 3. Add Context-Aware AI

```javascript
import { useAI } from '../context/AIContext'

function CaseDetail({ caseData }) {
  const { openAssistant } = useAI()
  
  const handleAskAI = () => {
    openAssistant({ caseContext: caseData })
  }
  
  return (
    <button onClick={handleAskAI}>
      Ask AI about this case
    </button>
  )
}
```

## Common Patterns

### Pattern 1: Open AI with Context

```javascript
const { openAssistant } = useAI()

// With case context
openAssistant({ caseContext: currentCase })

// With appointment context
openAssistant({ appointmentContext: currentAppointment })

// With both
openAssistant({ 
  caseContext: currentCase,
  appointmentContext: currentAppointment 
})
```

### Pattern 2: Add Smart Suggestions

```javascript
import SmartSuggestions from '../components/ai/SmartSuggestions'

function Dashboard() {
  const { openAssistant } = useAI()
  
  return (
    <SmartSuggestions
      context="dashboard"
      onSuggestionClick={(prompt) => openAssistant()}
    />
  )
}
```

### Pattern 3: Custom AI Button

```javascript
function CustomAIButton({ context, label }) {
  const { openAssistant } = useAI()
  
  return (
    <button
      onClick={() => openAssistant(context)}
      className="px-4 py-2 bg-primary-600 text-white rounded-lg"
    >
      🤖 {label}
    </button>
  )
}

// Usage
<CustomAIButton 
  context={{ caseContext: myCase }}
  label="Analyze Case"
/>
```

## Component Reference

### AIAssistant

```javascript
<AIAssistant
  isOpen={boolean}
  onToggle={function}
  caseContext={object}           // Optional
  appointmentContext={object}    // Optional
/>
```

### SmartSuggestions

```javascript
<SmartSuggestions
  context="dashboard|case|appointment"
  contextData={object}           // Optional
  onSuggestionClick={function}   // Optional
/>
```

### ConversationHistory

```javascript
<ConversationHistory
  conversations={array}
  onConversationSelect={function}
  onConversationDelete={function}
  onExport={function}
/>
```

### AISettings

```javascript
<AISettings
  settings={object}
  onSettingsChange={function}
  statistics={object}
  onClearHistory={function}
  onExportAll={function}
/>
```

## Hook Reference

### useAI()

```javascript
const {
  // Control
  isAssistantOpen,
  openAssistant,
  closeAssistant,
  toggleAssistant,
  
  // Context
  currentContext,
  updateContext,
  
  // Conversations
  conversations,
  createConversation,
  deleteConversation,
  exportConversation,
  
  // Settings
  settings,
  updateSettings,
  
  // Stats
  getStatistics,
} = useAI()
```

### useAIAssistant()

```javascript
const ai = useAIAssistant()

ai.open()                          // Open assistant
ai.close()                         // Close assistant
ai.toggle()                        // Toggle assistant
ai.openWithCase(caseData)          // Open with case
ai.openWithAppointment(aptData)    // Open with appointment
ai.openWithBoth(case, apt)         // Open with both
ai.updateContext(newContext)       // Update context
```

## Context Objects

### Case Context

```javascript
{
  id: number|string,
  title: string,
  status: string,
  priority: string,
  clientName: string,
  lastUpdated: string,
}
```

### Appointment Context

```javascript
{
  id: number|string,
  title: string,
  clientName: string,
  date: string,
  time: string,
  status: string,
}
```

## Settings Object

```javascript
{
  autoSuggestions: boolean,      // Show smart suggestions
  saveHistory: boolean,          // Save conversations
  notificationsEnabled: boolean, // Enable notifications
  maxHistoryItems: number,       // Max history (10-100)
}
```

## Statistics Object

```javascript
{
  totalConversations: number,
  totalMessages: number,
  avgMessagesPerConversation: number,
  categoryCounts: object,
  oldestConversation: Date,
  newestConversation: Date,
}
```

## Quick Actions

### Open AI Assistant

```javascript
// From anywhere in the app
const { openAssistant } = useAI()
openAssistant()
```

### Get AI Help for Current Page

```javascript
// In a case page
openAssistant({ caseContext: currentCase })

// In an appointment page
openAssistant({ appointmentContext: currentAppointment })
```

### Show Smart Suggestions

```javascript
<SmartSuggestions context="dashboard" />
```

### Access AI Dashboard

```javascript
// Navigate to /ai-dashboard
navigate('/ai-dashboard')
```

## Environment Variables

```env
# Required for OpenAI integration
VITE_OPENAI_API_KEY=sk-your-key-here

# Optional
VITE_AI_SERVICE_URL=
VITE_ENABLE_ANALYTICS=false
```

## Common Tasks

### Task 1: Add AI Button to Page

```javascript
import { useAI } from '../context/AIContext'

function MyPage() {
  const { openAssistant } = useAI()
  
  return (
    <button onClick={() => openAssistant()}>
      Get AI Help
    </button>
  )
}
```

### Task 2: Add Context-Aware AI

```javascript
function CaseCard({ caseData }) {
  const { openAssistant } = useAI()
  
  return (
    <div>
      <h3>{caseData.title}</h3>
      <button onClick={() => openAssistant({ caseContext: caseData })}>
        Analyze with AI
      </button>
    </div>
  )
}
```

### Task 3: Show Suggestions

```javascript
import SmartSuggestions from '../components/ai/SmartSuggestions'

function Dashboard() {
  return (
    <div>
      <SmartSuggestions context="dashboard" />
      {/* Rest of dashboard */}
    </div>
  )
}
```

### Task 4: Export Conversations

```javascript
const { exportAllConversations } = useAI()

<button onClick={exportAllConversations}>
  Export All Conversations
</button>
```

### Task 5: Clear History

```javascript
const { clearAllConversations } = useAI()

<button onClick={clearAllConversations}>
  Clear History
</button>
```

## Keyboard Shortcuts (Future)

```
Ctrl/Cmd + K     - Open AI Assistant
Ctrl/Cmd + /     - Focus AI input
Esc              - Close AI Assistant
```

## Tips & Tricks

### Tip 1: Context is King
Always provide context when available - AI gives better responses with case/appointment data.

### Tip 2: Use Smart Suggestions
Enable smart suggestions in settings for proactive AI help.

### Tip 3: Review History
Check conversation history to find previous AI advice.

### Tip 4: Export Important Conversations
Export conversations you want to keep long-term.

### Tip 5: Customize Settings
Adjust settings to match your workflow preferences.

## Troubleshooting

### AI not responding?
- Check internet connection
- Verify API key in .env
- Check browser console for errors

### Conversations not saving?
- Enable "Save History" in settings
- Check localStorage permissions
- Clear browser cache if corrupted

### Suggestions not showing?
- Enable "Smart Suggestions" in settings
- Ensure you have active cases/appointments
- Refresh the page

## Support

- Full Documentation: `docs/AI_INTEGRATION_COMPLETE_GUIDE.md`
- Usage Examples: `docs/AI_ASSISTANT_USAGE_EXAMPLES.md`
- Sidebar Guide: `docs/AI_ASSISTANT_SIDEBAR.md`