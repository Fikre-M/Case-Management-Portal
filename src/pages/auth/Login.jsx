import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthInput from '../../components/forms/AuthInput'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import { validateEmail, validateRequired } from '../../utils/validators'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setAlert(null)

    // Simulate API call delay
    setTimeout(() => {
      const result = login(formData.email, formData.password)
      setIsLoading(false)
      
      if (result.success) {
        setAlert({ type: 'success', message: 'Login successful! Redirecting...' })
        setTimeout(() => navigate('/dashboard'), 1500)
      } else {
        setAlert({ type: 'error', message: result.message })
      }
    }, 1000)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <span className="text-3xl">🤖</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <AuthInput
            label="Email Address"
            type="email"
            name="email"
            placeholder="your-email@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            icon="📧"
          />

          <AuthInput
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            icon="🔒"
          />

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Forgot Password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full py-3 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="mr-2">🔵</span>
            <span className="text-sm font-medium text-gray-700">Google</span>
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="mr-2">⚫</span>
            <span className="text-sm font-medium text-gray-700">Microsoft</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
            Sign up for free
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800 font-medium mb-1">Demo Credentials:</p>
          <p className="text-xs text-blue-700">Email: demo@example.com</p>
          <p className="text-xs text-blue-700">Password: password</p>
        </div>
      </div>
    </div>
  )
}

export default Login
