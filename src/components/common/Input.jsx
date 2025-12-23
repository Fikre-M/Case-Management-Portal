import { useState, useId } from 'react'

function Input({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  error,
  disabled = false,
  className = '',
  'aria-describedby': ariaDescribedBy,
  ...props
}) {
  const [focused, setFocused] = useState(false)
  const id = useId()
  const errorId = `${id}-error`
  const helpId = `${id}-help`

  const inputClasses = `
    w-full px-3 py-2 border rounded-lg transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
    dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:disabled:bg-gray-700
    ${error 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 dark:border-gray-600'
    }
    ${className}
  `

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label} 
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">*</span>
          )}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={inputClasses}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[
          error ? errorId : null,
          ariaDescribedBy,
        ].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      {error && (
        <p 
          id={errorId}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
