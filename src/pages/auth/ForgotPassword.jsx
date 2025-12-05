import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

function ForgotPassword() {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
      <p className="text-gray-600 text-center mb-6">
        Enter your email and we'll send you a reset link
      </p>
      <form>
        <Input label="Email" type="email" placeholder="Enter your email" required />
        <Button type="submit" className="w-full mb-4">Send Reset Link</Button>
      </form>
      <div className="text-center text-sm">
        <Link to="/login" className="text-primary-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </Card>
  )
}

export default ForgotPassword
