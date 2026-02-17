# PropTypes Implementation Guide

## Overview

PropTypes provide runtime type checking for React component props, helping catch bugs early and improving IDE support. This guide documents the PropTypes implementation across the AidFlow application.

## Why PropTypes?

- **Bug Prevention**: Catch type errors during development
- **Better IDE Support**: Enhanced autocomplete and IntelliSense
- **Documentation**: Props serve as inline documentation
- **Team Collaboration**: Clear contracts for component usage
- **Easier Debugging**: Clear error messages when props are incorrect

## Installation

PropTypes is already installed in this project:

```bash
npm install prop-types
```

## Basic Usage

### 1. Import PropTypes

```javascript
import PropTypes from 'prop-types'
```

### 2. Define PropTypes

Add PropTypes validation after your component definition:

```javascript
function MyComponent({ name, age, isActive }) {
  return <div>{name}</div>
}

MyComponent.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  isActive: PropTypes.bool,
}
```

## Common PropTypes Patterns

### Basic Types

```javascript
ComponentName.propTypes = {
  // Primitives
  stringProp: PropTypes.string,
  numberProp: PropTypes.number,
  boolProp: PropTypes.bool,
  funcProp: PropTypes.func,
  arrayProp: PropTypes.array,
  objectProp: PropTypes.object,
  
  // React elements
  children: PropTypes.node,
  element: PropTypes.element,
  
  // Required props
  requiredProp: PropTypes.string.isRequired,
}
```

### Advanced Types

```javascript
ComponentName.propTypes = {
  // Specific values (enum)
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  
  // Multiple types
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  
  // Array of specific type
  items: PropTypes.arrayOf(PropTypes.string),
  
  // Object with specific shape
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
  }),
  
  // Object with any keys of specific type
  metadata: PropTypes.objectOf(PropTypes.string),
  
  // Custom validator
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}`
      )
    }
  },
}
```

## Implemented Components

### Context Providers

All context providers now have PropTypes:

```javascript
// AuthContext.jsx
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// AppContext.jsx
AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// ThemeContext.jsx
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
```

### Common Components

#### Button Component

```javascript
Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  'aria-label': PropTypes.string,
}
```

#### Card Component

```javascript
Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  hover: PropTypes.bool,
}
```

#### Badge Component

```javascript
Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'danger', 'info']),
}
```

#### Input Component

```javascript
Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  required: PropTypes.bool,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  'aria-describedby': PropTypes.string,
}
```

#### Alert Component

```javascript
Alert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  autoClose: PropTypes.bool,
  autoCloseDelay: PropTypes.number,
  className: PropTypes.string,
}
```

#### Modal Component

```javascript
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
}
```

#### LoadingSpinner Component

```javascript
LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'white', 'gray']),
  className: PropTypes.string,
  label: PropTypes.string,
}
```

### Form Components

#### AuthInput Component

```javascript
AuthInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  icon: PropTypes.node,
}
```

## Best Practices

### 1. Always Validate Props

Add PropTypes to every component that receives props:

```javascript
// ✅ Good
function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

// ❌ Bad - No validation
function Button({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}
```

### 2. Mark Required Props

Use `.isRequired` for props that must be provided:

```javascript
ComponentName.propTypes = {
  id: PropTypes.number.isRequired,  // Must be provided
  name: PropTypes.string,            // Optional
}
```

### 3. Be Specific with Types

Use specific types instead of generic ones:

```javascript
// ✅ Good - Specific
variant: PropTypes.oneOf(['primary', 'secondary', 'danger'])

// ❌ Bad - Too generic
variant: PropTypes.string
```

### 4. Use Shape for Objects

Define object structures with `shape`:

```javascript
// ✅ Good
user: PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
})

// ❌ Bad
user: PropTypes.object
```

### 5. Document Complex Props

Add comments for complex prop requirements:

```javascript
ComponentName.propTypes = {
  // Callback fired when user clicks submit
  // Signature: (formData: object) => void
  onSubmit: PropTypes.func.isRequired,
  
  // Array of menu items with id, label, and optional icon
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
}
```

## Adding PropTypes to New Components

### Step-by-Step Process

1. **Import PropTypes**
   ```javascript
   import PropTypes from 'prop-types'
   ```

2. **Identify all props** your component receives

3. **Add PropTypes definition** after component

4. **Test** by passing incorrect props in development

### Example Workflow

```javascript
// 1. Create component
function UserCard({ user, onEdit, onDelete }) {
  return (
    <div>
      <h3>{user.name}</h3>
      <button onClick={() => onEdit(user.id)}>Edit</button>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  )
}

// 2. Add PropTypes
UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default UserCard
```

## Remaining Components to Update

The following components still need PropTypes added:

### AI Components
- `ChatMessage.jsx` - Message display component
- `InputBar.jsx` - Chat input component

### Feature Components
- `AppointmentCard.jsx` - Appointment display
- `CaseCard.jsx` - Case display
- `AppointmentChart.jsx` - Chart component
- `CaseStatusChart.jsx` - Chart component

### Navigation Components
- `Sidebar.jsx` - Main navigation
- `Topbar.jsx` - Top navigation bar

## ESLint Configuration

The project is configured to enforce PropTypes validation:

```javascript
// .eslintrc.cjs
rules: {
  'react/prop-types': 'error', // Enforce PropTypes
}
```

Run linting to check for missing PropTypes:

```bash
npm run lint
```

## Migration to TypeScript (Future)

While PropTypes provide runtime validation, TypeScript offers compile-time type checking. Consider migrating to TypeScript for:

- Stronger type safety
- Better IDE support
- Compile-time error detection
- Improved refactoring capabilities

## Resources

- [PropTypes Documentation](https://reactjs.org/docs/typechecking-with-proptypes.html)
- [prop-types Package](https://www.npmjs.com/package/prop-types)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## Summary

PropTypes have been added to:
- ✅ All Context Providers (AuthContext, AppContext, ThemeContext)
- ✅ Core Common Components (Button, Card, Badge, Input, Alert, Modal, LoadingSpinner)
- ✅ Form Components (AuthInput)

This provides a solid foundation for type safety and better developer experience. Continue adding PropTypes to remaining components following the patterns documented here.
