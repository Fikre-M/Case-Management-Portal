import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

function Cases() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cases</h1>
        <Link to="/cases/new">
          <Button>+ New Case</Button>
        </Link>
      </div>
      
      <Card>
        <p className="text-gray-500 text-center py-8">No cases found</p>
      </Card>
    </div>
  )
}

export default Cases
