# AI Assistant Usage Examples

## Basic Usage in MainLayout

The AI Assistant is already integrated into the MainLayout and available on all pages:

```javascript
// src/layouts/MainLayout.jsx
import AIAssistant from "../components/ai/AIAssistant";
import AIAssistantToggle from "../components/ai/AIAssistantToggle";

function MainLayout() {
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  const toggleAiAssistant = () => {
    setAiAssistantOpen(!aiAssistantOpen);
  };

  return (
    <div>
      {/* Your layout content */}
      
      {/* AI Assistant Sidebar */}
      <AIAssistant 
        isOpen={aiAssistantOpen} 
        onToggle={toggleAiAssistant}
      />

      {/* Floating Toggle Button */}
      <AIAssistantToggle 
        isOpen={aiAssistantOpen} 
        onToggle={toggleAiAssistant}
      />
    </div>
  );
}
```

## Case Detail Page with Context

```javascript
// Example: src/pages/cases/CaseDetail.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AIAssistant from '../../components/ai/AIAssistant';
import AIAssistantToggle from '../../components/ai/AIAssistantToggle';

function CaseDetail() {
  const { id } = useParams();
  const { getCaseById } = useApp();
  const [aiOpen, setAiOpen] = useState(false);
  
  const caseData = getCaseById(id);

  const handleAskAI = () => {
    setAiOpen(true);
  };

  if (!caseData) {
    return <div>Case not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Case Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{caseData.title}</h1>
          <p className="text-gray-600">Client: {caseData.clientName}</p>
        </div>
        
        {/* AI Assistant Button */}
        <button
          onClick={handleAskAI}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <span>🤖</span>
          <span>Ask AI about this case</span>
        </button>
      </div>

      {/* Case Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case details content */}
      </div>

      {/* AI Assistant with Case Context */}
      <AIAssistant
        isOpen={aiOpen}
        onToggle={() => setAiOpen(!aiOpen)}
        caseContext={caseData}
      />
    </div>
  );
}
```

## Appointment Page with Context

```javascript
// Example: src/pages/appointments/AppointmentDetail.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import AIAssistant from '../../components/ai/AIAssistant';

function AppointmentDetail() {
  const { id } = useParams();
  const { getAppointmentById, getCaseById } = useApp();
  const [aiOpen, setAiOpen] = useState(false);
  
  const appointment = getAppointmentById(id);
  const relatedCase = appointment?.caseId ? getCaseById(appointment.caseId) : null;

  const handlePrepareWithAI = () => {
    setAiOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Appointment Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{appointment.title}</h1>
          <p className="text-gray-600">
            {appointment.date} at {appointment.time}
          </p>
        </div>
        
        <button
          onClick={handlePrepareWithAI}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Prepare with AI
        </button>
      </div>

      {/* AI Assistant with Both Contexts */}
      <AIAssistant
        isOpen={aiOpen}
        onToggle={() => setAiOpen(!aiOpen)}
        appointmentContext={appointment}
        caseContext={relatedCase}
      />
    </div>
  );
}
```

## Using the Custom Hook

```javascript
// Example: Advanced usage with useAIAssistant hook
import { useAIAssistant } from '../../hooks/useAIAssistant';

function CaseDashboard() {
  const { getActiveCases, getTodayAppointments } = useApp();
  const aiAssistant = useAIAssistant();
  
  const activeCases = getActiveCases();
  const todayAppointments = getTodayAppointments();

  const handleCaseAnalysis = (caseData) => {
    aiAssistant.openWithCase(caseData);
  };

  const handleScheduleReview = () => {
    aiAssistant.open();
    // AI will see today's appointments in system context
  };

  const handleCaseAndAppointment = (caseData, appointmentData) => {
    aiAssistant.openWithBoth(caseData, appointmentData);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Cases */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Active Cases</h2>
          {activeCases.map(caseItem => (
            <div key={caseItem.id} className="flex justify-between items-center p-3 border rounded mb-2">
              <div>
                <h3 className="font-medium">{caseItem.title}</h3>
                <p className="text-sm text-gray-600">{caseItem.clientName}</p>
              </div>
              <button
                onClick={() => handleCaseAnalysis(caseItem)}
                className="text-primary-600 hover:text-primary-700"
              >
                Ask AI
              </button>
            </div>
          ))}
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Today's Schedule</h2>
            <button
              onClick={handleScheduleReview}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Review with AI
            </button>
          </div>
          {todayAppointments.map(apt => (
            <div key={apt.id} className="p-3 border rounded mb-2">
              <h3 className="font-medium">{apt.title}</h3>
              <p className="text-sm text-gray-600">{apt.time} - {apt.clientName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={aiAssistant.isOpen}
        onToggle={aiAssistant.toggle}
        caseContext={aiAssistant.context?.caseContext}
        appointmentContext={aiAssistant.context?.appointmentContext}
      />
    </div>
  );
}
```

## Quick Integration Patterns

### 1. Simple Toggle Button

```javascript
function MyPage() {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setAiOpen(true)}>
        Get AI Help
      </button>
      
      <AIAssistant
        isOpen={aiOpen}
        onToggle={() => setAiOpen(!aiOpen)}
      />
    </div>
  );
}
```

### 2. Context-Aware Button

```javascript
function CaseCard({ caseData }) {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="border rounded-lg p-4">
      <h3>{caseData.title}</h3>
      <button
        onClick={() => setAiOpen(true)}
        className="mt-2 text-sm text-primary-600"
      >
        Ask AI about this case
      </button>
      
      <AIAssistant
        isOpen={aiOpen}
        onToggle={() => setAiOpen(!aiOpen)}
        caseContext={caseData}
      />
    </div>
  );
}
```

### 3. Global Access (Already Available)

The AI Assistant is globally available through the floating toggle button in MainLayout. Users can:
- Click the floating 🤖 button (bottom-right)
- Get general assistance without specific context
- Access from any page in the application

## Best Practices

### 1. Context Relevance
- Only pass context when it's relevant to the user's current task
- Use specific context (case or appointment) rather than generic data
- Update context when user navigates to different items

### 2. User Experience
- Provide clear buttons/triggers for AI assistance
- Use descriptive button text ("Ask AI about this case" vs "AI")
- Consider when to auto-open vs manual trigger

### 3. Performance
- Don't keep AI Assistant open unnecessarily
- Use the custom hook for complex state management
- Leverage the persistent chat history for continuity

### 4. Error Handling
- Always provide fallback UI if context is missing
- Handle cases where AI service is unavailable
- Give users alternative ways to get help

## Testing Examples

### Unit Tests

```javascript
// Test AI Assistant with context
import { render, screen, fireEvent } from '@testing-library/react';
import AIAssistant from '../AIAssistant';

test('displays case context information', () => {
  const caseContext = {
    id: 1,
    title: 'Test Case',
    clientName: 'John Doe',
    status: 'active'
  };

  render(
    <AIAssistant
      isOpen={true}
      onToggle={() => {}}
      caseContext={caseContext}
    />
  );

  expect(screen.getByText(/Test Case/)).toBeInTheDocument();
  expect(screen.getByText(/active/)).toBeInTheDocument();
});
```

### Integration Tests

```javascript
// Test full workflow
test('opens AI assistant with case context from case detail page', async () => {
  render(<CaseDetailPage />);
  
  const askAIButton = screen.getByText('Ask AI about this case');
  fireEvent.click(askAIButton);
  
  expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  expect(screen.getByText(/Current Context/)).toBeInTheDocument();
});
```