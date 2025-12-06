import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import AppointmentForm from '../../components/forms/AppointmentForm'

function EditAppointment() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data fetch - in real app, this would be an API call
    const mockAppointments = [
      {
        id: 1,
        title: 'Initial Consultation',
        clientName: 'Sarah Johnson',
        type: 'consultation',
        date: '2024-12-10',
        time: '14:00',
        duration: '60',
        priority: 'high',
        status: 'confirmed',
        notes: 'First meeting to discuss case details and requirements.'
      },
      {
        id: 2,
        title: 'Follow-up Meeting',
        clientName: 'Michael Chen',
        type: 'follow-up',
        date: '2024-12-10',
        time: '16:30',
        duration: '30',
        priority: 'medium',
        status: 'confirmed',
        notes: 'Review progress and next steps.'
      },
    ]

    setTimeout(() => {
      const found = mockAppointments.find(apt => apt.id === parseInt(id))
      setAppointment(found)
      setLoading(false)
    }, 500)
  }, [id])

  const handleSubmit = (formData) => {
    // In a real app, this would make an API call
    console.log('Updating appointment:', id, formData)
    
    // Navigate back to appointments list
    navigate('/appointments')
  }

  const handleCancel = () => {
    navigate('/appointments')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">❌</span>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Appointment not found</p>
            <button
              onClick={() => navigate('/appointments')}
              className="mt-4 text-primary-600 dark:text-primary-400 hover:underline"
            >
              Back to Appointments
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
          onClick={() => navigate('/appointments')}
          className="text-primary-600 dark:text-primary-400 hover:underline mb-4 flex items-center"
        >
          <span className="mr-2">←</span>
          Back to Appointments
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Appointment</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Update appointment details</p>
      </div>

      {/* Form */}
      <Card>
        <AppointmentForm 
          initialData={appointment}
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
        />
      </Card>
    </div>
  )
}

export default EditAppointment
