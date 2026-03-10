import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthInput from '../../components/forms/AuthInput'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import { validateEmail, validateRequired } from '../../utils/validators'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.email)) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setAlert(null);

    // Simulate API call delay
    setTimeout(() => {
      const result = login(formData.email, formData.password);
      setIsLoading(false);

      if (result.success) {
        setAlert({
          type: "success",
          message: "Login successful! Redirecting...",
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setAlert({ type: "error", message: result.message });
      }
    }, 1000);
  };

  return (
    <div className="w-full">
      {/* Logo/Brand */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mb-2">
          <span className="text-xl">🤖</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">AI Case Manager</h2>
        <p className="text-gray-600 text-xs">
          Sign in / create your account
        </p>
      </div>

      {/* Alert */}
      {alert && (
        <div className="mb-3">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
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

        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-3 h-3 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-1 text-xs text-gray-600">Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <Button
            type="submit"
            className="w-full sm:flex-1 py-2 text-sm font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <button
            type="button"
            className="w-full sm:flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="mr-1 text-sm">🔵</span>
            <span className="text-sm font-medium text-gray-700">
              Google
            </span>
          </button>
        </div>
      </form>

      {/* Sign Up Link */}
      <p className="text-center text-xs text-gray-600 mb-3">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          Sign up for free
        </Link>
      </p>

      {/* Demo Credentials - Clickable */}
      <div 
        className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => {
          const demoData = {
            email: 'demo@example.com',
            password: 'password'
          }
          setFormData(demoData)
          // Auto-submit after filling demo credentials
          setTimeout(() => {
            handleSubmit({ preventDefault: () => {} })
          }, 500)
        }}
      >
        <p className="text-xs text-blue-800 font-medium mb-1 flex items-center">
          <span className="mr-1">⚡</span>
          Quick Demo Login (Click to login instantly)
        </p>
        <p className="text-xs text-blue-700">Email: demo@example.com</p>
        <p className="text-xs text-blue-700">Password: password</p>
      </div>
    </div>
  );
}

export default Login
