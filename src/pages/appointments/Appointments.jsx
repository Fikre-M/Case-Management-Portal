// This file is kept for backward compatibility
// Redirects to AppointmentsList
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Appointments() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/appointments', { replace: true })
  }, [navigate])

  return null
}

export default Appointments
