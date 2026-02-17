# Testing Guide

## Overview

The AidFlow application uses Vitest and React Testing Library for comprehensive unit and integration testing. This guide covers testing setup, patterns, and best practices.

## Testing Stack

- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom matchers for DOM
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM implementation for Node.js

## Setup

### Installation

All testing dependencies are already installed:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

### Configuration

**vitest.config.js** - Main configuration file
- Configures jsdom environment
- Sets up coverage reporting
- Defines test file patterns

**src/test/setup.js** - Test setup file
- Imports jest-dom matchers
- Mocks browser APIs (matchMedia, localStorage, IntersectionObserver)
- Configures cleanup after each test

**src/test/utils.jsx** - Custom test utilities
- `renderWithProviders` - Renders with all app providers
- `renderWithRouter` - Renders with router only
- Re-exports testing library utilities

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test Button.test.jsx

# Run tests matching pattern
npm test -- --grep "Button"
```

## Test Structure

### File Organization

```
src/
├── components/
│   └── common/
│       ├── Button.jsx
│       └── __tests__/
│           └── Button.test.jsx
├── context/
│   ├── ErrorContext.jsx
│   └── __tests__/
│       └── ErrorContext.test.jsx
├── hooks/
│   ├── useErrorHandler.js
│   └── __tests__/
│       └── useErrorHandler.test.jsx
├── services/
│   ├── api.js
│   └── __tests__/
│       └── api.test.js
└── test/
    ├── setup.js
    └── utils.jsx
```

### Test File Naming

- Component tests: `ComponentName.test.jsx`
- Hook tests: `useHookName.test.jsx`
- Service tests: `serviceName.test.js`
- Utility tests: `utilityName.test.js`

## Testing Patterns

### 1. Component Testing

```javascript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button Component', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByText('Click me'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
})
```

### 2. Hook Testing

```javascript
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ErrorProvider } from '../../context/ErrorContext'
import { useErrorHandler } from '../useErrorHandler'

describe('useErrorHandler', () => {
  const wrapper = ({ children }) => <ErrorProvider>{children}</ErrorProvider>

  it('should provide error handler utilities', () => {
    const { result } = renderHook(() => useErrorHandler('Test'), { wrapper })

    expect(result.current).toHaveProperty('addError')
    expect(result.current).toHaveProperty('showSuccess')
  })

  it('should handle async operations', async () => {
    const { result } = renderHook(() => useErrorHandler('Test'), { wrapper })

    const asyncFn = vi.fn().mockResolvedValue('success')

    await act(async () => {
      await result.current.handleAsync(asyncFn)
    })

    expect(asyncFn).toHaveBeenCalled()
  })
})
```

### 3. Context Testing

```javascript
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ErrorProvider, useError } from '../ErrorContext'

describe('ErrorContext', () => {
  const wrapper = ({ children }) => <ErrorProvider>{children}</ErrorProvider>

  it('should add error to state', () => {
    const { result } = renderHook(() => useError(), { wrapper })

    act(() => {
      result.current.addError('Test error')
    })

    expect(result.current.errors).toHaveLength(1)
    expect(result.current.errors[0].message).toBe('Test error')
  })

  it('should clear all errors', () => {
    const { result } = renderHook(() => useError(), { wrapper })

    act(() => {
      result.current.addError('Error 1')
      result.current.addError('Error 2')
    })

    expect(result.current.errors).toHaveLength(2)

    act(() => {
      result.current.clearErrors()
    })

    expect(result.current.errors).toHaveLength(0)
  })
})
```

### 4. Service Testing

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { appointmentService } from '../appointmentService'
import * as api from '../api'

vi.mock('../api', () => ({
  default: vi.fn(),
  simulateNetworkDelay: vi.fn(() => Promise.resolve()),
  isMockMode: vi.fn(() => true),
}))

describe('Appointment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return all appointments', async () => {
    const appointments = await appointmentService.getAll()
    
    expect(Array.isArray(appointments)).toBe(true)
    expect(api.simulateNetworkDelay).toHaveBeenCalled()
  })

  it('should create appointment', async () => {
    const newAppointment = {
      title: 'New Appointment',
      date: '2024-01-01',
    }

    const result = await appointmentService.create(newAppointment)

    expect(result).toMatchObject(newAppointment)
    expect(result.id).toBeDefined()
  })
})
```

### 5. Testing with Providers

```javascript
import { renderWithProviders } from '../../test/utils'

describe('Component with Context', () => {
  it('should access context values', () => {
    renderWithProviders(<MyComponent />)
    // Component has access to all providers
  })
})
```

## Common Testing Scenarios

### Testing User Interactions

```javascript
it('should handle form submission', async () => {
  const onSubmit = vi.fn()
  const user = userEvent.setup()

  render(<Form onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText('Email'), 'test@example.com')
  await user.type(screen.getByLabelText('Password'), 'password123')
  await user.click(screen.getByText('Submit'))

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  })
})
```

### Testing Async Operations

```javascript
it('should load data on mount', async () => {
  render(<DataList />)

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  // Check data is displayed
  expect(screen.getByText('Item 1')).toBeInTheDocument()
})
```

