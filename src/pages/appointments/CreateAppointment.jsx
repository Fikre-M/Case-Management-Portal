import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

function CreateAppointment() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Appointment</h1>
      <Card>
        <form>
          <Input label="Client Name" placeholder="Select or enter client name" required />
          <Input label="Date" type="date" required />
          <Input label="Time" type="time" required />
          <Input label="Duration" placeholder="e.g., 30 minutes" required />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              className="input-field"
              rows="4"
              placeholder="Add any notes..."
            ></textarea>
          </div>
          <div className="flex space-x-4">
            <Button type="submit">Create Appointment</Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default CreateAppointment
