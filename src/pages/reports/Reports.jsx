import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'
import ErrorState from '../../components/common/ErrorState'
import SkeletonLoader from '../../components/common/SkeletonLoader'
import { useApp } from '../../context/AppContext'

function Reports() {
  const { 
    appointments, 
    appointmentsLoading, 
    appointmentsError,
    cases, 
    casesLoading, 
    casesError,
    getAppointmentStats, 
    getCaseStats,
    retryLoadAppointments,
    retryLoadCases
  } = useApp()
  
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

  const isLoading = appointmentsLoading || casesLoading
  const hasError = appointmentsError || casesError

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Insights into your practice performance</p>
        </div>
        
        {/* Loading skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonLoader type="stat" count={4} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader type="card" count={2} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonLoader type="card" count={3} />
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Insights into your practice performance</p>
        </div>
        
        {appointmentsError && (
          <ErrorState 
            error={appointmentsError}
            onRetry={retryLoadAppointments}
            title="Failed to load appointment data"
          />
        )}
        
        {casesError && (
          <ErrorState 
            error={casesError}
            onRetry={retryLoadCases}
            title="Failed to load case data"
          />
        )}
      </div>
    )
  }

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
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400" aria-label={`${appointmentStats.total} total appointments`}>
            {appointmentStats.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Appointments</div>
          <div className="text-xs text-green-600 mt-1" aria-label="12% increase from last month">
            ↑ 12% from last month
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400" aria-label={`${caseStats.active} active cases`}>
            {caseStats.active}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Cases</div>
          <div className="text-xs text-green-600 mt-1" aria-label="8% increase from last month">
            ↑ 8% from last month
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400" aria-label="92% client satisfaction">
            92%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Client Satisfaction</div>
          <div className="text-xs text-green-600 mt-1" aria-label="3% increase from last month">
            ↑ 3% from last month
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400" aria-label="$45,000 monthly revenue">
            $45K
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Monthly Revenue</div>
          <div className="text-xs text-green-600 mt-1" aria-label="15% increase from last month">
            ↑ 15% from last month
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Trends */}
        <Card title="Appointment Trends">
          <div className="h-64 flex items-end justify-between space-x-2 p-4" role="img" aria-label="Appointment trends chart showing monthly data">
            {appointmentTrends.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{ height: `${(item.count / 25) * 100}%`, minHeight: '20px' }}
                  title={`${item.month}: ${item.count} appointments`}
                  tabIndex="0"
                  role="button"
                  aria-label={`${item.month}: ${item.count} appointments`}
                ></div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">{item.month}</div>
                <div className="text-xs font-medium text-gray-900 dark:text-white">{item.count}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Case Distribution */}
        <Card title="Cases by Type">
          <div className="space-y-4" role="list" aria-label="Case distribution by type">
            {casesByType.map((item, index) => (
              <div key={index} className="flex items-center justify-between" role="listitem">
                <div className="flex items-center space-x-3">
                  <div 
                    className={`w-4 h-4 rounded-full ${item.color}`}
                    role="img"
                    aria-label={`${item.type} indicator`}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.type}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2" role="progressbar" aria-label={`${item.type} progress`}>
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${(item.count / 5) * 100}%` }}
                      aria-valuenow={item.count}
                      aria-valuemax={5}
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
          <div className="space-y-3" role="list" aria-label="Recent activity list">
            <div className="flex items-start space-x-3" role="listitem">
              <span className="text-green-500" role="img" aria-label="Success">✓</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Case #2024-001 completed</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3" role="listitem">
              <span className="text-blue-500" role="img" aria-label="Calendar">📅</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">New appointment scheduled</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3" role="listitem">
              <span className="text-purple-500" role="img" aria-label="Document">📋</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">Case documents updated</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Top Clients */}
        <Card title="Top Clients">
          <div className="space-y-3" role="list" aria-label="Top clients list">
            {['Sarah Johnson', 'Michael Chen', 'Emma Wilson'].map((client, index) => (
              <div key={index} className="flex items-center justify-between" role="listitem">
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
          <div className="space-y-4" role="list" aria-label="Performance metrics">
            <div role="listitem">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Case Success Rate</span>
                <span className="text-gray-900 dark:text-white">94%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2" role="progressbar" aria-label="Case success rate: 94%">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }} aria-valuenow={94} aria-valuemax={100}></div>
              </div>
            </div>
            <div role="listitem">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Client Retention</span>
                <span className="text-gray-900 dark:text-white">87%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2" role="progressbar" aria-label="Client retention: 87%">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }} aria-valuenow={87} aria-valuemax={100}></div>
              </div>
            </div>
            <div role="listitem">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">On-time Delivery</span>
                <span className="text-gray-900 dark:text-white">96%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2" role="progressbar" aria-label="On-time delivery: 96%">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }} aria-valuenow={96} aria-valuemax={100}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Reports