import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'

function Dashboard() {
  // Placeholder data
  const stats = [
    { label: 'Total Appointments', value: '24', change: '+12%', trend: 'up', icon: '📅', color: 'blue' },
    { label: 'Active Cases', value: '18', change: '+5%', trend: 'up', icon: '📋', color: 'green' },
    { label: 'Total Clients', value: '156', change: '+8%', trend: 'up', icon: '👥', color: 'purple' },
    { label: 'Pending Tasks', value: '7', change: '-3%', trend: 'down', icon: '✓', color: 'orange' },
  ]

  const recentAppointments = [
    { id: 1, client: 'Sarah Johnson', type: 'Consultation', date: 'Today, 2:00 PM', status: 'confirmed' },
    { id: 2, client: 'Michael Chen', type: 'Follow-up', date: 'Today, 4:30 PM', status: 'confirmed' },
    { id: 3, client: 'Emma Wilson', type: 'Initial Meeting', date: 'Tomorrow, 10:00 AM', status: 'pending' },
    { id: 4, client: 'James Brown', type: 'Review', date: 'Tomorrow, 3:00 PM', status: 'confirmed' },
  ]

  const activeCases = [
    { id: 1, title: 'Case #2024-001', client: 'Sarah Johnson', priority: 'high', progress: 75 },
    { id: 2, title: 'Case #2024-002', client: 'Michael Chen', priority: 'medium', progress: 45 },
    { id: 3, title: 'Case #2024-003', client: 'Emma Wilson', priority: 'low', progress: 20 },
  ]

  const quickLinks = [
    { label: 'Schedule Appointment', icon: '📅', path: '/appointments/new', color: 'bg-blue-500' },
    { label: 'Create New Case', icon: '📋', path: '/cases/new', color: 'bg-green-500' },
    { label: 'Add Client', icon: '👥', path: '/clients/new', color: 'bg-purple-500' },
    { label: 'AI Assistant', icon: '🤖', path: '/ai-assistant', color: 'bg-pink-500' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success'
      case 'pending': return 'warning'
      case 'cancelled': return 'danger'
      default: return 'default'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20 flex items-center justify-center`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-md transition-all group"
            >
              <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <span className="text-2xl">{link.icon}</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Appointments</h3>
            <Link to="/appointments" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{appointment.client}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{appointment.date}</p>
                </div>
                <Badge variant={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Cases */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Cases</h3>
            <Link to="/cases" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {activeCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{caseItem.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{caseItem.client}</p>
                  </div>
                  <Badge variant={getPriorityColor(caseItem.priority)}>
                    {caseItem.priority}
                  </Badge>
                </div>
                <div className="mt-3">
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
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Chart */}
        <Card title="Appointments Overview" className="lg:col-span-2">
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📊</span>
              <p className="text-gray-500 dark:text-gray-400">Chart placeholder</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Appointments trend over time
              </p>
            </div>
          </div>
        </Card>

        {/* Case Status Distribution */}
        <Card title="Case Status">
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🥧</span>
              <p className="text-gray-500 dark:text-gray-400">Chart placeholder</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Case distribution
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card title="Recent Activity">
        <div className="space-y-4">
          {[
            { icon: '📅', text: 'New appointment scheduled with Sarah Johnson', time: '5 minutes ago' },
            { icon: '📋', text: 'Case #2024-001 status updated to "In Progress"', time: '1 hour ago' },
            { icon: '👥', text: 'New client Emma Wilson added to the system', time: '2 hours ago' },
            { icon: '✓', text: 'Task "Review documents" marked as complete', time: '3 hours ago' },
            { icon: '🤖', text: 'AI Assistant generated case summary', time: '4 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">{activity.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
