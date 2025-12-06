// Mock Appointments Data
export const mockAppointments = [
  {
    id: 1,
    title: 'Initial Consultation',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah.johnson@example.com',
    clientPhone: '+1 (555) 123-4567',
    type: 'consultation',
    date: '2024-12-10',
    time: '14:00',
    duration: '60',
    priority: 'high',
    status: 'confirmed',
    notes: 'First meeting to discuss case details and requirements. Client is interested in long-term support services.',
    location: 'Office - Room 301',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-05T15:30:00Z'
  },
  {
    id: 2,
    title: 'Follow-up Meeting',
    clientName: 'Michael Chen',
    clientEmail: 'michael.chen@example.com',
    clientPhone: '+1 (555) 234-5678',
    type: 'follow-up',
    date: '2024-12-10',
    time: '16:30',
    duration: '30',
    priority: 'medium',
    status: 'confirmed',
    notes: 'Review progress and discuss next steps for the ongoing case.',
    location: 'Virtual - Zoom',
    createdAt: '2024-12-02T09:00:00Z',
    updatedAt: '2024-12-04T11:20:00Z'
  },
  {
    id: 3,
    title: 'Case Review',
    clientName: 'Emma Wilson',
    clientEmail: 'emma.wilson@example.com',
    clientPhone: '+1 (555) 345-6789',
    type: 'review',
    date: '2024-12-11',
    time: '10:00',
    duration: '45',
    priority: 'medium',
    status: 'pending',
    notes: 'Quarterly case review meeting to assess progress and strategy.',
    location: 'Office - Conference Room A',
    createdAt: '2024-11-25T14:00:00Z',
    updatedAt: '2024-12-03T16:45:00Z'
  },
  {
    id: 4,
    title: 'Initial Assessment',
    clientName: 'James Brown',
    clientEmail: 'james.brown@example.com',
    clientPhone: '+1 (555) 456-7890',
    type: 'assessment',
    date: '2024-12-11',
    time: '15:00',
    duration: '90',
    priority: 'high',
    status: 'pending',
    notes: 'Comprehensive initial assessment session for new case intake.',
    location: 'Office - Room 205',
    createdAt: '2024-11-28T10:30:00Z',
    updatedAt: '2024-12-02T13:15:00Z'
  },
  {
    id: 5,
    title: 'Consultation',
    clientName: 'Lisa Anderson',
    clientEmail: 'lisa.anderson@example.com',
    clientPhone: '+1 (555) 567-8901',
    type: 'consultation',
    date: '2024-12-12',
    time: '09:00',
    duration: '60',
    priority: 'low',
    status: 'confirmed',
    notes: 'General consultation about available legal services and options.',
    location: 'Office - Room 301',
    createdAt: '2024-11-30T08:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z'
  },
  {
    id: 6,
    title: 'Document Signing',
    clientName: 'Robert Taylor',
    clientEmail: 'robert.taylor@example.com',
    clientPhone: '+1 (555) 678-9012',
    type: 'other',
    date: '2024-12-13',
    time: '11:00',
    duration: '30',
    priority: 'high',
    status: 'confirmed',
    notes: 'Final document signing for case closure.',
    location: 'Office - Room 101',
    createdAt: '2024-12-03T12:00:00Z',
    updatedAt: '2024-12-06T09:30:00Z'
  },
]

// Helper functions for appointment operations
export const getAppointmentById = (id) => {
  return mockAppointments.find(apt => apt.id === parseInt(id))
}

export const getAppointmentsByStatus = (status) => {
  return mockAppointments.filter(apt => apt.status === status)
}

export const getAppointmentsByDate = (date) => {
  return mockAppointments.filter(apt => apt.date === date)
}

export const getTodayAppointments = () => {
  const today = new Date().toISOString().split('T')[0]
  return getAppointmentsByDate(today)
}

export const getUpcomingAppointments = (limit = 5) => {
  const today = new Date().toISOString().split('T')[0]
  return mockAppointments
    .filter(apt => apt.date >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, limit)
}

export default mockAppointments
