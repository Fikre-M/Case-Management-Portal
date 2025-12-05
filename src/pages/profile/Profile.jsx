import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

function Profile() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <Card>
        <form>
          <Input label="Full Name" placeholder="Enter your name" />
          <Input label="Email" type="email" placeholder="Enter your email" />
          <Input label="Phone" type="tel" placeholder="Enter your phone" />
          <Input label="Current Password" type="password" placeholder="Enter current password" />
          <Input label="New Password" type="password" placeholder="Enter new password" />
          <Button type="submit">Update Profile</Button>
        </form>
      </Card>
    </div>
  )
}

export default Profile
