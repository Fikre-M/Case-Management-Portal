import { useNavigate } from 'react-router-dom'
import Card from '../../components/common/Card'
import CaseForm from '../../components/forms/CaseForm'

function NewCase() {
  const navigate = useNavigate()

  const handleSubmit = (formData) => {
    // In a real app, this would make an API call
    console.log('Creating case:', formData)
    
    // Navigate back to cases list
    navigate('/cases')
  }

  const handleCancel = () => {
    navigate('/cases')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/cases')}
          className="text-primary-600 dark:text-primary-400 hover:underline mb-4 flex items-center"
        >
          <span className="mr-2">←</span>
          Back to Cases
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Case</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Create a new case file</p>
      </div>

      {/* Form */}
      <Card>
        <CaseForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </Card>
    </div>
  )
}

export default NewCase
