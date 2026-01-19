# UI Enhancements - Quick Reference

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

Framer Motion is now included in package.json.

---

## 🍞 Toast Notifications

### Basic Usage
```jsx
import useToast from '../hooks/useToast'
import ToastContainer from '../components/common/ToastContainer'

function MyComponent() {
  const { toasts, success, error, warning, info, removeToast } = useToast()

  return (
    <>
      <button onClick={() => success('Saved!')}>Save</button>
      <button onClick={() => error('Failed!')}>Error</button>
      <button onClick={() => warning('Warning!')}>Warn</button>
      <button onClick={() => info('Info!')}>Info</button>
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
```

### Toast Types
- `success` - ✓ Green
- `error` - ✕ Red
- `warning` - ⚠ Yellow
- `info` - ℹ Blue

---

## 💀 Skeleton Loaders

### Usage
```jsx
import SkeletonLoader from '../components/common/SkeletonLoader'

// While loading
if (loading) {
  return <SkeletonLoader type="card" count={3} />
}

// Types: card, table, list, stat
```

### Types
```jsx
<SkeletonLoader type="card" count={3} />   // Card skeletons
<SkeletonLoader type="table" />            // Table skeleton
<SkeletonLoader type="list" count={5} />   // List skeletons
<SkeletonLoader type="stat" count={4} />   // Stat skeletons
```

---

## 📱 Responsive Table

### Usage
```jsx
import ResponsiveTable from '../components/common/ResponsiveTable'

const columns = [
  { header: 'Name', accessor: (row) => row.name },
  { header: 'Email', accessor: (row) => row.email },
  { header: 'Status', accessor: (row) => <Badge>{row.status}</Badge> },
]

<ResponsiveTable
  columns={columns}
  data={data}
  onRowClick={(row) => handleClick(row)}
/>
```

**Features:**
- Desktop: Table view
- Mobile: Card view
- Clickable rows
- Dark mode

---

## 🎭 Enhanced Modal

### Usage
```jsx
import Modal from '../components/common/Modal'

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="lg"
>
  <p>Modal content</p>
</Modal>
```

### Sizes
- `sm` - Small (448px)
- `md` - Medium (672px) - default
- `lg` - Large (896px)
- `xl` - Extra Large (1152px)
- `full` - Full width

### Features
- ESC to close
- Click outside to close
- Prevents body scroll
- Smooth animations

---

## 🎨 Animated Card

### Usage
```jsx
import AnimatedCard from '../components/common/AnimatedCard'

<AnimatedCard title="Card Title" delay={0.1}>
  <p>Card content</p>
</AnimatedCard>
```

### Staggered Animation
```jsx
{items.map((item, index) => (
  <AnimatedCard key={item.id} delay={index * 0.1}>
    {item.content}
  </AnimatedCard>
))}
```

---

## 🎬 CSS Animations

### Available Classes
```jsx
<div className="animate-slide-in-right">Slide from right</div>
<div className="animate-slide-in-left">Slide from left</div>
<div className="animate-slide-in-up">Slide from bottom</div>
<div className="animate-slide-in-down">Slide from top</div>
<div className="animate-fade-in">Fade in</div>
<div className="animate-scale-in">Scale in</div>
```

### Custom Delay
```jsx
<div 
  style={{
    animation: 'scaleIn 0.3s ease-out',
    animationDelay: '0.2s',
    animationFillMode: 'backwards'
  }}
>
  Content
</div>
```

---

## 📱 Mobile Responsiveness

### Breakpoints
```jsx
// Tailwind breakpoints
sm: 640px   // Mobile
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### Responsive Classes
```jsx
// Hide on mobile, show on desktop
<div className="hidden md:block">Desktop only</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">Mobile only</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Cards */}
</div>
```

---

## 🎨 Component Styling

### Button Hover Effects
```jsx
<button className="btn-primary">
  Hover me
</button>
// Automatically has scale and shadow on hover
```

### Card Hover Effects
```jsx
<div className="card">
  Content
</div>
// Automatically has shadow on hover
```

---

## 🌓 Dark Mode

All components support dark mode automatically:
```jsx
// Light: bg-white
// Dark: dark:bg-gray-800

<div className="bg-white dark:bg-gray-800">
  Content
</div>
```

---

## 📦 Import Paths

```jsx
// Components
import Toast from '../components/common/Toast'
import ToastContainer from '../components/common/ToastContainer'
import SkeletonLoader from '../components/common/SkeletonLoader'
import ResponsiveTable from '../components/common/ResponsiveTable'
import Modal from '../components/common/Modal'
import AnimatedCard from '../components/common/AnimatedCard'

// Hooks
import useToast from '../hooks/useToast'
```

---

## 🎯 Common Patterns

### Loading State
```jsx
const [loading, setLoading] = useState(true)

if (loading) {
  return <SkeletonLoader type="card" count={3} />
}

return <div>{/* Content */}</div>
```

### Success/Error Handling
```jsx
const { success, error } = useToast()

try {
  await saveData()
  success('Saved successfully!')
} catch (err) {
  error('Failed to save')
}
```

### Responsive Layout
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map((item, index) => (
    <AnimatedCard key={item.id} delay={index * 0.1}>
      {item.content}
    </AnimatedCard>
  ))}
</div>
```

---

## 🐛 Troubleshooting

### Animations not working?
- Check if CSS is imported in main.jsx
- Verify Tailwind is configured
- Check browser console for errors

### Toast not showing?
- Make sure ToastContainer is rendered
- Check if useToast hook is called
- Verify z-index (should be 50)

### Modal not closing?
- Check if onClose is provided
- Verify isOpen state is updating
- Check for JavaScript errors

---

## 📚 Full Documentation

See `UI_ENHANCEMENTS.md` for complete documentation.

---

**Happy coding! 🎨**
