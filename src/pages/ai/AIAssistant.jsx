import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

function AIAssistant() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">AI Assistant</h1>
      <Card>
        <div className="space-y-4">
          <div className="h-96 bg-gray-50 rounded-lg p-4 overflow-y-auto">
            <p className="text-gray-500 text-center">Start a conversation with AI</p>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="input-field flex-1"
            />
            <Button>Send</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AIAssistant
