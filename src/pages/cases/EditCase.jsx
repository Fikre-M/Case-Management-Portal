import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import CaseForm from '../../components/forms/CaseForm'

function EditCase() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data fetch
    const mockCases = [
      {
        id: 1,
        title: 'Employment Discrimination Case',
        clientName: 'Sarah Johnson',
        type: 'employment',
        status: 'active',
        priority: 'high',
        assignedTo: 'John Doe',
        description: 'Client alleges workplace discrimination based on gender.',
        nextAction: 'Schedule mediation meeting',
        dueDate: '2024-12-20',
        progress: 75,
      },
    ]

    setTimeout(() => {
      const found = mockCases.find(c => c.id === parseInt(id))
      setCaseData(found)
      setLoading(false)
    }, 500)
  }, [id])

  const handleSubmit = (formData) => {
    console.log('Updating case:', id, formData)
    navigate('/cases')
  }

  const handleCancel = () => {
    navigate('/cases')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">❌</span>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Case not found</p>
            <button
              onClick={() => navigate('/cases')}
              className="mt-4 text-primary-600 dark:text-primary-400 hover:underline"
            >
              Back to Cases
            </button>
          </div>
        </Card>
      </div>
    )
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Case</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Update case information</p>
      </div>

      {/* Form */}
      <Card>
        <CaseForm 
          initialData={caseData}
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
        />
      </Card>
    </div>
  )
}

export default EditCase
