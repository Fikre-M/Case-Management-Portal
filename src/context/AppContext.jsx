import { createContext, useContext, useState, useEffect } from 'react'
import mockAppointments from '../services/mockAppointments'
import mockCases from '../services/mockCases'

const AppContext = createContext()

export function AppProvider({ children }) {
  // Appointments State
  const [appointments, setAppointments] = useState([])
  const [appointmentsLoading, setAppointmentsLoading] = useState(true)

  // Cases State
  const [cases, setCases] = useState([])
  const [casesLoading, setCasesLoading] = useState(true)

  // Initialize data on mount
  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setAppointments(mockAppointments)
      setAppointmentsLoading(false)
    }, 500)

    setTimeout(() => {
      setCases(mockCases)
      setCasesLoading(false)
    }, 500)
  }, [])

  // Appointment CRUD Operations
  const getAppointmentById = (id) => {
    return appointments.find(apt => apt.id === parseInt(id))
  }

  const createAppointment = (appointmentData) => {
    const newAppointment = {
      id: Math.max(...appointments.map(a => a.id), 0) + 1,
      ...appointmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setAppointments(prev => [...prev, newAppointment])
    return newAppointment
  }

  const updateAppointment = (id, appointmentData) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === parseInt(id)
          ? { ...apt, ...appointmentData, updatedAt: new Date().toISOString() }
          : apt
      )
    )
  }

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(apt => apt.id !== parseInt(id)))
  }

  const getAppointmentsByStatus = (status) => {
    return appointments.filter(apt => apt.status === status)
  }

  const getAppointmentsByDate = (date) => {
    return appointments.filter(apt => apt.date === date)
  }

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0]
    return getAppointmentsByDate(today)
  }

  const getUpcomingAppointments = (limit = 5) => {
    const today = new Date().toISOString().split('T')[0]
    return appointments
      .filter(apt => apt.date >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, limit)
  }

  // Case CRUD Operations
  const getCaseById = (id) => {
    return cases.find(c => c.id === parseInt(id))
  }

  const createCase = (caseData) => {
    const newCase = {
      id: Math.max(...cases.map(c => c.id), 0) + 1,
      caseNumber: `CASE-2024-${String(cases.length + 1).padStart(3, '0')}`,
      ...caseData,
      openedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          event: 'Case opened',
          type: 'info'
        }
      ],
      documents: [],
      notes: [],
    }
    setCases(prev => [...prev, newCase])
    return newCase
  }

  const updateCase = (id, caseData) => {
    setCases(prev =>
      prev.map(c =>
        c.id === parseInt(id)
          ? { ...c, ...caseData, lastUpdated: new Date().toISOString().split('T')[0] }
          : c
      )
    )
  }

  const deleteCase = (id) => {
    setCases(prev => prev.filter(c => c.id !== parseInt(id)))
  }

  const getCasesByStatus = (status) => {
    return cases.filter(c => c.status === status)
  }

  const getCasesByPriority = (priority) => {
    return cases.filter(c => c.priority === priority)
  }

  const getActiveCases = () => {
    return getCasesByStatus('active')
  }

  const getRecentCases = (limit = 5) => {
    return cases
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      .slice(0, limit)
  }

  // Statistics
  const getAppointmentStats = () => {
    return {
      total: appointments.length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      pending: appointments.filter(a => a.status === 'pending').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      today: getTodayAppointments().length,
    }
  }

  const getCaseStats = () => {
    return {
      total: cases.length,
      active: cases.filter(c => c.status === 'active').length,
      pending: cases.filter(c => c.status === 'pending').length,
      closed: cases.filter(c => c.status === 'closed').length,
      onHold: cases.filter(c => c.status === 'on-hold').length,
    }
  }

  const value = {
    // Appointments
    appointments,
    appointmentsLoading,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByStatus,
    getAppointmentsByDate,
    getTodayAppointments,
    getUpcomingAppointments,
    getAppointmentStats,

    // Cases
    cases,
    casesLoading,
    getCaseById,
    createCase,
    updateCase,
    deleteCase,
    getCasesByStatus,
    getCasesByPriority,
    getActiveCases,
    getRecentCases,
    getCaseStats,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
