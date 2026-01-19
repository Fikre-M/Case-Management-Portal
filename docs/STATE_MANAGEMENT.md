# Global State Management - Complete ✅

## 📁 Files Created

### Context (1 file)
1. **`src/context/AppContext.jsx`** - Global application state management

### Mock Data Services (2 files)
1. **`src/services/mockAppointments.js`** - Mock appointments data (6 appointments)
2. **`src/services/mockCases.js`** - Mock cases data (5 cases)

### Updated Files
1. **`src/App.jsx`** - Added AppProvider wrapper
2. **`src/pages/dashboard/Dashboard.jsx`** - Connected to context data

---

## ✨ Features Implemented

### 🌐 AppContext

**Global State Management for:**
- Appointments data
- Cases data
- Loading states
- CRUD operations
- Statistics calculations
- Helper functions

**State Structure:**
```javascript
{
  // Appointments
  appointments: Array,
  appointmentsLoading: Boolean,
  
  // Cases
  cases: Array,
  casesLoading: Boolean,
}
```

---

## 📊 Mock Data

### Appointments (6 items)
```javascript
{
  id: 1,
  title: 'Initial Consultation',
  clientName: 'Sarah Johnson',
  clientEmail: 'sarah.johnson@example.com',
  clientPhone: '+1 (555) 123-4567',
  type: 'consultation',
  date: '2024-12-10',
  time: '14:00',
  duration: '60',
  priority: 'high',
  status: 'confirmed',
  notes: '...',
  location: 'Office - Room 301',
  createdAt: '2024-12-01T10:00:00Z',
  updatedAt: '2024-12-05T15:30:00Z'
}
```

**Appointment Types:**
- Consultation
- Follow-up
- Review
- Assessment
- Other

**Statuses:**
- Confirmed
- Pending
- Cancelled
- Completed

### Cases (5 items)
```javascript
{
  id: 1,
  caseNumber: 'CASE-2024-001',
  title: 'Employment Discrimination Case',
  clientName: 'Sarah Johnson',
  clientEmail: 'sarah.johnson@example.com',
  clientPhone: '+1 (555) 123-4567',
  type: 'employment',
  status: 'active',
  priority: 'high',
  assignedTo: 'John Doe',
  openedDate: '2024-11-15',
  lastUpdated: '2024-12-05',
  progress: 75,
  description: '...',
  nextAction: 'Schedule mediation meeting',
  dueDate: '2024-12-20',
  timeline: [...],
  documents: [...],
  notes: [...]
}
```

**Case Types:**
- Employment
- Contract
- Family
- Personal Injury
- Property

**Statuses:**
- Active
- Pending
- On Hold
- Closed

---

## 🔧 API Reference

### Appointment Operations

#### Get All Appointments
```javascript
const { appointments } = useApp()
```

#### Get Appointment by ID
```javascript
const { getAppointmentById } = useApp()
const appointment = getAppointmentById(1)
```

#### Create Appointment
```javascript
const { createAppointment } = useApp()
const newAppointment = createAppointment({
  title: 'New Appointment',
  clientName: 'John Doe',
  type: 'consultation',
  date: '2024-12-15',
  time: '10:00',
  duration: '60',
  priority: 'medium',
  status: 'pending',
  notes: 'Initial consultation'
})
```

#### Update Appointment
```javascript
const { updateAppointment } = useApp()
updateAppointment(1, {
  status: 'confirmed',
  notes: 'Updated notes'
})
```

#### Delete Appointment
```javascript
const { deleteAppointment } = useApp()
deleteAppointment(1)
```

#### Get Appointments by Status
```javascript
const { getAppointmentsByStatus } = useApp()
const confirmed = getAppointmentsByStatus('confirmed')
```

#### Get Appointments by Date
```javascript
const { getAppointmentsByDate } = useApp()
const todayAppts = getAppointmentsByDate('2024-12-10')
```

#### Get Today's Appointments
```javascript
const { getTodayAppointments } = useApp()
const today = getTodayAppointments()
```

