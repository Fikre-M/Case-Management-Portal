# Component Reference Guide

## 🧩 Common Components

### Button
**Location:** `src/components/common/Button.jsx`

```jsx
import Button from '../components/common/Button'

// Primary button
<Button type="submit">Submit</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Danger button
<Button variant="danger">Delete</Button>

// Disabled button
<Button disabled>Loading...</Button>

// With custom classes
<Button className="w-full py-3">Full Width</Button>
```

**Props:**
- `children` - Button text/content
- `variant` - 'primary' | 'secondary' | 'danger'
- `type` - 'button' | 'submit' | 'reset'
- `onClick` - Click handler
- `disabled` - Boolean
- `className` - Additional CSS classes

---

### Card
**Location:** `src/components/common/Card.jsx`

```jsx
import Card from '../components/common/Card'

// Simple card
<Card>
  <p>Content here</p>
</Card>

// Card with title
<Card title="My Card">
  <p>Content here</p>
</Card>

// Card with custom classes
<Card className="hover:shadow-lg">
  <p>Content here</p>
</Card>
```

**Props:**
- `children` - Card content
- `title` - Optional card title
- `className` - Additional CSS classes

---

### Input
**Location:** `src/components/common/Input.jsx`

```jsx
import Input from '../components/common/Input'

<Input 
  label="Email"
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
```

**Props:**
- `label` - Input label
- `type` - Input type (text, email, password, etc.)
- `placeholder` - Placeholder text
- `value` - Input value
- `onChange` - Change handler
- `required` - Boolean

---

### AuthInput
**Location:** `src/components/forms/AuthInput.jsx`

```jsx
import AuthInput from '../components/forms/AuthInput'

<AuthInput
  label="Email Address"
  type="email"
  name="email"
  placeholder="you@example.com"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  required
  icon="📧"
/>
```

**Props:**
- `label` - Input label
- `type` - Input type
- `name` - Input name
- `placeholder` - Placeholder text
- `value` - Input value
- `onChange` - Change handler
- `error` - Error message string
- `required` - Boolean
- `icon` - Icon emoji/string

---

### Alert
**Location:** `src/components/common/Alert.jsx`

```jsx
import Alert from '../components/common/Alert'

// Success alert
<Alert type="success" message="Operation successful!" />

// Error alert
<Alert type="error" message="Something went wrong" />

// Warning alert
<Alert type="warning" message="Please review" />

// Info alert
<Alert type="info" message="New update available" />

// Dismissible alert
<Alert 
  type="success" 
  message="Saved!" 
  onClose={() => setAlert(null)} 
/>
```

**Props:**
- `type` - 'success' | 'error' | 'warning' | 'info'
- `message` - Alert message
- `onClose` - Optional close handler

---

### Badge
**Location:** `src/components/common/Badge.jsx`

```jsx
import Badge from '../components/common/Badge'

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Cancelled</Badge>
<Badge variant="info">New</Badge>
<Badge>Default</Badge>
```

**Props:**
- `children` - Badge text
- `variant` - 'default' | 'success' | 'warning' | 'danger' | 'info'

---

### Modal
**Location:** `src/components/common/Modal.jsx`

```jsx
import Modal from '../components/common/Modal'

<Modal 
  isOpen={showModal} 
  onClose={() => setShowModal(false)}
  title="Confirm Action"
>
  <p>Are you sure?</p>
  <div className="flex space-x-4 mt-4">
    <Button onClick={handleConfirm}>Confirm</Button>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Cancel
    </Button>
  </div>
</Modal>
```

**Props:**
- `isOpen` - Boolean to show/hide
- `onClose` - Close handler
- `title` - Modal title
- `children` - Modal content

---

### Table
**Location:** `src/components/common/Table.jsx`

```jsx
import Table from '../components/common/Table'

const columns = [
  { header: 'Name', accessor: (row) => row.name },
  { header: 'Email', accessor: (row) => row.email },
  { header: 'Status', accessor: (row) => <Badge>{row.status}</Badge> },
]

const data = [
  { name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' },
]

<Table columns={columns} data={data} />
```

**Props:**
- `columns` - Array of column definitions
- `data` - Array of data rows

---

### Loading
**Location:** `src/components/common/Loading.jsx`

```jsx
import Loading from '../components/common/Loading'

<Loading />
```

Simple loading spinner component.

---

## 🧭 Navigation Components

### Sidebar
**Location:** `src/components/navigation/Sidebar.jsx`

```jsx
import Sidebar from '../components/navigation/Sidebar'

<Sidebar 
  isOpen={sidebarOpen} 
  onClose={() => setSidebarOpen(false)} 
/>
```

**Props:**
- `isOpen` - Boolean for mobile sidebar
- `onClose` - Close handler for mobile

**Features:**
- Desktop: Fixed sidebar
- Mobile: Slide-in drawer
- Active page highlighting
- User profile section

---

### Topbar
**Location:** `src/components/navigation/Topbar.jsx`

```jsx
import Topbar from '../components/navigation/Topbar'

<Topbar 
  onMenuClick={toggleSidebar}
  darkMode={darkMode}
  onToggleDarkMode={toggleDarkMode}
/>
```

