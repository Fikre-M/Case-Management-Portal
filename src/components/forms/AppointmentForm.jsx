import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import Alert from '../common/Alert'

function AppointmentForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    clientName: initialData?.clientName || '',
    type: initialData?.type || 'consultation',
    date: initialData?.date || '',
    time: initialData?.time || '',
    duration: initialData?.duration || '30',
    priority: initialData?.priority || 'medium',
    status: initialData?.status || 'pending',
    notes: initialData?.notes || '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const appointmentTypes = [
    'Consultation',
    'Follow-up',
    'Initial Meeting',
    'Review',
    'Assessment',
    'Other'
  ]

  const durations = ['15', '30', '45', '60', '90', '120']
  const priorities = ['low', 'medium', 'high']
  const statuses = ['pending', 'confirmed', 'cancelled', 'completed']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    if (!formData.time) {
      newErrors.time = 'Time is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onSubmit(formData)
      setIsSubmitting(false)
    }, 500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Appointment Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Initial Consultation"
          className="input-field"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>

      {/* Client Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Client Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
          placeholder="Enter client name"
          className="input-field"
        />
        {errors.clientName && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.clientName}</p>
        )}
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Appointment Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="input-field"
        >
          {appointmentTypes.map(type => (
            <option key={type} value={type.toLowerCase()}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input-field"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="input-field"
          />
          {errors.time && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.time}</p>
          )}
        </div>
      </div>

      {/* Duration & Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Duration (minutes)
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="input-field"
          >
            {durations.map(duration => (
              <option key={duration} value={duration}>
                {duration} minutes
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="input-field"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input-field"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          placeholder="Add any additional notes..."
          className="input-field resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-4 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : initialData ? 'Update Appointment' : 'Create Appointment'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default AppointmentForm
