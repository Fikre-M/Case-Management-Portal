# AI Assistant Sidebar Component

## Overview

The AI Assistant Sidebar is a collapsible panel that provides context-aware AI assistance for case management. It features a chat interface with persistent history, context integration, and smooth animations using Framer Motion.

## Components

### 1. AIAssistant (`src/components/ai/AIAssistant.jsx`)

Main sidebar component with full chat functionality.

**Features:**
- Collapsible sidebar with slide-in animation
- Context-aware responses based on current case/appointment
- Persistent chat history via AppContext and localStorage
- Quick action buttons for common tasks
- Service status indicator (OpenAI vs Mock mode)
- Auto-scroll to latest messages
- Loading states and error handling

**Props:**
```javascript
{
  isOpen: boolean,           // Whether sidebar is open
  onToggle: function,        // Function to toggle sidebar
  caseContext: object,       // Current case data for AI context
  appointmentContext: object // Current appointment data for AI context
}
```

### 2. AIAssistantToggle (`src/components/ai/AIAssistantToggle.jsx`)

Floating action button to toggle the AI Assistant.

**Features:**
- Fixed positioning (bottom-right)
- Smooth animations and hover effects
- Notification badge support
- Pulse animation when closed
- Icon rotation on state change

**Props:**
```javascript
{
  isOpen: boolean,           // Current state
  onToggle: function,        // Toggle function
  hasNotification: boolean   // Show notification badge
}
```

### 3. useAIAssistant Hook (`src/hooks/useAIAssistant.js`)

Custom hook for managing AI Assistant state and context.

**Features:**
- State management for open/close
- Context management for case/appointment data
- Convenience methods for different use cases
- Reusable across components

## Integration

### Basic Integration (MainLayout)

```javascript
import AIAssistant from '../components/ai/AIAssistant'
import AIAssistantToggle from '../components/ai/AIAssistantToggle'

function MainLayout() {
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
  
  const toggleAiAssistant = () => {
    setAiAssistantOpen(!aiAssistantOpen)
  }

  return (
    <div>
      {/* Your layout content */}
      
      <AIAssistant 
        isOpen={aiAssistantOpen} 
        onToggle={toggleAiAssistant}
      />
      
      <AIAssistantToggle 
        isOpen={aiAssistantOpen} 
        onToggle={toggleAiAssistant}
      />
    </div>
  )
}
```

### Advanced Integration with Context

```javascript
import { useAIAssistant } from '../hooks/useAIAssistant'

function CaseDetailPage({ caseId }) {
  const { case: caseData } = useCaseData(caseId)
  const aiAssistant = useAIAssistant()

  const handleAskAI = () => {
    aiAssistant.openWithCase(caseData)
  }

  return (
    <div>
      <button onClick={handleAskAI}>
        Ask AI about this case
      </button>
      
      <AIAssistant 
        isOpen={aiAssistant.isOpen}
        onToggle={aiAssistant.toggle}
        caseContext={aiAssistant.context?.caseContext}
      />
    </div>
  )
}
```

## Context Integration

### Case Context

When a case is provided, the AI receives:
- Case ID, title, status, priority
- Client name and last updated date
- System overview (total cases, active cases, etc.)

### Appointment Context

When an appointment is provided, the AI receives:
- Appointment ID, title, date, time
- Client name and status
- Today's and upcoming appointments count

### System Prompt Enhancement

The AI system prompt is dynamically enhanced with:
```
Current system overview:
- Total cases: X
- Active cases: Y
- Today's appointments: Z

Current case context:
- Case ID: 123
- Title: "Client consultation"
- Status: "active"
- Priority: "high"
...
```

## Chat History Persistence

### AppContext Integration

Chat history is stored in:
1. **Local State**: For immediate UI updates
2. **AppContext**: For cross-component persistence
3. **localStorage**: For browser session persistence

### Functions Available

```javascript
const {
  aiChatHistory,      // Array of all messages
  addAiMessage,       // Add new message
  clearAiChatHistory, // Clear all history
  getAiChatHistory,   // Get current history
} = useApp()
```

## Quick Actions

Pre-defined buttons for common tasks:

