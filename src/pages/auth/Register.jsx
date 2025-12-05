import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

function Register() {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
      <form>
        <Input label="Full Name" placeholder="Enter your name" required />
        <Input label="Email" type="email" placeholder="Enter your email" required />
        <Input label="Password" type="password" placeholder="Create a password" required />
        <Input label="Confirm Password" type="password" placeholder="Confirm your password" required />
        <Button type="submit" className="w-full mb-4">Register</Button>
      </form>
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:underline">
          Login
        </Link>
      </div>
    </Card>
  )
}

export default Register
