import LoadingSpinner from './LoadingSpinner'

function Loading({ 
  message = 'Loading...', 
  size = 'lg',
  className = '' 
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size={size} />
      <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm">
        {message}
      </p>
    </div>
  )
}

export default Loading
