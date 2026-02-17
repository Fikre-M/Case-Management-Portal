import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { ThemeProvider } from '../context/ThemeContext'
import { AppProvider } from '../context/AppContext'
import { ErrorProvider } from '../context/ErrorContext'

/**
 * Custom render function that wraps components with all providers
 */
export function renderWithProviders(
  ui,
  {
    route = '/',
    ...renderOptions
  } = {}
) {
  window.history.pushState({}, 'Test page', route)

  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <ErrorProvider>
          <AuthProvider>
            <ThemeProvider>
              <AppProvider>
                {children}
              </AppProvider>
            </ThemeProvider>
          </AuthProvider>
        </ErrorProvider>
      </BrowserRouter>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Custom render with only specific providers
 */
export function renderWithRouter(ui, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route)

  return render(ui, { wrapper: BrowserRouter })
}

/**
 * Wait for async operations
 */
export const waitFor = (callback, options) => {
  return new Promise((resolve) => {
    const check = () => {
      try {
        callback()
        resolve()
      } catch (error) {
        setTimeout(check, options?.interval || 50)
      }
    }
    check()
  })
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
