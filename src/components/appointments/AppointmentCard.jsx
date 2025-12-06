import { Link } from 'react-router-dom'
import Badge from '../common/Badge'

function AppointmentCard({ appointment, onEdit, onDelete, onStatusChange }) {
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link 
            to={`/appointments/${appointment.id}`}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
          >
            {appointment.title}
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {appointment.type}
          </p>
        </div>
        <Badge variant={getStatusVariant(appointment.status)}>
          {appointment.status}
        </Badge>
      </div>

      {/* Client Info */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-gray-400">👤</span>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {appointment.clientName}
        </span>
      </div>

      {/* Date & Time */}
      <div className="flex items-center space-x-4 mb-3 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">📅</span>
          <span className="text-gray-700 dark:text-gray-300">{appointment.date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">🕐</span>
          <span className="text-gray-700 dark:text-gray-300">{appointment.time}</span>
        </div>
      </div>

      {/* Duration & Priority */}
      <div className="flex items-center space-x-4 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">⏱️</span>
          <span className="text-gray-700 dark:text-gray-300">{appointment.duration}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">🎯</span>
          <span className={`font-medium ${getPriorityColor(appointment.priority)}`}>
            {appointment.priority}
          </span>
        </div>
      </div>

      {/* Notes Preview */}
      {appointment.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {appointment.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(appointment)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(appointment.id)}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Delete
          </button>
        </div>
        {appointment.status === 'pending' && (
          <button
            onClick={() => onStatusChange(appointment.id, 'confirmed')}
            className="text-sm px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
          >
            Confirm
          </button>
        )}
      </div>
    </div>
  )
}

export default AppointmentCard
