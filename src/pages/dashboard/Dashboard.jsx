import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Loading from '../../components/common/Loading'
import AppointmentChart from '../../components/charts/AppointmentChart'
import CaseStatusChart from '../../components/charts/CaseStatusChart'
import { useApp } from '../../context/AppContext'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

const statCardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 10
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
}

function Dashboard() {
  const {
    getUpcomingAppointments,
    getActiveCases,
    getAppointmentStats,
    getCaseStats,
    appointmentsLoading,
    casesLoading,
  } = useApp()

  // Get data from context
  const appointmentStats = getAppointmentStats()
  const caseStats = getCaseStats()
  const recentAppointments = getUpcomingAppointments(4)
  const activeCases = getActiveCases().slice(0, 3)

  // Stats with real data
  const stats = [
    { label: 'Total Appointments', value: appointmentStats.total, change: '+12%', trend: 'up', icon: '📅', color: 'blue' },
    { label: 'Active Cases', value: caseStats.active, change: '+5%', trend: 'up', icon: '📋', color: 'green' },
    { label: 'Total Clients', value: '156', change: '+8%', trend: 'up', icon: '👥', color: 'purple' },
    { label: 'Pending Tasks', value: '7', change: '-3%', trend: 'down', icon: '✓', color: 'orange' },
  ]

  if (appointmentsLoading || casesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    )
  }

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
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        variants={containerVariants}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={statCardVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <motion.p 
                    className="text-3xl font-bold text-gray-900 dark:text-white mt-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }}
                  >
                    {stat.value}
                  </motion.p>
                  <div className="flex items-center mt-2">
                    <motion.span 
                      className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                    >
                      {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
                    </motion.span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
                  </div>
                </div>
                <motion.div 
                  className={`w-12 h-12 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20 flex items-center justify-center`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-2xl">{stat.icon}</span>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Links */}
      <motion.div variants={itemVariants}>
        <Card title="Quick Actions">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
          >
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={link.path}
                  className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-md transition-all group"
                >
                  <motion.div 
                    className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-2xl">{link.icon}</span>
                  </motion.div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                    {link.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        {/* Recent Appointments */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                  className="mr-2"
                >
                  📅
                </motion.span>
                Recent Appointments
              </h3>
              <Link 
                to="/appointments" 
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center group"
              >
                View all
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                >
                  →
                </motion.span>
              </Link>
            </div>
            <div className="space-y-3">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <Link
                      to={`/appointments/${appointment.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {appointment.clientName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{appointment.type}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center">
                          <span className="mr-1">🕒</span>
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Badge variant={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <span className="text-4xl mb-2 block">📅</span>
                  <p className="text-gray-500 dark:text-gray-400">No upcoming appointments</p>
                  <Link
                    to="/appointments/new"
                    className="text-primary-600 dark:text-primary-400 hover:underline text-sm mt-2 inline-block"
                  >
                    Schedule your first appointment
                  </Link>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Active Cases */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="mr-2"
                >
                  📋
                </motion.span>
                Active Cases
              </h3>
              <Link 
                to="/cases" 
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center group"
              >
                View all
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                >
                  →
                </motion.span>
              </Link>
            </div>
            <div className="space-y-4">
              {activeCases.length > 0 ? (
                activeCases.map((caseItem, index) => (
                  <motion.div
                    key={caseItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Link
                      to={`/cases/${caseItem.id}`}
                      className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {caseItem.caseNumber}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <span className="mr-1">👤</span>
                            {caseItem.clientName}
                          </p>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Badge variant={getPriorityColor(caseItem.priority)}>
                            {caseItem.priority}
                          </Badge>
                        </motion.div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <motion.span
                            key={caseItem.progress}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="font-medium"
                          >
                            {caseItem.progress}%
                          </motion.span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="bg-primary-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${caseItem.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <span className="text-4xl mb-2 block">📋</span>
                  <p className="text-gray-500 dark:text-gray-400">No active cases</p>
                  <Link
                    to="/cases/new"
                    className="text-primary-600 dark:text-primary-400 hover:underline text-sm mt-2 inline-block"
                  >
                    Create your first case
                  </Link>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {/* Appointments Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card title="Appointments Overview">
            <AppointmentChart />
          </Card>
        </motion.div>

        {/* Case Status Distribution */}
        <motion.div variants={itemVariants}>
          <Card title="Case Status">
            <CaseStatusChart />
          </Card>
        </motion.div>
      </motion.div>

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
    </motion.div>
  )
}

export default Dashboard