#### Get Upcoming Appointments
```javascript
const { getUpcomingAppointments } = useApp()
const upcoming = getUpcomingAppointments(5) // limit to 5
```

#### Get Appointment Statistics
```javascript
const { getAppointmentStats } = useApp()
const stats = getAppointmentStats()
// Returns: { total, confirmed, pending, cancelled, today }
```

---

### Case Operations

#### Get All Cases
```javascript
const { cases } = useApp()
```

#### Get Case by ID
```javascript
const { getCaseById } = useApp()
const caseData = getCaseById(1)
```

#### Create Case
```javascript
const { createCase } = useApp()
const newCase = createCase({
  title: 'New Case',
  clientName: 'Jane Smith',
  type: 'contract',
  status: 'pending',
  priority: 'high',
  assignedTo: 'John Doe',
  description: 'Case description',
  nextAction: 'Review documents',
  dueDate: '2024-12-30',
  progress: 0
})
```

#### Update Case
```javascript
const { updateCase } = useApp()
updateCase(1, {
  status: 'active',
  progress: 50
})
```

#### Delete Case
```javascript
const { deleteCase } = useApp()
deleteCase(1)
```

#### Get Cases by Status
```javascript
const { getCasesByStatus } = useApp()
const active = getCasesByStatus('active')
```

#### Get Cases by Priority
```javascript
const { getCasesByPriority } = useApp()
const high = getCasesByPriority('high')
```

#### Get Active Cases
```javascript
const { getActiveCases } = useApp()
const active = getActiveCases()
```

#### Get Recent Cases
```javascript
const { getRecentCases } = useApp()
const recent = getRecentCases(5) // limit to 5
```

#### Get Case Statistics
```javascript
const { getCaseStats } = useApp()
const stats = getCaseStats()
// Returns: { total, active, pending, closed, onHold }
```

---

## 🎯 Usage Examples

### In a Component

```javascript
import { useApp } from '../context/AppContext'

function MyComponent() {
  const {
    appointments,
    appointmentsLoading,
    createAppointment,
    getAppointmentStats
  } = useApp()

  if (appointmentsLoading) {
    return <Loading />
  }

  const stats = getAppointmentStats()

  const handleCreate = () => {
    createAppointment({
      title: 'New Appointment',
      clientName: 'John Doe',
      // ... other fields
    })
  }

  return (
    <div>
      <p>Total: {stats.total}</p>
      <button onClick={handleCreate}>Create</button>
    </div>
  )
}
```

### Dashboard Integration

```javascript
import { useApp } from '../../context/AppContext'

function Dashboard() {
  const {
    getUpcomingAppointments,
    getActiveCases,
    getAppointmentStats,
    getCaseStats,
  } = useApp()

  const appointmentStats = getAppointmentStats()
  const caseStats = getCaseStats()
  const recentAppointments = getUpcomingAppointments(4)
  const activeCases = getActiveCases().slice(0, 3)

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Appointments: {appointmentStats.total}</p>
      <p>Active Cases: {caseStats.active}</p>
    </div>
  )
}
```

---

## 🔄 Data Flow

### Initialization
```
App Loads
  ↓
AppProvider Mounts
  ↓
Load Mock Data (500ms delay)
  ↓
Set State
  ↓
Components Render
```

### CRUD Operations
```
User Action
  ↓
Call Context Function
  ↓
Update State
  ↓
Components Re-render
```

### Example: Create Appointment
```
User clicks "Create"
  ↓
createAppointment() called
  ↓
Generate new ID
  ↓
Add to appointments array
  ↓
setAppointments() updates state
  ↓
All components using appointments re-render
```

---

## 🎨 Context Provider Structure

```javascript
<BrowserRouter>
  <AuthProvider>
    <ThemeProvider>
      <AppProvider>  ← New global state
        <AppRoutes />
      </AppProvider>
    </ThemeProvider>
  </AuthProvider>
</BrowserRouter>
```

