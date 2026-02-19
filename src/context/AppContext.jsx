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

  // AI Assistant State
  const [aiChatHistory, setAiChatHistory] = useState(() => {
    // Load chat history from localStorage
    try {
      const saved = localStorage.getItem('aiChatHistory')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.warn('Failed to load AI chat history:', error)
      return []
    }
  })

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

  // Save AI chat history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('aiChatHistory', JSON.stringify(aiChatHistory))
    } catch (error) {
      console.warn('Failed to save AI chat history:', error)
    }
  }, [aiChatHistory])

  // Retry functions now simply call the loader functions
  const retryLoadAppointments = loadAppointments
  const retryLoadCases = loadCases

  /**
   * Retrieves an appointment by its ID
   * @param {number|string} id - The appointment ID to search for
   * @returns {Object|undefined} The appointment object if found, undefined otherwise
   * @example
   * const appointment = getAppointmentById(123)
   * if (appointment) {
   *   console.log(appointment.title)
   * }
   */
  const getAppointmentById = (id) => {
    return appointments.find(apt => apt.id === parseInt(id))
  }

  /**
   * Creates a new appointment
   * @param {Object} appointmentData - The appointment data to create
   * @param {string} appointmentData.title - Appointment title
   * @param {string} appointmentData.clientName - Client name
   * @param {string} appointmentData.date - Appointment date (YYYY-MM-DD)
   * @param {string} appointmentData.time - Appointment time (HH:MM)
   * @param {string} [appointmentData.type='consultation'] - Appointment type
   * @param {string} [appointmentData.status='scheduled'] - Appointment status
   * @returns {Promise<Object>} Promise that resolves to the created appointment
   * @throws {Error} When appointment creation fails
   * @example
   * try {
   *   const newAppointment = await createAppointment({
   *     title: 'Initial Consultation',
   *     clientName: 'John Doe',
   *     date: '2024-12-15',
   *     time: '14:00'
   *   })
   * } catch (error) {
   *   console.error('Failed to create appointment:', error.message)
   * }
   */
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

  /**
   * Updates an existing appointment
   * @param {number|string} id - The appointment ID to update
   * @param {Object} appointmentData - The updated appointment data
   * @returns {Promise<Object>} Promise that resolves to the updated appointment
   * @throws {Error} When appointment update fails
   */
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

  /**
   * Deletes an appointment by ID
   * @param {number|string} id - The appointment ID to delete
   * @returns {Promise<void>} Promise that resolves when deletion is complete
   * @throws {Error} When appointment deletion fails
   */
  const deleteAppointment = async (id) => {
    try {
      await appointmentService.delete(id)
      setAppointments(prev => prev.filter(apt => apt.id !== parseInt(id)))
    } catch (error) {
      console.error('Failed to delete appointment:', error)
      throw new Error(error.message || 'Failed to delete appointment')
    }
  }

  /**
   * Filters appointments by status
   * @param {string} status - The status to filter by ('scheduled', 'confirmed', 'completed', 'cancelled')
   * @returns {Array<Object>} Array of appointments matching the status
   */
  const getAppointmentsByStatus = (status) => {
    return appointments.filter(apt => apt.status === status)
  }

  /**
   * Filters appointments by date
   * @param {string} date - The date to filter by (YYYY-MM-DD format)
   * @returns {Array<Object>} Array of appointments on the specified date
   */
  const getAppointmentsByDate = (date) => {
    return appointments.filter(apt => apt.date === date)
  }

  /**
   * Gets all appointments scheduled for today
   * @returns {Array<Object>} Array of today's appointments
   */
  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0]
    return getAppointmentsByDate(today)
  }

  /**
   * Gets upcoming appointments sorted by date
   * @param {number} [limit=5] - Maximum number of appointments to return
   * @returns {Array<Object>} Array of upcoming appointments, sorted by date
   */
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

  // AI Assistant Functions
  const addAiMessage = (message) => {
    setAiChatHistory(prev => [...prev, { ...message, id: Date.now() + Math.random() }])
  }

  const clearAiChatHistory = () => {
    setAiChatHistory([])
  }

  const getAiChatHistory = () => {
    return aiChatHistory
  }
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

    // AI Assistant
    aiChatHistory,
    addAiMessage,
    clearAiChatHistory,
    getAiChatHistory,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

/**
 * Custom hook to access the App Context
 * 
 * Provides access to all appointment and case management functionality,
 * including CRUD operations, filtering, and statistics.
 * 
 * @returns {Object} App context object containing:
 * @returns {Array<Object>} returns.appointments - Array of all appointments
 * @returns {Array<Object>} returns.cases - Array of all cases
 * @returns {boolean} returns.appointmentsLoading - Loading state for appointments
 * @returns {boolean} returns.casesLoading - Loading state for cases
 * @returns {string|null} returns.appointmentsError - Error message for appointments
 * @returns {string|null} returns.casesError - Error message for cases
 * @returns {Function} returns.createAppointment - Function to create new appointment
 * @returns {Function} returns.updateAppointment - Function to update appointment
 * @returns {Function} returns.deleteAppointment - Function to delete appointment
 * @returns {Function} returns.getAppointmentById - Function to get appointment by ID
 * @returns {Function} returns.getUpcomingAppointments - Function to get upcoming appointments
 * @returns {Function} returns.getTodayAppointments - Function to get today's appointments
 * @returns {Function} returns.getAppointmentStats - Function to get appointment statistics
 * @returns {Function} returns.createCase - Function to create new case
 * @returns {Function} returns.updateCase - Function to update case
 * @returns {Function} returns.deleteCase - Function to delete case
 * @returns {Function} returns.getCaseById - Function to get case by ID
 * @returns {Function} returns.getActiveCases - Function to get active cases
 * @returns {Function} returns.getCaseStats - Function to get case statistics
 * 
 * @throws {Error} When used outside of AppProvider
 * 
 * @example
 * function AppointmentsList() {
 *   const { 
 *     appointments, 
 *     appointmentsLoading, 
 *     createAppointment 
 *   } = useApp()
 * 
 *   if (appointmentsLoading) return <Loading />
 * 
 *   return (
 *     <div>
 *       {appointments.map(apt => (
 *         <AppointmentCard key={apt.id} appointment={apt} />
 *       ))}
 *     </div>
 *   )
 * }
 */
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
