import { useParams } from 'react-router-dom'
import Card from '../../components/common/Card'

function AppointmentDetails() {
  const { id } = useParams()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Appointment Details</h1>
      <Card>
        <p className="text-gray-500">Appointment ID: {id}</p>
      </Card>
    </div>
  )
}

export default AppointmentDetails
