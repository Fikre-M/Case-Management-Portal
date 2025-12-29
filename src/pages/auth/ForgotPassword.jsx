import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthInput from '../../components/forms/AuthInput'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import { validateEmail, validateRequired } from '../../utils/validators'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [emailSent, setEmailSent] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
    if (error) {
      setError('')
    }
  }

  const validateForm = () => {
    if (!validateRequired(email)) {
      setError('Email is required')
      return false
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setAlert(null)

    // Mock password reset - simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setEmailSent(true)
      setAlert({ 
        type: 'success', 
        message: 'Password reset link has been sent to your email!' 
      })
    }, 1500)
  }

  const handleResend = () => {
    setIsLoading(true)
    setAlert(null)

    setTimeout(() => {
      setIsLoading(false)
      setAlert({ 
        type: 'success', 
        message: 'Reset link resent successfully!' 
      })
    }, 1000)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <span className="text-3xl">{emailSent ? '✉️' : '🔑'}</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {emailSent ? 'Check Your Email' : 'Forgot Password?'}
          </h2>
          <p className="text-gray-600 mt-2">
            {emailSent 
              ? `We've sent a password reset link to ${email}`
              : "No worries, we'll send you reset instructions"
            }
          </p>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-6">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          </div>
        )}

        {!emailSent ? (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit}>
              <AuthInput
                label="Email Address"
                type="email"
                name="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={handleChange}
                error={error}
                required
                icon="📧"
              />

              <Button 
                type="submit" 
                className="w-full py-3 text-base font-semibold mb-4"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            {/* Back to Login */}
            <Link 
              to="/login" 
              className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              <span className="mr-2">←</span>
              Back to Login
            </Link>
          </>
        ) : (
          <>
            {/* Email Sent Success State */}
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-green-400 text-xl">✓</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Email sent successfully
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Please check your inbox and click the reset link.</p>
                      <p className="mt-1">The link will expire in 1 hour.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Didn't receive the email?
                </h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Check your spam or junk folder</li>
                  <li>Make sure you entered the correct email</li>
                  <li>Wait a few minutes for the email to arrive</li>
                </ul>
              </div>

              {/* Resend Button */}
              <Button 
                onClick={handleResend}
                variant="secondary"
                className="w-full py-3 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Resending...' : 'Resend Email'}
              </Button>

              {/* Back to Login */}
              <Link 
                to="/login" 
                className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                <span className="mr-2">←</span>
                Back to Login
              </Link>
            </div>
          </>
        )}

        {/* Help Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Need help?{' '}
            <Link to="/support" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
