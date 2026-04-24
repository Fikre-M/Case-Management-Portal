import { z } from 'zod'

// Base schemas for common fields
const baseFields = {
  id: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}

const clientInfo = {
  clientName: z.string().min(1).max(100),
  clientEmail: z.string().email(),
  clientPhone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
}

// Appointment Schema
export const appointmentSchema = z.object({
  ...baseFields,
  title: z.string().min(1).max(200),
  ...clientInfo,
  type: z.enum(['consultation', 'follow-up', 'review', 'assessment', 'other']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  duration: z.string().regex(/^\d+$/, 'Duration must be a number in minutes'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  notes: z.string().max(1000).optional(),
  location: z.string().min(1).max(200),
})

export const appointmentListSchema = z.array(appointmentSchema)

// Case Schema
export const caseSchema = z.object({
  ...baseFields,
  caseNumber: z.string().regex(/^CASE-\d{4}-\d{3}$/, 'Invalid case number format'),
  title: z.string().min(1).max(200),
  ...clientInfo,
  type: z.enum(['employment', 'contract', 'family', 'personal-injury', 'property', 'other']),
  status: z.enum(['active', 'pending', 'closed', 'on-hold']),
  priority: z.enum(['low', 'medium', 'high']),
  assignedTo: z.string().min(1).max(100),
  openedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  progress: z.number().int().min(0).max(100),
  description: z.string().min(1).max(2000),
  nextAction: z.string().max(200).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  timeline: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    event: z.string().min(1).max(200),
    type: z.enum(['info', 'success', 'warning', 'error']),
  })),
  documents: z.array(z.object({
    name: z.string().min(1).max(200),
    size: z.string().regex(/^\d+(\.\d+)?\s?(KB|MB|GB)$/, 'Invalid file size format'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  })),
  notes: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    author: z.string().min(1).max(100),
    text: z.string().min(1).max(1000),
  })),
})

export const caseListSchema = z.array(caseSchema)

// Client Schema
export const clientSchema = z.object({
  ...baseFields,
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
  address: z.string().max(300).optional(),
  company: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
  status: z.enum(['active', 'inactive', 'prospect']).default('active'),
})

export const clientListSchema = z.array(clientSchema)

// Auth Schemas
export const loginResponseSchema = z.object({
  user: z.object({
    id: z.number().int().positive(),
    name: z.string().min(1).max(100),
    email: z.string().email(),
    role: z.enum(['admin', 'user', 'lawyer', 'assistant']),
  }),
  token: z.string().min(1),
  refreshToken: z.string().min(1).optional(),
  expiresIn: z.number().int().positive(),
})

export const registerResponseSchema = z.object({
  user: z.object({
    id: z.number().int().positive(),
    name: z.string().min(1).max(100),
    email: z.string().email(),
    role: z.enum(['admin', 'user', 'lawyer', 'assistant']),
  }),
  message: z.string().min(1),
})

// API Response Wrappers
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().positive(),
    totalPages: z.number().int().positive(),
  }).optional(),
})

// Specific API Response Schemas
export const appointmentsResponseSchema = apiResponseSchema.extend({
  data: appointmentListSchema,
})

export const appointmentResponseSchema = apiResponseSchema.extend({
  data: appointmentSchema,
})

export const casesResponseSchema = apiResponseSchema.extend({
  data: caseListSchema,
})

export const caseResponseSchema = apiResponseSchema.extend({
  data: caseSchema,
})

export const clientsResponseSchema = apiResponseSchema.extend({
  data: clientListSchema,
})

export const clientResponseSchema = apiResponseSchema.extend({
  data: clientSchema,
})

export const loginApiResponseSchema = apiResponseSchema.extend({
  data: loginResponseSchema,
})

export const registerApiResponseSchema = apiResponseSchema.extend({
  data: registerResponseSchema,
})

// Error Response Schema
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string().min(1),
  message: z.string().optional(),
  code: z.string().optional(),
  details: z.any().optional(),
})

// Generic validation schemas
export const idSchema = z.object({
  id: z.number().int().positive(),
})

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

// Request validation schemas
export const createAppointmentSchema = appointmentSchema.omit({ ...baseFields, id: true })
export const updateAppointmentSchema = createAppointmentSchema.partial()

export const createCaseSchema = caseSchema.omit({ ...baseFields, id: true, caseNumber: true })
export const updateCaseSchema = createCaseSchema.partial()

export const createClientSchema = clientSchema.omit({ ...baseFields, id: true })
export const updateClientSchema = createClientSchema.partial()

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const registerRequestSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'lawyer', 'assistant']).default('user'),
})

// Export all schemas for easy importing
export const schemas = {
  appointment: appointmentSchema,
  appointments: appointmentListSchema,
  case: caseSchema,
  cases: caseListSchema,
  client: clientSchema,
  clients: clientListSchema,
  loginResponse: loginResponseSchema,
  registerResponse: registerResponseSchema,
  apiResponse: apiResponseSchema,
  errorResponse: errorResponseSchema,
  appointmentsResponse: appointmentsResponseSchema,
  appointmentResponse: appointmentResponseSchema,
  casesResponse: casesResponseSchema,
  caseResponse: caseResponseSchema,
  clientsResponse: clientsResponseSchema,
  clientResponse: clientResponseSchema,
  loginApiResponse: loginApiResponseSchema,
  registerApiResponse: registerApiResponseSchema,
  createAppointment: createAppointmentSchema,
  updateAppointment: updateAppointmentSchema,
  createCase: createCaseSchema,
  updateCase: updateCaseSchema,
  createClient: createClientSchema,
  updateClient: updateClientSchema,
  loginRequest: loginRequestSchema,
  registerRequest: registerRequestSchema,
  pagination: paginationSchema,
  search: searchSchema,
  id: idSchema,
}