**Props:**
- `onMenuClick` - Mobile menu toggle handler
- `darkMode` - Boolean for dark mode state
- `onToggleDarkMode` - Dark mode toggle handler

**Features:**
- Search bar
- Notifications dropdown
- Profile dropdown
- Dark mode toggle
- Quick actions button

---

## 📐 Layout Components

### MainLayout
**Location:** `src/layouts/MainLayout.jsx`

```jsx
import MainLayout from '../layouts/MainLayout'

// Used in routing
<Route element={<MainLayout />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
```

**Features:**
- Sidebar integration
- Topbar integration
- Dark mode state
- Mobile overlay
- Responsive design

---

### AuthLayout
**Location:** `src/layouts/AuthLayout.jsx`

```jsx
import AuthLayout from '../layouts/AuthLayout'

// Used in routing
<Route element={<AuthLayout />}>
  <Route path="/login" element={<Login />} />
</Route>
```

**Features:**
- Gradient background
- Animated elements
- Centered content
- Brand header
- Footer

---

## 🎨 Styling Patterns

### Dark Mode Classes
```jsx
// Background
className="bg-white dark:bg-gray-800"

// Text
className="text-gray-900 dark:text-white"

// Border
className="border-gray-200 dark:border-gray-700"

// Hover
className="hover:bg-gray-100 dark:hover:bg-gray-700"
```

### Responsive Classes
```jsx
// Mobile first
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

// Hide on mobile
className="hidden md:block"

// Show only on mobile
className="block md:hidden"
```

### Common Patterns
```jsx
// Card with hover
className="card hover:shadow-lg transition-shadow"

// Button group
<div className="flex space-x-4">
  <Button>Save</Button>
  <Button variant="secondary">Cancel</Button>
</div>

// Form field
<div className="mb-4">
  <label className="block text-sm font-medium mb-2">Label</label>
  <input className="input-field" />
</div>

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

---

## 🔧 Utility Functions

### Validators
**Location:** `src/utils/validators.js`

```jsx
import { validateEmail, validatePassword, validateRequired } from '../utils/validators'

// Email validation
if (!validateEmail(email)) {
  setError('Invalid email')
}

// Password validation (min 8 chars)
if (!validatePassword(password)) {
  setError('Password too short')
}

// Required field
if (!validateRequired(value)) {
  setError('Field is required')
}
```

---

### Formatters
**Location:** `src/utils/formatters.js`

```jsx
import { formatDate, formatTime, formatCurrency, truncateText } from '../utils/formatters'

// Format date
formatDate(new Date()) // "December 6, 2024"

// Format time
formatTime(new Date()) // "02:30 PM"

// Format currency
formatCurrency(1234.56) // "$1,234.56"

// Truncate text
truncateText("Long text here", 20) // "Long text here..."
```

---

## 🪝 Custom Hooks

### useFetch
**Location:** `src/hooks/useFetch.js`

```jsx
import useFetch from '../hooks/useFetch'

const { data, loading, error } = useFetch(
  () => fetchAppointments(),
  [/* dependencies */]
)

if (loading) return <Loading />
if (error) return <Alert type="error" message={error} />
return <div>{data}</div>
```

---

### useLocalStorage
**Location:** `src/hooks/useLocalStorage.js`

```jsx
import useLocalStorage from '../hooks/useLocalStorage'

const [theme, setTheme] = useLocalStorage('theme', 'light')

// Use like useState, but persists to localStorage
setTheme('dark')
```

---

## 📝 Form Patterns

### Basic Form
```jsx
const [formData, setFormData] = useState({ email: '', password: '' })
const [errors, setErrors] = useState({})

const handleChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({ ...prev, [name]: value }))
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }))
  }
}

const handleSubmit = (e) => {
  e.preventDefault()
  // Validate and submit
}

return (
  <form onSubmit={handleSubmit}>
    <AuthInput
      name="email"
      value={formData.email}
      onChange={handleChange}
      error={errors.email}
    />
    <Button type="submit">Submit</Button>
  </form>
)
```

---

## 🎯 Best Practices

1. **Always use dark mode classes** for new components
2. **Test on mobile** - resize browser to < 768px
3. **Use existing components** before creating new ones
4. **Follow naming conventions** - PascalCase for components
5. **Keep components small** - single responsibility
6. **Add prop validation** - use PropTypes or TypeScript
7. **Handle loading states** - show Loading component
8. **Handle errors** - show Alert component
9. **Use semantic HTML** - proper tags for accessibility
10. **Test keyboard navigation** - tab through forms

---

## 📚 Quick Reference

### Import Paths
```jsx
// Components
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Alert from '../components/common/Alert'

// Forms
import AuthInput from '../components/forms/AuthInput'

// Navigation
import Sidebar from '../components/navigation/Sidebar'
import Topbar from '../components/navigation/Topbar'

// Utils
import { validateEmail } from '../utils/validators'
import { formatDate } from '../utils/formatters'

// Hooks
import useFetch from '../hooks/useFetch'
```

### Common Imports
```jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
```

---

**Need help? Check the component source code for more examples!**
