import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

function Settings() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <Card title="General Settings">
          <Input label="Application Name" placeholder="Enter app name" />
          <Input label="Time Zone" placeholder="Select time zone" />
          <Button>Save Changes</Button>
        </Card>
        
        <Card title="Notification Settings">
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Email notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Push notifications</span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Settings
