// This file is kept for backward compatibility
// Redirects to CaseList
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Cases() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/cases', { replace: true })
  }, [navigate])

  return null
}

export default Cases
