import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

function Login() {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form>
        <Input label="Email" type="email" placeholder="Enter your email" required />
        <Input label="Password" type="password" placeholder="Enter your password" required />
        <Button type="submit" className="w-full mb-4">Login</Button>
      </form>
      <div className="text-center text-sm">
        <Link to="/forgot-password" className="text-primary-600 hover:underline">
          Forgot Password?
        </Link>
        <div className="mt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default Login
