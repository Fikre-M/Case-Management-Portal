import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import Alert from '../../components/common/Alert'
import AppointmentCard from '../../components/appointments/AppointmentCard'
import AppointmentForm from '../../components/forms/AppointmentForm'

function AppointmentsList() {
  // Mock data
  const [appointments, setAppointments] = useState([
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
    {
      id: 3,
      title: 'Case Review',
      clientName: 'Emma Wilson',
      type: 'review',
      date: '2024-12-11',
      time: '10:00',
      duration: '45',
      priority: 'medium',
      status: 'pending',
      notes: 'Quarterly case review meeting.'
    },
    {
      id: 4,
      title: 'Initial Assessment',
      clientName: 'James Brown',
      type: 'assessment',
      date: '2024-12-11',
      time: '15:00',
      duration: '90',
      priority: 'high',
      status: 'pending',
      notes: 'Comprehensive initial assessment session.'
    },
    {
      id: 5,
      title: 'Consultation',
      clientName: 'Lisa Anderson',
      type: 'consultation',
      date: '2024-12-12',
      time: '09:00',
      duration: '60',
      priority: 'low',
      status: 'confirmed',
      notes: 'General consultation about services.'
    },
  ])

  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [alert, setAlert] = useState(null)

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus
    const matchesSearch = apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment)
    setShowEditModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(apt => apt.id !== id))
      setAlert({ type: 'success', message: 'Appointment deleted successfully' })
      setTimeout(() => setAlert(null), 3000)
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, status: newStatus } : apt
    ))
    setAlert({ type: 'success', message: 'Appointment status updated' })
    setTimeout(() => setAlert(null), 3000)
  }

  const handleFormSubmit = (formData) => {
    if (editingAppointment) {
      // Update existing
      setAppointments(appointments.map(apt =>
        apt.id === editingAppointment.id ? { ...apt, ...formData } : apt
      ))
      setAlert({ type: 'success', message: 'Appointment updated successfully' })
    } else {
      // Create new
      const newAppointment = {
        id: Math.max(...appointments.map(a => a.id)) + 1,
        ...formData
      }
      setAppointments([...appointments, newAppointment])
      setAlert({ type: 'success', message: 'Appointment created successfully' })
    }
    setShowEditModal(false)
    setEditingAppointment(null)
    setTimeout(() => setAlert(null), 3000)
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

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    today: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your appointments and schedule</p>
        </div>
        <Link to="/appointments/new">
          <Button className="w-full md:w-auto">
            <span className="mr-2">➕</span>
            New Appointment
          </Button>
        </Link>
      </div>

      {/* Alert */}
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.confirmed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Confirmed</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.today}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Today</div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="search"
              placeholder="Search by client name or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field md:w-48"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          {/* View Toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </Card>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📅</span>
            <p className="text-gray-500 dark:text-gray-400 text-lg">No appointments found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Create your first appointment to get started'}
            </p>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAppointments.map(appointment => (
                  <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {appointment.clientName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{appointment.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{appointment.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{appointment.date}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {appointment.duration} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="text-primary-600 dark:text-primary-400 hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingAppointment(null)
        }}
        title={editingAppointment ? 'Edit Appointment' : 'New Appointment'}
      >
        <AppointmentForm
          initialData={editingAppointment}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowEditModal(false)
            setEditingAppointment(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default AppointmentsList
