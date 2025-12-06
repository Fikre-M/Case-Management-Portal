import { Link } from 'react-router-dom'
import Badge from '../common/Badge'

function CaseCard({ caseItem, onEdit, onDelete, onStatusChange }) {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'pending': return 'warning'
      case 'closed': return 'info'
      case 'on-hold': return 'default'
      default: return 'default'
    }
  }

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'default'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {caseItem.caseNumber}
          </div>
          <Link
            to={`/cases/${caseItem.id}`}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2"
          >
            {caseItem.title}
          </Link>
        </div>
        <Badge variant={getStatusVariant(caseItem.status)}>
          {caseItem.status}
        </Badge>
      </div>

      {/* Client & Type */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-400">👤</span>
          <span className="text-gray-700 dark:text-gray-300">{caseItem.clientName}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-400">📁</span>
          <span className="text-gray-700 dark:text-gray-300 capitalize">{caseItem.type}</span>
        </div>
      </div>

      {/* Priority & Assigned */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">🎯</span>
          <Badge variant={getPriorityVariant(caseItem.priority)}>
            {caseItem.priority}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400">👨‍💼</span>
          <span className="text-gray-700 dark:text-gray-300">{caseItem.assignedTo}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{caseItem.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${caseItem.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Next Action */}
      {caseItem.nextAction && (
        <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
            Next Action:
          </div>
          <div className="text-gray-700 dark:text-gray-300 text-xs">
            {caseItem.nextAction}
          </div>
        </div>
      )}

      {/* Due Date */}
      {caseItem.dueDate && (
        <div className="flex items-center space-x-2 text-sm mb-3">
          <span className="text-gray-400">📅</span>
          <span className="text-gray-700 dark:text-gray-300">Due: {caseItem.dueDate}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(caseItem)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(caseItem.id)}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Delete
          </button>
        </div>
        {caseItem.status === 'pending' && (
          <button
            onClick={() => onStatusChange(caseItem.id, 'active')}
            className="text-sm px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
          >
            Activate
          </button>
        )}
      </div>
    </div>
  )
}

export default CaseCard
