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
    <div className={`py-8 px-4 ${className}`}>
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
          <Button onClick={onRetry} className="mb-4">
            Try Again
          </Button>
        )}

        {showDetails && error && typeof error === 'object' && (
          <Alert type="error" message={JSON.stringify(error, null, 2)} />
        )}
      </div>
    </div>
  )
}

export default ErrorState