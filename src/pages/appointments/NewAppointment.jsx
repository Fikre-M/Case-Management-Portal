import { useNavigate } from 'react-router-dom'
import Card from '../../components/common/Card'
import AppointmentForm from '../../components/forms/AppointmentForm'

function NewAppointment() {
  const navigate = useNavigate()

  const handleSubmit = (formData) => {
    // In a real app, this would make an API call
    console.log('Creating appointment:', formData)
    
    // Navigate back to appointments list
    navigate('/appointments')
  }

  const handleCancel = () => {
    navigate('/appointments')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/appointments')}
          className="text-primary-600 dark:text-primary-400 hover:underline mb-4 flex items-center"
        >
          <span className="mr-2">←</span>
          Back to Appointments
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Appointment</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Schedule a new appointment</p>
      </div>

      {/* Form */}
      <Card>
        <AppointmentForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </Card>
    </div>
  )
}

export default NewAppointment
