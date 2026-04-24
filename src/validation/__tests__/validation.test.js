import { describe, it, expect, beforeEach } from 'vitest'
import { 
  validateApiResponse, 
  validateApiRequest, 
  ValidationError,
  safeValidate,
  validatePartial
} from '../validationMiddleware'
import { 
  appointmentSchema, 
  createAppointmentSchema,
  appointmentListSchema 
} from '../schemas'

describe('Validation Middleware', () => {
  const validAppointment = {
    id: 1,
    title: 'Test Appointment',
    clientName: 'John Doe',
    clientEmail: 'john@example.com',
    clientPhone: '+1 (555) 123-4567',
    type: 'consultation',
    date: '2024-12-17',
    time: '14:00',
    duration: '60',
    priority: 'high',
    status: 'confirmed',
    notes: 'Test notes',
    location: 'Office - Room 301',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-05T15:30:00Z'
  }

  const validAppointmentList = [validAppointment]

  describe('validateApiResponse', () => {
    it('should validate correct appointment data', () => {
      const result = validateApiResponse(validAppointment, appointmentSchema, 'test')
      expect(result).toEqual(validAppointment)
    })

    it('should validate correct appointment list', () => {
      const result = validateApiResponse(validAppointmentList, appointmentListSchema, 'test')
      expect(result).toEqual(validAppointmentList)
    })

    it('should throw ValidationError for invalid data', () => {
      const invalidData = { ...validAppointment, email: 'invalid-email' }
      
      expect(() => {
        validateApiResponse(invalidData, appointmentSchema, 'test')
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError for null data', () => {
      expect(() => {
        validateApiResponse(null, appointmentSchema, 'test')
      }).toThrow(ValidationError)
    })

    it('should throw ValidationError for undefined data', () => {
      expect(() => {
        validateApiResponse(undefined, appointmentSchema, 'test')
      }).toThrow(ValidationError)
    })
  })

  describe('validateApiRequest', () => {
    it('should validate correct create appointment data', () => {
      const createData = {
        title: 'New Appointment',
        clientName: 'Jane Doe',
        clientEmail: 'jane@example.com',
        clientPhone: '+1 (555) 987-6543',
        type: 'follow-up',
        date: '2024-12-18',
        time: '10:00',
        duration: '30',
        priority: 'medium',
        status: 'pending',
        location: 'Virtual - Zoom'
      }

      const result = validateApiRequest(createData, createAppointmentSchema, 'test')
      expect(result).toEqual(createData)
    })

    it('should throw ValidationError for invalid request data', () => {
      const invalidData = {
        title: 'New Appointment',
        clientEmail: 'invalid-email',
        // Missing required fields
      }

      expect(() => {
        validateApiRequest(invalidData, createAppointmentSchema, 'test')
      }).toThrow(ValidationError)
    })
  })

  describe('safeValidate', () => {
    it('should return validated data for valid input', () => {
      const result = safeValidate(validAppointment, appointmentSchema, 'test')
      expect(result).toEqual(validAppointment)
    })

    it('should return null for invalid input', () => {
      const invalidData = { ...validAppointment, email: 'invalid-email' }
      const result = safeValidate(invalidData, appointmentSchema, 'test')
      expect(result).toBeNull()
    })
  })

  describe('validatePartial', () => {
    it('should validate partial update data', () => {
      const partialData = {
        title: 'Updated Appointment',
        notes: 'Updated notes'
      }

      const result = validatePartial(partialData, appointmentSchema, 'test')
      expect(result).toEqual(partialData)
    })

    it('should throw ValidationError for invalid partial data', () => {
      const invalidData = {
        email: 'invalid-email'
      }

      expect(() => {
        validatePartial(invalidData, appointmentSchema, 'test')
      }).toThrow(ValidationError)
    })
  })

  describe('ValidationError', () => {
    it('should create ValidationError with correct properties', () => {
      const error = new ValidationError('Test error', 'test schema', {}, null)
      
      expect(error.name).toBe('ValidationError')
      expect(error.message).toBe('Test error')
      expect(error.schema).toBe('test schema')
      expect(error.data).toEqual({})
      expect(error.zodError).toBeNull()
      expect(error.timestamp).toBeDefined()
    })

    it('should serialize to JSON correctly', () => {
      const zodError = {
        errors: [
          { path: ['email'], message: 'Invalid email' }
        ]
      }
      
      const error = new ValidationError('Test error', 'test schema', { email: 'invalid' }, zodError)
      const json = error.toJSON()
      
      expect(json.name).toBe('ValidationError')
      expect(json.message).toBe('Test error')
      expect(json.schema).toBe('test schema')
      expect(json.data).toEqual({ email: 'invalid' })
      expect(json.zodError).toEqual([{ path: ['email'], message: 'Invalid email' }])
      expect(json.timestamp).toBeDefined()
    })
  })
})
