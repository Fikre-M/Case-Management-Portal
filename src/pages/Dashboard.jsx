import Card from '../components/common/Card'

function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="text-sm text-gray-600">Total Appointments</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Active Cases</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Total Clients</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Pending Tasks</div>
          <div className="text-3xl font-bold text-primary-600 mt-2">0</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Appointments">
          <p className="text-gray-500">No appointments yet</p>
        </Card>
        <Card title="Recent Cases">
          <p className="text-gray-500">No cases yet</p>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
