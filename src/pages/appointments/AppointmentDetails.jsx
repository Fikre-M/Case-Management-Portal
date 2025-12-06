import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Loading from '../../components/common/Loading'
import Alert from '../../components/common/Alert'

function AppointmentDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    // Mock data fetch
    const mockAppointments = [
      {
        id: 1,
        title: 'Initial Consultation',
        clientName: 'Sarah Johnson',
        clientEmail: 'sarah.johnson@example.com',
        clientPhone: '+1 (555) 123-4567',
        type: 'consultation',
        date: '2024-12-10',
        time: '14:00',
        duration: '60',
        priority: 'high',
        status: 'confirmed',
        notes: 'First meeting to discuss case details and requirements. Client is interested in long-term support services.',
        location: 'Office - Room 301',
        createdAt: '2024-12-01',
        updatedAt: '2024-12-05'
      },
      {
        id: 2,
        title: 'Follow-up Meeting',
        clientName: 'Michael Chen',
        clientEmail: 'michael.chen@example.com',
        clientPhone: '+1 (555) 234-5678',
        type: 'follow-up',
        date: '2024-12-10',
        time: '16:30',
        duration: '30',
        priority: 'medium',
        status: 'confirmed',
        notes: 'Review progress and next steps.',
        location: 'Virtual - Zoom',
        createdAt: '2024-12-02',
        updatedAt: '2024-12-04'
      },
    ]

    setTimeout(() => {
      const found = mockAppointments.find(apt => apt.id === parseInt(id))
      setAppointment(found)
      setLoading(false)
    }, 500)
  }, [id])

  const handleStatusChange = (newStatus) => {
    setAppointment({ ...appointment, status: newStatus })
    setAlert({ type: 'success', message: `Status updated to ${newStatus}` })
    setTimeout(() => setAlert(null), 3000)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAlert({ type: 'success', message: 'Appointment deleted successfully' })
      setTimeout(() => navigate('/appointments'), 1500)
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed': return 'success'
      case 'pending': return 'warning'
      case 'cancelled': return 'danger'
      case 'completed': return 'info'
      default: return 'default'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'low': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
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
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">❌</span>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Appointment not found</p>
            <Link to="/appointments" className="mt-4 inline-block text-primary-600 dark:text-primary-400 hover:underline">
              Back to Appointments
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/appointments"
          className="text-primary-600 dark:text-primary-400 hover:underline mb-4 flex items-center"
        >
          <span className="mr-2">←</span>
          Back to Appointments
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{appointment.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Appointment #{appointment.id}</p>
          </div>
          <div className="flex space-x-2">
            <Link to={`/appointments/${id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Main Info Card */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Appointment Information
            </h2>
          </div>
          <Badge variant={getStatusVariant(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
              <p className="text-gray-900 dark:text-white mt-1 capitalize">{appointment.type}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
              <p className="text-gray-900 dark:text-white mt-1 flex items-center">
                <span className="mr-2">📅</span>
                {appointment.date}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</label>
              <p className="text-gray-900 dark:text-white mt-1 flex items-center">
                <span className="mr-2">🕐</span>
                {appointment.time}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</label>
              <p className="text-gray-900 dark:text-white mt-1 flex items-center">
                <span className="mr-2">⏱️</span>
                {appointment.duration} minutes
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</label>
              <p className={`mt-1 font-medium capitalize ${getPriorityColor(appointment.priority)}`}>
                {appointment.priority}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</label>
              <p className="text-gray-900 dark:text-white mt-1 flex items-center">
                <span className="mr-2">📍</span>
                {appointment.location}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
              <p className="text-gray-900 dark:text-white mt-1">{appointment.createdAt}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
              <p className="text-gray-900 dark:text-white mt-1">{appointment.updatedAt}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Client Info Card */}
      <Card title="Client Information">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
            <p className="text-gray-900 dark:text-white mt-1 flex items-center">
              <span className="mr-2">👤</span>
              {appointment.clientName}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
            <p className="text-gray-900 dark:text-white mt-1 flex items-center">
              <span className="mr-2">📧</span>
              <a href={`mailto:${appointment.clientEmail}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                {appointment.clientEmail}
              </a>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
            <p className="text-gray-900 dark:text-white mt-1 flex items-center">
              <span className="mr-2">📞</span>
              <a href={`tel:${appointment.clientPhone}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                {appointment.clientPhone}
              </a>
            </p>
          </div>
        </div>
      </Card>

      {/* Notes Card */}
      {appointment.notes && (
        <Card title="Notes">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {appointment.notes}
          </p>
        </Card>
      )}

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {appointment.status === 'pending' && (
            <button
              onClick={() => handleStatusChange('confirmed')}
              className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              <span className="text-2xl block mb-2">✓</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm</span>
            </button>
          )}
          {appointment.status === 'confirmed' && (
            <button
              onClick={() => handleStatusChange('completed')}
              className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <span className="text-2xl block mb-2">✓</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Complete</span>
            </button>
          )}
          <button
            onClick={() => handleStatusChange('cancelled')}
            className="p-4 border-2 border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <span className="text-2xl block mb-2">✕</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cancel</span>
          </button>
          <button className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="text-2xl block mb-2">📧</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Send Email</span>
          </button>
          <button className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="text-2xl block mb-2">🔔</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reminder</span>
          </button>
        </div>
      </Card>
    </div>
  )
}

export default AppointmentDetails
