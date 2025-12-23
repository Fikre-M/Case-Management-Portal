import { useState } from 'react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Loading from '../../components/common/Loading'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import SkeletonLoader from '../../components/common/SkeletonLoader'
import useToast from '../../hooks/useToast'
import useErrorHandler from '../../hooks/useErrorHandler'
import ToastContainer from '../../components/common/ToastContainer'

function Clients() {
  const { toasts, success, removeToast } = useToast()
  const { error: globalError, handleError, clearError } = useErrorHandler()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Corp',
      status: 'active',
      cases: 2,
      joinDate: '2024-01-15',
      lastContact: '2024-12-10'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 234-5678',
      company: 'Design Studio',
      status: 'active',
      cases: 1,
      joinDate: '2024-02-20',
      lastContact: '2024-12-08'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      phone: '+1 (555) 345-6789',
      company: 'Marketing Inc',
      status: 'inactive',
      cases: 1,
      joinDate: '2024-03-10',
      lastContact: '2024-11-25'
    }
  ])

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  })

  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    
    if (!newClient.name.trim()) {
      errors.name = 'Name is required'
    }
    
    if (!newClient.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(newClient.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    // Check for duplicate email
    if (clients.some(client => client.email.toLowerCase() === newClient.email.toLowerCase())) {
      errors.email = 'A client with this email already exists'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddClient = async () => {
    if (!validateForm()) {
      return
    }

    try {
      setSubmitting(true)
      clearError()

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const client = {
        id: Math.max(...clients.map(c => c.id)) + 1,
        ...newClient,
        status: 'active',
        cases: 0,
        joinDate: new Date().toISOString().split('T')[0],
        lastContact: new Date().toISOString().split('T')[0]
      }

      setClients([...clients, client])
      setNewClient({ name: '', email: '', phone: '', company: '' })
      setFormErrors({})
      setShowModal(false)
      success('Client added successfully!')
    } catch (error) {
      handleError(error, false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return
    }

    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setClients(clients.filter(c => c.id !== clientId))
      success('Client deleted successfully!')
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusVariant = (status) => {
    return status === 'active' ? 'success' : 'default'
  }

  const handleModalClose = () => {
    setShowModal(false)
    setNewClient({ name: '', email: '', phone: '', company: '' })
    setFormErrors({})
    clearError()
  }

  if (loading) {
    return <Loading message="Loading clients..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your client relationships</p>
        </div>
        <Button 
          onClick={() => setShowModal(true)}
          aria-label="Add new client"
        >
          <span className="mr-2" aria-hidden="true">➕</span>
          New Client
        </Button>
      </div>

      {globalError && (
        <ErrorState 
          error={globalError} 
          onRetry={clearError}
          title="Failed to load clients"
        />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {clients.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Clients</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {clients.filter(c => c.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {clients.reduce((sum, c) => sum + c.cases, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Cases</div>
        </Card>
      </div>

      {/* Clients List */}
      <Card>
        {clients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th 
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                  >
                    Client
                  </th>
                  <th 
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                  >
                    Contact
                  </th>
                  <th 
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                  >
                    Company
                  </th>
                  <th 
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                  >
                    Status
                  </th>
                  <th 
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                  >
                    Cases
                  </th>
                  <th 
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                  >
                    Last Contact
                  </th>
                  <th 
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {client.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{client.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {client.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(client.status)}>
                        {client.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {client.cases}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {client.lastContact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClient(client.id)}
                        aria-label={`Delete ${client.name}`}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="👥"
            title="No clients yet"
            description="Start building your client base by adding your first client."
            actionLabel="Add First Client"
            onAction={() => setShowModal(true)}
          />
        )}
      </Card>

      {/* Add Client Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title="Add New Client"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={newClient.name}
            onChange={(e) => setNewClient({...newClient, name: e.target.value})}
            placeholder="Enter client name"
            required
            error={formErrors.name}
            disabled={submitting}
          />
          <Input
            label="Email"
            type="email"
            value={newClient.email}
            onChange={(e) => setNewClient({...newClient, email: e.target.value})}
            placeholder="Enter email address"
            required
            error={formErrors.email}
            disabled={submitting}
          />
          <Input
            label="Phone"
            value={newClient.phone}
            onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
            placeholder="Enter phone number"
            disabled={submitting}
          />
          <Input
            label="Company"
            value={newClient.company}
            onChange={(e) => setNewClient({...newClient, company: e.target.value})}
            placeholder="Enter company name"
            disabled={submitting}
          />
          <div className="flex space-x-4 pt-4">
            <Button 
              onClick={handleAddClient} 
              className="flex-1"
              loading={submitting}
              disabled={submitting}
            >
              Add Client
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleModalClose} 
              className="flex-1"
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default Clients
