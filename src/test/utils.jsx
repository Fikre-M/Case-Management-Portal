import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { SecureAuthProvider } from '../context/SecureAuthContext'
import { ThemeProvider } from '../context/ThemeContext'
import { AppProvider } from '../context/AppContext'
import { ErrorProvider } from '../context/ErrorContext'

/**
 * Test data factories for consistent mock data
 */
export const createMockUser = (overrides = {}) => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  ...overrides
})

export const createMockAppointment = (overrides = {}) => ({
  id: 1,
  title: 'Test Appointment',
  clientName: 'Test Client',
  date: '2024-12-15',
  time: '14:00',
  status: 'scheduled',
  type: 'consultation',
  ...overrides
})

export const createMockCase = (overrides = {}) => ({
  id: 1,
  caseNumber: 'CASE-2024-001',
  title: 'Test Case',
  clientName: 'Test Client',
  status: 'active',
  priority: 'medium',
  type: 'consultation',
  ...overrides
})

/**
 * Enhanced render function with provider options
 */
export function renderWithProviders(
  ui,
  {
    route = '/',
    initialUser = null,
    theme = 'light',
    mockAppointments = [],
    mockCases = [],
    ...renderOptions
  } = {}
) {
  window.history.pushState({}, 'Test page', route)

  function TestWrapper({ children }) {
    return (
      <BrowserRouter>
        <ErrorProvider>
          <SecureAuthProvider initialUser={initialUser}>
            <ThemeProvider initialTheme={theme}>
              <AppProvider 
                initialAppointments={mockAppointments}
                initialCases={mockCases}
              >
                {children}
              </AppProvider>
            </ThemeProvider>
          </SecureAuthProvider>
        </ErrorProvider>
      </BrowserRouter>
    )
  }

  return render(ui, { wrapper: TestWrapper, ...renderOptions })
}

/**
 * Render with minimal providers for isolated testing
 */
export function renderWithAuth(ui, { initialUser = null, ...options } = {}) {
  function AuthWrapper({ children }) {
    return (
      <SecureAuthProvider initialUser={initialUser}>
        {children}
      </SecureAuthProvider>
    )
  }
  
  return render(ui, { wrapper: AuthWrapper, ...options })
}

/**
 * Render with router only
 */
export function renderWithRouter(ui, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route)
  return render(ui, { wrapper: BrowserRouter })
}

/**
 * Enhanced wait utility with better error handling
 */
export const waitForAsync = async (callback, options = {}) => {
  const { timeout = 5000, interval = 50 } = options
  const startTime = Date.now()
  
  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const result = await callback()
        if (result !== false) {
          resolve(result)
          return
        }
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(new Error(`Timeout after ${timeout}ms: ${error.message}`))
          return
        }
      }
      
      if (Date.now() - startTime >= timeout) {
        reject(new Error(`Timeout after ${timeout}ms`))
        return
      }
      
      setTimeout(check, interval)
    }
    
    check()
  })
}

/**
 * Mock localStorage for testing
 */
export const mockLocalStorage = () => {
  const store = {}
  
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index) => Object.keys(store)[index] || null)
  }
}

/**
 * Mock performance API for testing
 */
export const mockPerformance = () => ({
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => [])
})

/**
 * Custom matchers for better assertions
 */
export const customMatchers = {
  toBeAccessible: (received) => {
    // Basic accessibility checks
    const hasAriaLabel = received.getAttribute('aria-label')
    const hasRole = received.getAttribute('role')
    const hasTabIndex = received.getAttribute('tabindex')
    
    const pass = hasAriaLabel || hasRole || hasTabIndex !== '-1'
    
    return {
      message: () => `Expected element to be accessible`,
      pass
    }
  },
  
  toHaveValidationError: (received, expected) => {
    const errorElement = received.querySelector('[role="alert"], .error-message')
    const pass = errorElement && errorElement.textContent.includes(expected)
    
    return {
      message: () => `Expected validation error "${expected}" but got "${errorElement?.textContent || 'none'}"`,
      pass
    }
  }
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