1. **Case Summary**: Analyze current case and suggest next steps
2. **Today's Schedule**: Review appointments and preparation needed
3. **Best Practices**: General case management guidance
4. **Documentation**: Help with note-taking and documentation

## Animations

### Framer Motion Integration

- **Sidebar**: Slide-in from right with spring animation
- **Toggle Button**: Scale and rotation animations
- **Backdrop**: Fade in/out for mobile overlay
- **Pulse Effect**: Continuous pulse when assistant is closed

### Animation Configuration

```javascript
// Sidebar slide-in
initial={{ x: '100%' }}
animate={{ x: isOpen ? 0 : '100%' }}
transition={{ 
  type: 'spring', 
  stiffness: 300, 
  damping: 30 
}}

// Toggle button scale
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

## Responsive Design

### Desktop (lg+)
- Sidebar: 384px width (w-96)
- Fixed positioning on right side
- No backdrop overlay

### Mobile/Tablet
- Full-screen backdrop with overlay
- Touch-friendly close gestures
- Optimized button sizes

## Service Integration

### OpenAI Mode
- Uses GPT-3.5-turbo model
- Custom system prompts with context
- 500 token limit for responses
- Temperature: 0.7 for balanced creativity

### Mock Mode (Fallback)
- Pattern-based response matching
- Simulated network delays
- Professional pre-written responses
- Automatic fallback on API errors

## Error Handling

### Graceful Degradation
1. **API Errors**: Automatic fallback to mock responses
2. **Network Issues**: User-friendly error messages
3. **Invalid Context**: Continues with general assistance
4. **Storage Errors**: Warns but continues functionality

### Error Messages
- Clear, actionable error descriptions
- Retry suggestions when appropriate
- Contact information for persistent issues

## Performance Considerations

### Optimization Features
- **Lazy Loading**: Components load only when needed
- **Message Virtualization**: Efficient rendering for long chats
- **Context Memoization**: Prevents unnecessary re-renders
- **localStorage Throttling**: Batched saves to prevent blocking

### Memory Management
- Automatic cleanup of old messages (configurable limit)
- Efficient state updates with useCallback
- Proper cleanup in useEffect hooks

## Customization

### Styling
- Tailwind CSS classes for easy theming
- Dark mode support throughout
- Consistent with app design system
- Customizable colors and spacing

### Behavior
- Configurable quick actions
- Adjustable animation timing
- Customizable system prompts
- Flexible context structure

## Security Considerations

### Data Privacy
- Chat history stored locally only
- No sensitive data sent to AI by default
- User control over data sharing
- Clear privacy notices

### API Security
- Client-side API key (demo only)
- Rate limiting recommendations
- Error message sanitization
- Input validation and sanitization

## Future Enhancements

### Planned Features
- Voice input/output support
- File attachment handling
- Advanced context understanding
- Multi-language support
- Custom AI model integration

### Integration Opportunities
- Calendar system integration
- Document management connection
- Email/communication tools
- Reporting and analytics
- Mobile app synchronization

## Troubleshooting

### Common Issues

1. **Assistant not opening**
   - Check console for JavaScript errors
   - Verify Framer Motion is installed
   - Ensure proper component nesting

2. **Chat history not persisting**
   - Check localStorage permissions
   - Verify AppContext is properly wrapped
   - Look for console warnings about storage

3. **Context not working**
   - Ensure proper prop passing
   - Check context object structure
   - Verify useApp hook is available

4. **Animations not smooth**
   - Check for CSS conflicts
   - Verify Framer Motion version compatibility
   - Ensure proper z-index stacking

### Debug Mode

Enable debug logging:
```javascript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('AI Assistant Debug:', {
    isOpen,
    context,
    messageCount: messages.length,
    serviceStatus
  })
}
```

## Testing

### Unit Tests
- Component rendering tests
- State management verification
- Context integration testing
- Error handling validation

### Integration Tests
- Full chat flow testing
- Context switching scenarios
- Persistence functionality
- Animation behavior

### E2E Tests
- User interaction flows
- Cross-browser compatibility
- Mobile responsiveness
- Performance benchmarks