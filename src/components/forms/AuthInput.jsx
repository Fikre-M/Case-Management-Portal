import PropTypes from 'prop-types'

function AuthInput({ 
  label, 
  type = 'text', 
  name,
  placeholder, 
  value, 
  onChange, 
  error,
  required = false,
  icon
}) {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-3 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

AuthInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  icon: PropTypes.node,
}

export default AuthInput
