import PropTypes from 'prop-types'
import Button from './Button'
import Alert from './Alert'

function ErrorState({ 
  error, 
  onRetry, 
  title = 'Something went wrong',
  showDetails = false,
  className = ''
}) {
  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    return 'An unexpected error occurred. Please try again.'
  }

  return (
    <div className={`py-8 px-4 ${className}`} role="alert" aria-live="assertive">
      <div className="max-w-md mx-auto text-center">
        <div className="text-red-500 text-5xl mb-4" role="img" aria-label="Error icon">
          ⚠️
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {getErrorMessage(error)}
        </p>
        
        {onRetry && (
          <Button onClick={onRetry} className="mb-4" aria-label="Retry action">
            🔄 Try Again
          </Button>
        )}

        {showDetails && error && typeof error === 'object' && (
          <div className="mt-4">
            <Alert 
              type="error" 
              message={
                <pre className="text-xs text-left overflow-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              } 
            />
          </div>
        )}
      </div>
    </div>
  )
}

ErrorState.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      message: PropTypes.string,
    }),
    PropTypes.object,
  ]),
  onRetry: PropTypes.func,
  title: PropTypes.string,
  showDetails: PropTypes.bool,
  className: PropTypes.string,
}

export default ErrorState
