// Mock Cases Data
export const mockCases = [
  {
    id: 1,
    caseNumber: 'CASE-2024-001',
    title: 'Employment Discrimination Case',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah.johnson@example.com',
    clientPhone: '+1 (555) 123-4567',
    type: 'employment',
    status: 'active',
    priority: 'high',
    assignedTo: 'John Doe',
    openedDate: '2024-11-15',
    lastUpdated: '2024-12-05',
    progress: 75,
    description: 'Client alleges workplace discrimination based on gender. Multiple incidents documented over the past 6 months. Seeking compensation and policy changes.',
    nextAction: 'Schedule mediation meeting',
    dueDate: '2024-12-20',
    timeline: [
      { date: '2024-11-15', event: 'Case opened', type: 'info' },
      { date: '2024-11-20', event: 'Initial consultation completed', type: 'success' },
      { date: '2024-11-25', event: 'Evidence gathering phase started', type: 'info' },
      { date: '2024-12-01', event: 'Witness statements collected', type: 'success' },
      { date: '2024-12-05', event: 'Mediation scheduled', type: 'warning' },
    ],
    documents: [
      { name: 'Initial Complaint.pdf', size: '2.4 MB', date: '2024-11-15' },
      { name: 'Witness Statements.pdf', size: '1.8 MB', date: '2024-12-01' },
      { name: 'Employment Records.pdf', size: '3.2 MB', date: '2024-11-20' },
    ],
    notes: [
      { date: '2024-12-05', author: 'John Doe', text: 'Client is very cooperative. Strong case with solid evidence.' },
      { date: '2024-12-01', author: 'John Doe', text: 'Collected statements from 3 witnesses. All corroborate client\'s account.' },
    ]
  },
  {
    id: 2,
    caseNumber: 'CASE-2024-002',
    title: 'Contract Dispute Resolution',
    clientName: 'Michael Chen',
    clientEmail: 'michael.chen@example.com',
    clientPhone: '+1 (555) 234-5678',
    type: 'contract',
    status: 'active',
    priority: 'medium',
    assignedTo: 'Jane Smith',
    openedDate: '2024-11-20',
    lastUpdated: '2024-12-04',
    progress: 45,
    description: 'Breach of contract claim regarding service delivery terms. Client seeks damages and contract termination.',
    nextAction: 'Review contract documents',
    dueDate: '2024-12-15',
    timeline: [
      { date: '2024-11-20', event: 'Case opened', type: 'info' },
      { date: '2024-11-22', event: 'Contract review initiated', type: 'info' },
      { date: '2024-11-28', event: 'Breach identified', type: 'warning' },
      { date: '2024-12-04', event: 'Demand letter sent', type: 'success' },
    ],
    documents: [
      { name: 'Original Contract.pdf', size: '1.2 MB', date: '2024-11-20' },
      { name: 'Breach Evidence.pdf', size: '3.5 MB', date: '2024-11-28' },
      { name: 'Demand Letter.pdf', size: '0.8 MB', date: '2024-12-04' },
    ],
    notes: [
      { date: '2024-12-04', author: 'Jane Smith', text: 'Demand letter sent. Awaiting response within 10 business days.' },
      { date: '2024-11-28', author: 'Jane Smith', text: 'Clear breach of Section 4.2. Strong case for damages.' },
    ]
  },
  {
    id: 3,
    caseNumber: 'CASE-2024-003',
    title: 'Family Law Consultation',
    clientName: 'Emma Wilson',
    clientEmail: 'emma.wilson@example.com',
    clientPhone: '+1 (555) 345-6789',
    type: 'family',
    status: 'pending',
    priority: 'low',
    assignedTo: 'John Doe',
    openedDate: '2024-11-25',
    lastUpdated: '2024-12-03',
    progress: 20,
    description: 'Initial consultation for custody arrangement modification. Client seeking increased visitation rights.',
    nextAction: 'Gather supporting documents',
    dueDate: '2024-12-30',
    timeline: [
      { date: '2024-11-25', event: 'Case opened', type: 'info' },
      { date: '2024-11-27', event: 'Initial consultation held', type: 'success' },
      { date: '2024-12-03', event: 'Document request sent', type: 'info' },
    ],
    documents: [
      { name: 'Current Custody Order.pdf', size: '1.5 MB', date: '2024-11-25' },
      { name: 'Client Statement.pdf', size: '0.9 MB', date: '2024-11-27' },
    ],
    notes: [
      { date: '2024-12-03', author: 'John Doe', text: 'Waiting for client to provide additional documentation.' },
      { date: '2024-11-27', author: 'John Doe', text: 'Client has valid reasons for modification request.' },
    ]
  },
  {
    id: 4,
    caseNumber: 'CASE-2024-004',
    title: 'Personal Injury Claim',
    clientName: 'James Brown',
    clientEmail: 'james.brown@example.com',
    clientPhone: '+1 (555) 456-7890',
    type: 'personal-injury',
    status: 'active',
    priority: 'high',
    assignedTo: 'Jane Smith',
    openedDate: '2024-10-10',
    lastUpdated: '2024-12-06',
    progress: 85,
    description: 'Workplace accident resulting in serious injury. Settlement negotiations ongoing with insurance company.',
    nextAction: 'Finalize settlement agreement',
    dueDate: '2024-12-12',
    timeline: [
      { date: '2024-10-10', event: 'Case opened', type: 'info' },
      { date: '2024-10-15', event: 'Medical records obtained', type: 'success' },
      { date: '2024-10-25', event: 'Demand letter sent', type: 'info' },
      { date: '2024-11-10', event: 'Initial settlement offer received', type: 'warning' },
      { date: '2024-11-20', event: 'Counter-offer submitted', type: 'info' },
      { date: '2024-12-06', event: 'Settlement agreement reached', type: 'success' },
    ],
    documents: [
      { name: 'Medical Records.pdf', size: '5.2 MB', date: '2024-10-15' },
      { name: 'Accident Report.pdf', size: '2.1 MB', date: '2024-10-10' },
      { name: 'Settlement Agreement.pdf', size: '1.3 MB', date: '2024-12-06' },
    ],
    notes: [
      { date: '2024-12-06', author: 'Jane Smith', text: 'Settlement reached at $150,000. Client satisfied with outcome.' },
      { date: '2024-11-20', author: 'Jane Smith', text: 'Counter-offer submitted for $150,000. Awaiting response.' },
    ]
  },
  {
    id: 5,
    caseNumber: 'CASE-2024-005',
    title: 'Property Rights Dispute',
    clientName: 'Lisa Anderson',
    clientEmail: 'lisa.anderson@example.com',
    clientPhone: '+1 (555) 567-8901',
    type: 'property',
    status: 'closed',
    priority: 'medium',
    assignedTo: 'John Doe',
    openedDate: '2024-09-01',
    lastUpdated: '2024-11-30',
    progress: 100,
    description: 'Boundary dispute with neighbor. Successfully resolved through mediation.',
    nextAction: 'Case closed',
    dueDate: '2024-11-30',
    timeline: [
      { date: '2024-09-01', event: 'Case opened', type: 'info' },
      { date: '2024-09-10', event: 'Property survey completed', type: 'success' },
      { date: '2024-10-05', event: 'Mediation scheduled', type: 'info' },
      { date: '2024-10-20', event: 'Mediation held', type: 'success' },
      { date: '2024-11-30', event: 'Agreement signed, case closed', type: 'success' },
    ],
    documents: [
      { name: 'Property Survey.pdf', size: '3.8 MB', date: '2024-09-10' },
      { name: 'Mediation Agreement.pdf', size: '1.1 MB', date: '2024-10-20' },
      { name: 'Final Settlement.pdf', size: '0.9 MB', date: '2024-11-30' },
    ],
    notes: [
      { date: '2024-11-30', author: 'John Doe', text: 'Case successfully closed. Both parties satisfied with outcome.' },
      { date: '2024-10-20', author: 'John Doe', text: 'Mediation successful. Agreement reached on boundary line.' },
    ]
  },
]

// Helper functions for case operations
export const getCaseById = (id) => {
  return mockCases.find(c => c.id === parseInt(id))
}

export const getCasesByStatus = (status) => {
  return mockCases.filter(c => c.status === status)
}

export const getCasesByPriority = (priority) => {
  return mockCases.filter(c => c.priority === priority)
}

export const getCasesByAssignee = (assignee) => {
  return mockCases.filter(c => c.assignedTo === assignee)
}

export const getActiveCases = () => {
  return getCasesByStatus('active')
}

export const getRecentCases = (limit = 5) => {
  return mockCases
    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
    .slice(0, limit)
}

export default mockCases
