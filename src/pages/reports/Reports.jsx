import Card from '../../components/common/Card'

function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Appointment Reports">
          <p className="text-gray-500">No data available</p>
        </Card>
        <Card title="Case Reports">
          <p className="text-gray-500">No data available</p>
        </Card>
        <Card title="Client Reports">
          <p className="text-gray-500">No data available</p>
        </Card>
        <Card title="Performance Metrics">
          <p className="text-gray-500">No data available</p>
        </Card>
      </div>
    </div>
  )
}

export default Reports
