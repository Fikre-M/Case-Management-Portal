import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Loading from '../../components/common/Loading'
import Alert from '../../components/common/Alert'

function CaseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    // Mock data fetch
    const mockCases = [
      {
        id: 1,
        caseNumber: 'CASE-2024-001',
        title: 'Employment Discrimination Case',
        clientName: 'Sarah Johnson',
        clientEmail: 'sarah.johnson@example.com',
        clientPhone: '+1 (555) 123-4567',
        type: 'employment',
        status: 'active',
        priority: 'high',
        assignedTo: 'John Doe',
        openedDate: '2024-11-15',
        lastUpdated: '2024-12-05',
        progress: 75,
        description: 'Client alleges workplace discrimination based on gender. Multiple incidents documented over the past 6 months. Seeking compensation and policy changes.',
        nextAction: 'Schedule mediation meeting',
        dueDate: '2024-12-20',
        timeline: [
          { date: '2024-11-15', event: 'Case opened', type: 'info' },
          { date: '2024-11-20', event: 'Initial consultation completed', type: 'success' },
          { date: '2024-11-25', event: 'Evidence gathering phase started', type: 'info' },
          { date: '2024-12-01', event: 'Witness statements collected', type: 'success' },
          { date: '2024-12-05', event: 'Mediation scheduled', type: 'warning' },
        ],
        documents: [
          { name: 'Initial Complaint.pdf', size: '2.4 MB', date: '2024-11-15' },
          { name: 'Witness Statements.pdf', size: '1.8 MB', date: '2024-12-01' },
          { name: 'Employment Records.pdf', size: '3.2 MB', date: '2024-11-20' },
        ],
        notes: [
          { date: '2024-12-05', author: 'John Doe', text: 'Client is very cooperative. Strong case with solid evidence.' },
          { date: '2024-12-01', author: 'John Doe', text: 'Collected statements from 3 witnesses. All corroborate client\'s account.' },
        ]
      },
    ]

    setTimeout(() => {
      const found = mockCases.find(c => c.id === parseInt(id))
      setCaseData(found)
      setLoading(false)
    }, 500)
  }, [id])

  const handleStatusChange = (newStatus) => {
    setCaseData({ ...caseData, status: newStatus })
    setAlert({ type: 'success', message: `Case status updated to ${newStatus}` })
    setTimeout(() => setAlert(null), 3000)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this case?')) {
      setAlert({ type: 'success', message: 'Case deleted successfully' })
      setTimeout(() => navigate('/cases'), 1500)
    }
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

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'default'
    }
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
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">❌</span>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Case not found</p>
            <Link to="/cases" className="mt-4 inline-block text-primary-600 dark:text-primary-400 hover:underline">
              Back to Cases
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/cases"
          className="text-primary-600 dark:text-primary-400 hover:underline mb-4 flex items-center"
        >
          <span className="mr-2">←</span>
          Back to Cases
        </Link>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {caseData.caseNumber}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{caseData.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 capitalize">{caseData.type} Case</p>
          </div>
          <div className="flex space-x-2">
            <Link to={`/cases/${id}/edit`}>
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

      {/* Status & Priority Row */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
          <Badge variant={getStatusVariant(caseData.status)}>
            {caseData.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
          <Badge variant={getPriorityVariant(caseData.priority)}>
            {caseData.priority}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Progress:</span>
          <div className="flex items-center">
            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
              <div
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: `${caseData.progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {caseData.progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Information */}
          <Card title="Case Information">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                <p className="text-gray-900 dark:text-white mt-1">{caseData.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Opened Date</label>
                  <p className="text-gray-900 dark:text-white mt-1">{caseData.openedDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                  <p className="text-gray-900 dark:text-white mt-1">{caseData.lastUpdated}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</label>
                  <p className="text-gray-900 dark:text-white mt-1">{caseData.dueDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</label>
                  <p className="text-gray-900 dark:text-white mt-1">{caseData.assignedTo}</p>
                </div>
              </div>

              {caseData.nextAction && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <label className="text-sm font-medium text-blue-600 dark:text-blue-400">Next Action</label>
                  <p className="text-gray-900 dark:text-white mt-1">{caseData.nextAction}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card title="Case Timeline">
            <div className="space-y-4">
              {caseData.timeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    item.type === 'success' ? 'bg-green-500' :
                    item.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.event}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Documents */}
          <Card title="Documents">
            <div className="space-y-3">
              {caseData.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{doc.size} • {doc.date}</p>
                    </div>
                  </div>
                  <button className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          <Card title="Case Notes">
            <div className="space-y-4">
              {caseData.notes.map((note, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{note.author}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{note.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{note.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Client & Actions */}
        <div className="space-y-6">
          {/* Client Information */}
          <Card title="Client Information">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                <p className="text-gray-900 dark:text-white mt-1 flex items-center">
                  <span className="mr-2">👤</span>
                  {caseData.clientName}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-gray-900 dark:text-white mt-1 flex items-center">
                  <span className="mr-2">📧</span>
                  <a href={`mailto:${caseData.clientEmail}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                    {caseData.clientEmail}
                  </a>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                <p className="text-gray-900 dark:text-white mt-1 flex items-center">
                  <span className="mr-2">📞</span>
                  <a href={`tel:${caseData.clientPhone}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                    {caseData.clientPhone}
                  </a>
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-2">
              {caseData.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange('active')}
                  className="w-full p-3 border-2 border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-left"
                >
                  <span className="text-xl mr-2">✓</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Activate Case</span>
                </button>
              )}
              {caseData.status === 'active' && (
                <>
                  <button
                    onClick={() => handleStatusChange('on-hold')}
                    className="w-full p-3 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors text-left"
                  >
                    <span className="text-xl mr-2">⏸️</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Put On Hold</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange('closed')}
                    className="w-full p-3 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
                  >
                    <span className="text-xl mr-2">✓</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Close Case</span>
                  </button>
                </>
              )}
              <button className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                <span className="text-xl mr-2">📧</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Client</span>
              </button>
              <button className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                <span className="text-xl mr-2">📄</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Generate Report</span>
              </button>
              <button className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                <span className="text-xl mr-2">📅</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Schedule Meeting</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CaseDetails
