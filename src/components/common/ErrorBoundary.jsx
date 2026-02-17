import { Component } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import Button from './Button'
import Card from './Card'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
    
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Production Error:', error, errorInfo)
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    } else {
      console.error('Development Error:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetError: this.handleReset
        })
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Card className="max-w-md w-full text-center" hover={false}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="text-red-500 text-6xl mb-4"
                role="img"
                aria-label="Error icon"
              >
                ⚠️
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
              >
                {this.props.title || 'Something went wrong'}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 dark:text-gray-400 mb-6"
              >
                {this.props.message || "We're sorry, but something unexpected happened. Your data is safe."}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full"
                  variant="primary"
                  aria-label="Refresh page"
                >
                  🔄 Refresh Page
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={this.handleReset}
                  className="w-full"
                  aria-label="Try again"
                >
                  🔁 Try Again
                </Button>
              </motion.div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <motion.details
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 text-left"
                >
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    🔍 Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto border border-gray-200 dark:border-gray-700 max-h-64">
                    <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                    {'\n\n'}
                    <strong>Component Stack:</strong>
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </motion.details>
              )}
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xs text-gray-500 dark:text-gray-400 mt-4"
              >
                If this problem persists, please contact support.
              </motion.p>
            </Card>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  onError: PropTypes.func,
  onReset: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
}

export default ErrorBoundary
