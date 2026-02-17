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

function App() {
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
