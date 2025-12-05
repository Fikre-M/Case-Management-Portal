import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

function CreateCase() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create Case</h1>
      <Card>
        <form>
          <Input label="Case Title" placeholder="Enter case title" required />
          <Input label="Client" placeholder="Select client" required />
          <Input label="Case Type" placeholder="Select case type" required />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="input-field"
              rows="4"
              placeholder="Enter case description..."
            ></textarea>
          </div>
          <div className="flex space-x-4">
            <Button type="submit">Create Case</Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default CreateCase
