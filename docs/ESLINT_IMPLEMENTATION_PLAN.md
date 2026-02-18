# ESLint Implementation Plan

## Phase 1: Critical Bug Fixes (Week 1)

### 1. Fix React Hooks Dependencies
**Priority: CRITICAL** - These can cause actual bugs

```bash
# Focus on these files first:
src/hooks/useAsync.js
src/hooks/useDraggable.js  
src/hooks/useFetch.js
src/hooks/usePerformance.js
src/hooks/useToast.js
src/context/ErrorContext.jsx
```

**Common Fixes:**
```jsx
// ❌ Bad - Missing dependency
useEffect(() => {
  fetchData()
}, []) // Missing fetchData dependency

// ✅ Good - Include all dependencies
useEffect(() => {
  fetchData()
}, [fetchData])

// ✅ Better - Memoize function
const fetchData = useCallback(() => {
  // fetch logic
}, [dependency])
```

### 2. Fix Unused Variables
**Priority: HIGH** - Clean up dead code

```bash
# Remove unused imports and variables
src/components/forms/AppointmentForm.jsx  # Remove unused Input, Alert
src/pages/reports/Reports.jsx             # Remove unused Loading, appointments, cases
src/layouts/AuthLayout.jsx                # Remove unused handleGoogleLogin
```

### 3. Fix React Hooks Rules Violations
**Priority: CRITICAL** - These break React rules

```jsx
// ❌ Bad - Conditional hooks in Register.jsx
if (someCondition) {
  const [state, setState] = useState()
}

// ✅ Good - Always call hooks at top level
const [state, setState] = useState()
// Use conditional logic inside useEffect or render
```

## Phase 2: PropTypes Validation (Week 2)

### Add PropTypes to High-Traffic Components

**Priority Order:**
1. `src/components/common/` - Reusable components
2. `src/components/appointments/` - Core business logic
3. `src/components/cases/` - Core business logic
4. `src/pages/` - Page components

**Example Implementation:**
```jsx
// src/components/common/Button.jsx
import PropTypes from 'prop-types'

function Button({ children, variant, size, onClick, disabled, loading }) {
  // Component implementation
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool
}

Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
  disabled: false,
  loading: false
}
```

## Phase 3: JSDoc Documentation (Week 3-4)

### Documentation Priority

**High Priority (Week 3):**
- Context providers and hooks (`src/context/`)
- Custom hooks (`src/hooks/`)
- Service layer (`src/services/`)
- Utility functions (`src/utils/`)

**Medium Priority (Week 4):**
- Reusable components (`src/components/common/`)
- Form components (`src/components/forms/`)
- Page components (`src/pages/`)

**JSDoc Templates:**
```jsx
/**
 * Custom hook for managing appointments
 * 
 * Provides CRUD operations and filtering for appointments with
 * automatic error handling and loading states.
 * 
 * @returns {Object} Hook return value
 * @returns {Array<Object>} returns.appointments - Array of appointments
 * @returns {boolean} returns.loading - Loading state
 * @returns {Function} returns.createAppointment - Create function
 * @returns {Function} returns.updateAppointment - Update function
 * @returns {Function} returns.deleteAppointment - Delete function
 * 
 * @example
 * function AppointmentsList() {
 *   const { appointments, loading, createAppointment } = useAppointments()
 *   
 *   if (loading) return <Loading />
 *   
 *   return (
 *     <div>
 *       {appointments.map(apt => (
 *         <AppointmentCard key={apt.id} appointment={apt} />
 *       ))}
 *     </div>
 *   )
 * }
 */
```

## Phase 4: Code Quality Improvements (Week 5)

### 1. Remove Console Statements
```jsx
// ❌ Remove from production code
console.log('Debug info')

// ✅ Use proper logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info')
}

// ✅ Better - Use error handling context
const { addError } = useError()
addError('Something went wrong', { context: 'AppointmentForm' })
```

### 2. Fix Nested Ternary Expressions
```jsx
// ❌ Hard to read
const status = loading ? 'Loading...' : error ? 'Error' : data ? 'Success' : 'Empty'

// ✅ More readable
const getStatus = () => {
  if (loading) return 'Loading...'
  if (error) return 'Error'
  if (data) return 'Success'
  return 'Empty'
}
const status = getStatus()
```

### 3. Fix Array Index Keys
```jsx
// ❌ Bad for performance
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}

// ✅ Use unique, stable keys
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// ✅ If no ID, create stable key
{items.map(item => (
  <div key={`${item.name}-${item.type}`}>{item.name}</div>
))}
```

## Implementation Scripts

### Quick Fix Script
```bash
# Run auto-fixes
npm run lint:fix

# Check remaining issues
npm run lint:strict

# Focus on specific file types
npx eslint src/hooks/ --fix
npx eslint src/context/ --fix
npx eslint src/components/common/ --fix
```

### Gradual Implementation
```bash
# Fix one directory at a time
npx eslint src/hooks/ --fix --max-warnings 0
npx eslint src/context/ --fix --max-warnings 0
npx eslint src/services/ --fix --max-warnings 0
```

## Success Metrics

### Week 1 Target
- ✅ 0 React Hooks dependency errors
- ✅ 0 unused variable errors  
- ✅ 0 React Hooks rules violations

### Week 2 Target
- ✅ PropTypes on all common components
- ✅ PropTypes on appointment/case components
- ✅ <50 total PropTypes errors

### Week 3-4 Target
- ✅ JSDoc on all hooks and contexts
- ✅ JSDoc on all service functions
- ✅ JSDoc on utility functions

### Week 5 Target
- ✅ <10 console statement warnings
- ✅ 0 nested ternary warnings
- ✅ <5 array index key warnings

## Final Goal
```bash
npm run lint:strict
# ✅ 0 errors, <20 warnings
```

## Tools and Resources

### VSCode Extensions
- ESLint (auto-fix on save)
- JSDoc Generator (auto-generate JSDoc templates)
- Error Lens (inline error display)

### Useful Commands
```bash
# Check specific rule
npx eslint src/ --rule "react-hooks/exhaustive-deps: error"

# Fix specific rule
npx eslint src/ --fix --rule "no-unused-vars: error"

# Generate JSDoc for file
# Use JSDoc Generator extension or manual templates
```

### Team Guidelines
1. **Always fix React Hooks errors immediately** - They can cause bugs
2. **Add PropTypes when creating new components** - Prevent runtime errors
3. **Write JSDoc for public APIs** - Help other developers
4. **Use ESLint auto-fix before committing** - Maintain consistency

This phased approach makes the 344 issues manageable while prioritizing the most critical problems first.