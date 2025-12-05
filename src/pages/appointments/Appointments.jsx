import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

function Appointments() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <Link to="/appointments/new">
          <Button>+ New Appointment</Button>
        </Link>
      </div>
      
      <Card>
        <p className="text-gray-500 text-center py-8">No appointments found</p>
      </Card>
    </div>
  )
}

export default Appointments