---

## 📦 Mock Data Features

### Appointments Mock Data
- **6 appointments** with full details
- Various types (consultation, follow-up, review, assessment)
- Different statuses (confirmed, pending)
- Different priorities (high, medium, low)
- Realistic dates and times
- Client contact information
- Location details
- Timestamps (created, updated)

### Cases Mock Data
- **5 cases** with comprehensive details
- Various types (employment, contract, family, personal injury, property)
- Different statuses (active, pending, closed)
- Different priorities (high, medium, low)
- Progress tracking (0-100%)
- Timeline events
- Document lists
- Case notes
- Assigned attorneys
- Due dates

---

## 🔧 Helper Functions

### Appointments
```javascript
// In mockAppointments.js
getAppointmentById(id)
getAppointmentsByStatus(status)
getAppointmentsByDate(date)
getTodayAppointments()
getUpcomingAppointments(limit)
```

### Cases
```javascript
// In mockCases.js
getCaseById(id)
getCasesByStatus(status)
getCasesByPriority(priority)
getCasesByAssignee(assignee)
getActiveCases()
getRecentCases(limit)
```

---

## 🚀 Benefits

### Centralized State
- Single source of truth
- Consistent data across app
- Easy to debug
- Predictable updates

### Easy to Use
- Simple hook API
- No prop drilling
- Type-safe operations
- Clear function names

### Mock Data Ready
- Realistic test data
- Full CRUD operations
- Statistics calculations
- Helper functions

### Backend Ready
- Easy to swap mock with real API
- Same interface
- Just update context functions
- No component changes needed

---

## 🔮 Migration to Real Backend

### Step 1: Update Context
```javascript
// Replace mock data loading
useEffect(() => {
  fetchAppointments().then(data => {
    setAppointments(data)
    setAppointmentsLoading(false)
  })
}, [])
```

### Step 2: Update CRUD Operations
```javascript
const createAppointment = async (data) => {
  const response = await api.post('/appointments', data)
  setAppointments(prev => [...prev, response.data])
  return response.data
}
```

### Step 3: Add Error Handling
```javascript
const [error, setError] = useState(null)

try {
  const data = await api.get('/appointments')
  setAppointments(data)
} catch (err) {
  setError(err.message)
} finally {
  setLoading(false)
}
```

### Step 4: Add Caching (Optional)
```javascript
// Use React Query or SWR
import { useQuery } from 'react-query'

const { data, isLoading } = useQuery('appointments', fetchAppointments)
```

---

## 🧪 Testing

### Test Context Provider
```javascript
import { render } from '@testing-library/react'
import { AppProvider } from './context/AppContext'

test('provides appointments data', () => {
  const { result } = renderHook(() => useApp(), {
    wrapper: AppProvider
  })
  
  expect(result.current.appointments).toBeDefined()
})
```

### Test CRUD Operations
```javascript
test('creates appointment', () => {
  const { result } = renderHook(() => useApp(), {
    wrapper: AppProvider
  })
  
  act(() => {
    result.current.createAppointment({
      title: 'Test',
      clientName: 'John'
    })
  })
  
  expect(result.current.appointments).toHaveLength(7)
})
```

---

## 📚 Best Practices

### Do's ✅
- Use context for global state
- Keep mock data realistic
- Provide loading states
- Include helper functions
- Document API clearly
- Use TypeScript (future)

### Don'ts ❌
- Don't put everything in context
- Don't mutate state directly
- Don't forget loading states
- Don't skip error handling
- Don't over-complicate

---

## 🎉 Summary

**Complete state management with:**
- ✅ Global AppContext
- ✅ Mock appointments data (6 items)
- ✅ Mock cases data (5 items)
- ✅ Full CRUD operations
- ✅ Loading states
- ✅ Statistics functions
- ✅ Helper functions
- ✅ Dashboard integration
- ✅ Easy to use hook API
- ✅ Ready for backend migration

**All components can now access and modify shared data through the context!**
