import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import Alert from '../../components/common/Alert'
import CaseCard from '../../components/cases/CaseCard'
import CaseForm from '../../components/forms/CaseForm'

function CaseList() {
  // Mock data
  const [cases, setCases] = useState([
    {
      id: 1,
      caseNumber: 'CASE-2024-001',
      title: 'Employment Discrimination Case',
      clientName: 'Sarah Johnson',
      type: 'employment',
      status: 'active',
      priority: 'high',
      assignedTo: 'John Doe',
      openedDate: '2024-11-15',
      lastUpdated: '2024-12-05',
      progress: 75,
      description: 'Client alleges workplace discrimination based on gender. Multiple incidents documented.',
      nextAction: 'Schedule mediation meeting',
      dueDate: '2024-12-20'
    },
    {
      id: 2,
      caseNumber: 'CASE-2024-002',
      title: 'Contract Dispute Resolution',
      clientName: 'Michael Chen',
      type: 'contract',
      status: 'active',
      priority: 'medium',
      assignedTo: 'Jane Smith',
      openedDate: '2024-11-20',
      lastUpdated: '2024-12-04',
      progress: 45,
      description: 'Breach of contract claim regarding service delivery terms.',
      nextAction: 'Review contract documents',
      dueDate: '2024-12-15'
    },
    {
      id: 3,
      caseNumber: 'CASE-2024-003',
      title: 'Family Law Consultation',
      clientName: 'Emma Wilson',
      type: 'family',
      status: 'pending',
      priority: 'low',
      assignedTo: 'John Doe',
      openedDate: '2024-11-25',
      lastUpdated: '2024-12-03',
      progress: 20,
      description: 'Initial consultation for custody arrangement modification.',
      nextAction: 'Gather supporting documents',
      dueDate: '2024-12-30'
    },
    {
      id: 4,
      caseNumber: 'CASE-2024-004',
      title: 'Personal Injury Claim',
      clientName: 'James Brown',
      type: 'personal-injury',
      status: 'active',
      priority: 'high',
      assignedTo: 'Jane Smith',
      openedDate: '2024-10-10',
      lastUpdated: '2024-12-06',
      progress: 85,
      description: 'Workplace accident resulting in serious injury. Settlement negotiations ongoing.',
      nextAction: 'Finalize settlement agreement',
      dueDate: '2024-12-12'
    },
    {
      id: 5,
      caseNumber: 'CASE-2024-005',
      title: 'Property Rights Dispute',
      clientName: 'Lisa Anderson',
      type: 'property',
      status: 'closed',
      priority: 'medium',
      assignedTo: 'John Doe',
      openedDate: '2024-09-01',
      lastUpdated: '2024-11-30',
      progress: 100,
      description: 'Boundary dispute with neighbor. Successfully resolved through mediation.',
      nextAction: 'Case closed',
      dueDate: '2024-11-30'
    },
  ])

  const [viewMode, setViewMode] = useState('grid')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCase, setEditingCase] = useState(null)
  const [alert, setAlert] = useState(null)

  // Filter cases
  const filteredCases = cases.filter(caseItem => {
    const matchesStatus = filterStatus === 'all' || caseItem.status === filterStatus
    const matchesPriority = filterPriority === 'all' || caseItem.priority === filterPriority
    const matchesSearch = 
      caseItem.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesPriority && matchesSearch
  })

  const handleEdit = (caseItem) => {
    setEditingCase(caseItem)
    setShowEditModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      setCases(cases.filter(c => c.id !== id))
      setAlert({ type: 'success', message: 'Case deleted successfully' })
      setTimeout(() => setAlert(null), 3000)
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setCases(cases.map(c =>
      c.id === id ? { ...c, status: newStatus } : c
    ))
    setAlert({ type: 'success', message: 'Case status updated' })
    setTimeout(() => setAlert(null), 3000)
  }

  const handleFormSubmit = (formData) => {
    if (editingCase) {
      setCases(cases.map(c =>
        c.id === editingCase.id ? { ...c, ...formData } : c
      ))
      setAlert({ type: 'success', message: 'Case updated successfully' })
    } else {
      const newCase = {
        id: Math.max(...cases.map(c => c.id)) + 1,
        caseNumber: `CASE-2024-${String(cases.length + 1).padStart(3, '0')}`,
        ...formData,
        openedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
      }
      setCases([...cases, newCase])
      setAlert({ type: 'success', message: 'Case created successfully' })
    }
    setShowEditModal(false)
    setEditingCase(null)
    setTimeout(() => setAlert(null), 3000)
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'pending': return 'warning'
      case 'closed': return 'info'
      case 'on-hold': return 'default'
      default: return 'default'
    }
  }

  const stats = {
    total: cases.length,
    active: cases.filter(c => c.status === 'active').length,
    pending: cases.filter(c => c.status === 'pending').length,
    closed: cases.filter(c => c.status === 'closed').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cases</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your legal cases and track progress</p>
        </div>
        <Link to="/cases/new">
          <Button className="w-full md:w-auto">
            <span className="mr-2">➕</span>
            New Case
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
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Cases</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.active}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.closed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Closed</div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="search"
              placeholder="Search by case number, client name, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field md:w-40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="on-hold">On Hold</option>
            <option value="closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="input-field md:w-40"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
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

      {/* Cases List */}
      {filteredCases.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📋</span>
            <p className="text-gray-500 dark:text-gray-400 text-lg">No cases found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first case to get started'}
            </p>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map(caseItem => (
            <CaseCard
              key={caseItem.id}
              caseItem={caseItem}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Case Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCases.map(caseItem => (
                  <tr key={caseItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {caseItem.caseNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{caseItem.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{caseItem.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {caseItem.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(caseItem.status)}>
                        {caseItem.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={caseItem.priority === 'high' ? 'danger' : caseItem.priority === 'medium' ? 'warning' : 'info'}>
                        {caseItem.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${caseItem.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{caseItem.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(caseItem)}
                        className="text-primary-600 dark:text-primary-400 hover:underline mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(caseItem.id)}
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
          setEditingCase(null)
        }}
        title={editingCase ? 'Edit Case' : 'New Case'}
      >
        <CaseForm
          initialData={editingCase}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowEditModal(false)
            setEditingCase(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default CaseList
