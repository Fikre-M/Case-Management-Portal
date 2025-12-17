import Card from '../../components/common/Card'
import { useApp } from '../../context/AppContext'

function Reports() {
  const { appointments, cases, getAppointmentStats, getCaseStats } = useApp()
  
  const appointmentStats = getAppointmentStats()
  const caseStats = getCaseStats()
  
  // Calculate trends (mock data for demo)
  const appointmentTrends = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 19 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 22 },
    { month: 'May', count: 18 },
    { month: 'Jun', count: 24 },
  ]
  
  const casesByType = [
    { type: 'Employment', count: 2, color: 'bg-blue-500' },
    { type: 'Contract', count: 1, color: 'bg-green-500' },
    { type: 'Family', count: 1, color: 'bg-purple-500' },
    { type: 'Personal Injury', count: 1, color: 'bg-red-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Insights into your practice performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{appointmentStats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Appointments</div>
          <div className="text-xs text-green-600 mt-1">↑ 12% from last month</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{caseStats.active}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Cases</div>
          <div className="text-xs text-green-600 mt-1">↑ 8% from last month</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">92%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Client Satisfaction</div>
          <div className="text-xs text-green-600 mt-1">↑ 3% from last month</div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">$45K</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monthly Revenue</div>
          <div className="text-xs text-green-600 mt-1">↑ 15% from last month</div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trends */}
        <Card title="Appointment Trends">
          <div className="h-64 flex items-end justify-between space-x-2 p-4">
            {appointmentTrends.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                  style={{ height: `${(item.count / 25) * 100}%`, minHeight: '20px' }}
                  title={`${item.month}: ${item.count} appointments`}
                ></div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">{item.month}</div>
                <div className="text-xs font-medium text-gray-900 dark:text-white">{item.count}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Case Distribution */}
        <Card title="Cases by Type">
          <div className="space-y-4">
            {casesByType.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.type}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${(item.count / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-green-500">✓</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Case #2024-001 completed</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500">📅</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">New appointment scheduled</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-purple-500">📋</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Case documents updated</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Clients */}
        <Card title="Top Clients">
          <div className="space-y-3">
            {['Sarah Johnson', 'Michael Chen', 'Emma Wilson'].map((client, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {client.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">{client}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{3 - index} cases</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card title="Performance">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Case Success Rate</span>
                <span className="text-gray-900 dark:text-white">94%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Client Retention</span>
                <span className="text-gray-900 dark:text-white">87%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">On-time Delivery</span>
                <span className="text-gray-900 dark:text-white">96%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Reports