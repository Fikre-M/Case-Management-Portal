import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthInput from '../../components/forms/AuthInput'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'
import { validateEmail, validatePassword, validateRequired } from '../../utils/validators'
import { useAuth } from '../../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register, isAuthenticated, isLoading: authLoading } = useAuth()
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

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

    if (!validateRequired(formData.fullName)) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!validateRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
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
      const result = register(formData);
      setIsLoading(false);

      if (result.success) {
        setAlert({
          type: "success",
          message: "Account created successfully! Redirecting...",
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setAlert({ type: "error", message: result.message });
      }
    }, 1500);
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { strength: 1, label: "Weak", color: "bg-red-500" },
      { strength: 2, label: "Fair", color: "bg-orange-500" },
      { strength: 3, label: "Good", color: "bg-yellow-500" },
      { strength: 4, label: "Strong", color: "bg-green-500" },
      { strength: 5, label: "Very Strong", color: "bg-green-600" },
    ];

    return levels[strength - 1] || { strength: 0, label: "", color: "" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="w-full">
      {/* Logo/Brand */}
      <div className="text-center mb-4">
        <Link 
          to="/landing"
          className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full mb-2 hover:bg-primary-200 transition-colors"
          title="Back to Landing Page"
        >
          <span className="text-xl">🤖</span>
        </Link>
        <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 text-xs">
          Start managing your appointments today
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
      <form ref={formRef} onSubmit={handleSubmit}>
        {/* Name and Email Side by Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <AuthInput
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
            icon="👤"
          />
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
        </div>

        {/* Password and Confirm Password Side by Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
          <AuthInput
            label="Password"
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            icon="🔒"
          />
          <AuthInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            icon="🔒"
          />
        </div>

        {/* Password Strength Indicator - Compact */}
        {formData.password && (
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">Strength</span>
              <span className={`text-xs font-medium ${
                passwordStrength.strength <= 2 ? 'text-red-600' : 
                passwordStrength.strength <= 3 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Terms and Conditions - Compact */}
        <div className="mb-2">
          <label className="flex items-start">
            <input
              type="checkbox"
              className="w-3 h-3 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <span className="ml-2 text-xs text-gray-600">
              I agree to{" "}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                Terms
              </Link>{" & "}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                Privacy
              </Link>
            </span>
          </label>
          {errors.agreedToTerms && (
            <p className="mt-1 text-xs text-red-600">{errors.agreedToTerms}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full py-2 text-sm font-semibold mb-2"
          disabled={isLoading || !agreedToTerms}
        >
          {isLoading ? "Creating..." : "Create Account"}
        </Button>
      </form>

      {/* Sign In Link */}
      <p className="text-center text-xs text-gray-600 mb-2">
        Have an account?{" "}
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          Sign in
        </Link>
      </p>

      {/* Divider - Compact */}
      <div className="relative mb-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      {/* Social Sign Up - Compact */}
      <div className="space-y-2">
        <button
          type="button"
          className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="mr-1 text-sm">🔵</span>
          <span className="text-sm font-medium text-gray-700">
            Google
          </span>
        </button>
        
        {/* Quick Demo Option */}
        <div 
          className="p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => {
            const demoData = {
              fullName: 'Demo User',
              email: 'demo@example.com',
              password: 'password',
              confirmPassword: 'password'
            }
            setFormData(demoData)
            setAgreedToTerms(true)
            // Auto-submit after form is updated and re-rendered
            setTimeout(() => {
              if (formRef.current) {
                formRef.current.requestSubmit()
              }
            }, 100)
          }}
        >
          <p className="text-xs text-blue-800 font-medium mb-1 flex items-center">
            <span className="mr-1">⚡</span>
            Quick Demo Account (Click to create & login)
          </p>
          <p className="text-xs text-blue-700">Auto-fills demo data and creates account</p>
        </div>
      </div>
    </div>
  );
}

export default Register
