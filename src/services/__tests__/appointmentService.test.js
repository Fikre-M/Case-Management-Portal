import { describe, it, expect, beforeEach, vi } from 'vitest'
import { appointmentService } from '../appointmentService'
import * as api from '../api'

// Mock the api module
vi.mock('../api', () => ({
  default: vi.fn(),
  simulateNetworkDelay: vi.fn(() => Promise.resolve()),
  isMockMode: vi.fn(() => true),
}))

describe('Appointment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should return all appointments in mock mode', async () => {
      const appointments = await appointmentService.getAll()
      
      expect(Array.isArray(appointments)).toBe(true)
      expect(api.simulateNetworkDelay).toHaveBeenCalled()
    })

    it('should call API in non-mock mode', async () => {
      api.isMockMode.mockReturnValueOnce(false)
      const mockData = [{ id: 1, title: 'Test' }]
      api.default.mockResolvedValueOnce(mockData)

      const result = await appointmentService.getAll()

      expect(api.default).toHaveBeenCalledWith('/appointments')
      expect(result).toEqual(mockData)
    })
  })

  describe('getById', () => {
    it('should return appointment by id in mock mode', async () => {
      const appointment = await appointmentService.getById(1)
      
      expect(appointment).toBeDefined()
      expect(appointment.id).toBe(1)
    })

    it('should throw error if appointment not found', async () => {
      await expect(
        appointmentService.getById(99999)
      ).rejects.toThrow('not found')
    })

    it('should call API in non-mock mode', async () => {
      api.isMockMode.mockReturnValueOnce(false)
      const mockData = { id: 1, title: 'Test' }
      api.default.mockResolvedValueOnce(mockData)

      const result = await appointmentService.getById(1)

      expect(api.default).toHaveBeenCalledWith('/appointments/1')
      expect(result).toEqual(mockData)
    })
  })

  describe('create', () => {
    it('should create appointment in mock mode', async () => {
      const newAppointment = {
        title: 'New Appointment',
        date: '2024-01-01',
      }

      const result = await appointmentService.create(newAppointment)

      expect(result).toMatchObject(newAppointment)
      expect(result.id).toBeDefined()
      expect(result.createdAt).toBeDefined()
    })

    it('should call API in non-mock mode', async () => {
      api.isMockMode.mockReturnValueOnce(false)
      const mockData = { id: 1, title: 'Test' }
      api.default.mockResolvedValueOnce(mockData)

      const result = await appointmentService.create({ title: 'Test' })

      expect(api.default).toHaveBeenCalledWith(
        '/appointments',
        expect.objectContaining({
          method: 'POST',
        })
      )
      expect(result).toEqual(mockData)
    })
  })

  describe('update', () => {
    it('should update appointment in mock mode', async () => {
      const updates = { title: 'Updated Title' }
      const result = await appointmentService.update(1, updates)

      expect(result.title).toBe('Updated Title')
      expect(result.updatedAt).toBeDefined()
    })

    it('should throw error if appointment not found', async () => {
      await expect(
        appointmentService.update(99999, { title: 'Test' })
      ).rejects.toThrow('not found')
    })
  })

  describe('delete', () => {
    it('should delete appointment in mock mode', async () => {
      const result = await appointmentService.delete(1)
      expect(result).toEqual({ success: true })
    })

    it('should throw error if appointment not found', async () => {
      await expect(
        appointmentService.delete(99999)
      ).rejects.toThrow('not found')
    })
  })
})
