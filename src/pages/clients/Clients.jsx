import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

function Clients() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button>+ New Client</Button>
      </div>
      
      <Card>
        <p className="text-gray-500 text-center py-8">No clients found</p>
      </Card>
    </div>
  )
}

export default Clients
