import Button from './Button'

function EmptyState({ 
  icon = '📋', 
  title = 'No data found', 
  description = 'There are no items to display at the moment.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="text-6xl mb-4" role="img" aria-label="Empty state icon">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState