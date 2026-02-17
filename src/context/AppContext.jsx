import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { appointmentService } from '../services/appointmentService'
import { caseService } from '../services/caseService'

const AppContext = createContext()

export function AppProvider({ children }) {
  // Appointments State
  const [appointments, setAppointments] = useState([])
  const [appointmentsLoading, setAppointmentsLoading] = useState(true)
  const [appointmentsError, setAppointmentsError] = useState(null)

  // Cases State
  const [cases, setCases] = useState([])
  const [casesLoading, setCasesLoading] = useState(true)
  const [casesError, setCasesError] = useState(null)

  // Load appointments using service layer
  const loadAppointments = async () => {
    try {
      setAppointmentsLoading(true)
      setAppointmentsError(null)
      const data = await appointmentService.getAll()
      setAppointments(data)
    } catch (error) {
      console.error('Failed to load appointments:', error)
      setAppointmentsError(error.message || 'Failed to load appointments')
    } finally {
      setAppointmentsLoading(false)
    }
  }

  // Load cases using service layer
  const loadCases = async () => {
    try {
      setCasesLoading(true)
      setCasesError(null)
      const data = await caseService.getAll()
      setCases(data)
    } catch (error) {
      console.error('Failed to load cases:', error)
      setCasesError(error.message || 'Failed to load cases')
    } finally {
      setCasesLoading(false)
    }
  }

  // Initialize data on mount
  useEffect(() => {
    loadAppointments()
    loadCases()
  }, [])

  // Retry functions now simply call the loader functions
  const retryLoadAppointments = loadAppointments
  const retryLoadCases = loadCases

  // Appointment CRUD Operations
  const getAppointmentById = (id) => {
    return appointments.find(apt => apt.id === parseInt(id))
  }

  const createAppointment = async (appointmentData) => {
    try {
      const newAppointment = await appointmentService.create(appointmentData)
      setAppointments(prev => [...prev, newAppointment])
      return newAppointment
    } catch (error) {
      console.error('Failed to create appointment:', error)
      throw new Error(error.message || 'Failed to create appointment')
    }
  }

  const updateAppointment = async (id, appointmentData) => {
    try {
      const updatedAppointment = await appointmentService.update(id, appointmentData)
      setAppointments(prev =>
        prev.map(apt => apt.id === parseInt(id) ? updatedAppointment : apt)
      )
      return updatedAppointment
    } catch (error) {
      console.error('Failed to update appointment:', error)
      throw new Error(error.message || 'Failed to update appointment')
    }
  }

  const deleteAppointment = async (id) => {
    try {
      await appointmentService.delete(id)
      setAppointments(prev => prev.filter(apt => apt.id !== parseInt(id)))
    } catch (error) {
      console.error('Failed to delete appointment:', error)
      throw new Error(error.message || 'Failed to delete appointment')
    }
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

  const createCase = async (caseData) => {
    try {
      const newCase = await caseService.create(caseData)
      setCases(prev => [...prev, newCase])
      return newCase
    } catch (error) {
      console.error('Failed to create case:', error)
      throw new Error(error.message || 'Failed to create case')
    }
  }

  const updateCase = async (id, caseData) => {
    try {
      const updatedCase = await caseService.update(id, caseData)
      setCases(prev =>
        prev.map(c => c.id === parseInt(id) ? updatedCase : c)
      )
      return updatedCase
    } catch (error) {
      console.error('Failed to update case:', error)
      throw new Error(error.message || 'Failed to update case')
    }
  }

  const deleteCase = async (id) => {
    try {
      await caseService.delete(id)
      setCases(prev => prev.filter(c => c.id !== parseInt(id)))
    } catch (error) {
      console.error('Failed to delete case:', error)
      throw new Error(error.message || 'Failed to delete case')
    }
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
    appointmentsError,
    retryLoadAppointments,
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
    casesError,
    retryLoadCases,
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

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
