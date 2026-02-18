import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { AppProvider } from './context/AppContext'
import { ErrorProvider } from './context/ErrorContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import GlobalErrorDisplay from './components/common/GlobalErrorDisplay'
import PerformanceMonitor from './components/common/PerformanceMonitor'
import AuthDebugger from './components/common/AuthDebugger'
import AppRoutes from './routes/AppRoutes'
import { useWebVitals } from './hooks/useWebVitals'
import { useEffect } from 'react'

/**
 * Main App component with 2026 performance monitoring
 * 
 * Integrates Web Vitals monitoring and performance optimization
 * for modern web standards compliance.
 * 
 * @component
 * @returns {JSX.Element} Main application component
 */
function App() {
  const { vitals, isGoodPerformance } = useWebVitals()

  // Log performance status in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Performance Status:', {
        isGoodPerformance,
        vitals: Object.entries(vitals)
          .filter(([_, value]) => value !== null)
          .reduce((acc, [key, value]) => ({
            ...acc,
            [key]: `${value.value}${key === 'CLS' ? '' : 'ms'} (${value.rating})`
          }), {})
      })
    }
  }, [vitals, isGoodPerformance])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ErrorProvider>
          <AuthProvider>
            <ThemeProvider>
              <AppProvider>
                <AppRoutes />
                <GlobalErrorDisplay />
                <PerformanceMonitor />
                <AuthDebugger />
              </AppProvider>
            </ThemeProvider>
          </AuthProvider>
        </ErrorProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