### Testing Error States

```javascript
it('should display error message', async () => {
  const mockFetch = vi.fn().mockRejectedValue(new Error('Failed to load'))
  global.fetch = mockFetch

  render(<DataList />)

  await waitFor(() => {
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })
})
```

### Testing Conditional Rendering

```javascript
it('should show empty state when no data', () => {
  render(<DataList items={[]} />)
  expect(screen.getByText('No items found')).toBeInTheDocument()
})

it('should show data when items exist', () => {
  const items = [{ id: 1, name: 'Item 1' }]
  render(<DataList items={items} />)
  expect(screen.getByText('Item 1')).toBeInTheDocument()
})
```

### Testing Accessibility

```javascript
it('should have proper ARIA attributes', () => {
  render(<Button>Click me</Button>)
  const button = screen.getByRole('button')
  
  expect(button).toHaveAttribute('aria-label')
})

it('should be keyboard accessible', async () => {
  const onClick = vi.fn()
  const user = userEvent.setup()

  render(<Button onClick={onClick}>Click me</Button>)
  
  await user.tab() // Focus button
  await user.keyboard('{Enter}') // Press Enter
  
  expect(onClick).toHaveBeenCalled()
})
```

## Mocking

### Mocking Modules

```javascript
vi.mock('../api', () => ({
  default: vi.fn(),
  simulateNetworkDelay: vi.fn(() => Promise.resolve()),
}))
```

### Mocking Functions

```javascript
const mockFn = vi.fn()
mockFn.mockReturnValue('value')
mockFn.mockResolvedValue('async value')
mockFn.mockRejectedValue(new Error('error'))
```

### Mocking Timers

```javascript
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.restoreAllMocks()
})

it('should auto-dismiss after timeout', () => {
  render(<Toast message="Test" />)
  
  act(() => {
    vi.advanceTimersByTime(5000)
  })
  
  expect(screen.queryByText('Test')).not.toBeInTheDocument()
})
```

### Mocking localStorage

```javascript
beforeEach(() => {
  localStorage.clear()
  localStorage.setItem.mockClear()
})

it('should save to localStorage', () => {
  render(<Component />)
  
  expect(localStorage.setItem).toHaveBeenCalledWith('key', 'value')
})
```

## Best Practices

### 1. Test Behavior, Not Implementation

```javascript
// ✅ Good - Tests behavior
it('should display error message when form is invalid', () => {
  render(<Form />)
  fireEvent.submit(screen.getByRole('form'))
  expect(screen.getByText('Email is required')).toBeInTheDocument()
})

// ❌ Bad - Tests implementation
it('should set error state to true', () => {
  const { result } = renderHook(() => useForm())
  act(() => result.current.validate())
  expect(result.current.hasError).toBe(true)
})
```

### 2. Use Accessible Queries

```javascript
// ✅ Good - Accessible queries
screen.getByRole('button', { name: 'Submit' })
screen.getByLabelText('Email')
screen.getByText('Welcome')

// ❌ Bad - Implementation details
screen.getByClassName('submit-button')
screen.getByTestId('email-input')
```

### 3. Avoid Testing Third-Party Libraries

```javascript
// ✅ Good - Test your code
it('should call service with correct data', async () => {
  await appointmentService.create(data)
  expect(mockApi).toHaveBeenCalledWith('/appointments', data)
})

// ❌ Bad - Testing React Router
it('should navigate to /dashboard', () => {
  // Don't test that React Router works
})
```

### 4. Keep Tests Simple and Focused

```javascript
// ✅ Good - One assertion per test
it('should render button text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})

it('should call onClick when clicked', async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Click me</Button>)
  await userEvent.click(screen.getByText('Click me'))
  expect(onClick).toHaveBeenCalled()
})

// ❌ Bad - Multiple unrelated assertions
it('should work correctly', () => {
  // Too many things tested at once
})
```

### 5. Use Descriptive Test Names

```javascript
// ✅ Good
it('should display error message when email is invalid')
it('should disable submit button while loading')
it('should call onSuccess callback after successful submission')

// ❌ Bad
it('works')
it('test 1')
it('should work correctly')
```

## Coverage Goals

Aim for the following coverage targets:

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

Priority areas for testing:
1. Business logic (services, utilities)
2. Custom hooks
3. Context providers
4. Complex components
5. Error handling

## Continuous Integration

Tests should run automatically on:
- Pre-commit (via git hooks)
- Pull requests
- Main branch pushes
- Before deployment

## Debugging Tests

### Run Single Test

```bash
npm test -- Button.test.jsx
```

### Run with UI

```bash
npm run test:ui
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal"
}
```

### View Coverage Report

```bash
npm run test:coverage
open coverage/index.html
```

## Summary

The testing infrastructure provides:

✅ **Fast test execution** with Vitest
✅ **Comprehensive utilities** for component testing
✅ **Mocking capabilities** for services and APIs
✅ **Coverage reporting** to track test quality
✅ **Accessible testing** with React Testing Library
✅ **Custom utilities** for provider wrapping
✅ **Best practices** documentation
✅ **CI/CD ready** configuration

Write tests for all new features and maintain high coverage to ensure application reliability.
