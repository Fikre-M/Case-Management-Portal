// This file is kept for backward compatibility
// Redirects to AiChatPage
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AIAssistant() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/ai-assistant', { replace: true })
  }, [navigate])

  return null
}

export default AIAssistant
