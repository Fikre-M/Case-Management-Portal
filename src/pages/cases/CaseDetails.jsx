import { useParams } from 'react-router-dom'
import Card from '../../components/common/Card'

function CaseDetails() {
  const { id } = useParams()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Case Details</h1>
      <Card>
        <p className="text-gray-500">Case ID: {id}</p>
      </Card>
    </div>
  )
}

export default CaseDetails
