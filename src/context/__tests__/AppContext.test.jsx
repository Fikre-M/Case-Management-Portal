import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AppProvider, useApp } from '../AppContext'

// ─── Service mocks ───────────────────────────────────────────────────────────

vi.mock('../../services/appointmentService', () => ({
  appointmentService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('../../services/caseService', () => ({
  caseService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

// AppProvider now calls useError — provide a minimal ErrorProvider wrapper
vi.mock('../../context/ErrorContext', () => ({
  useError: () => ({ addError: vi.fn() }),
  ErrorProvider: ({ children }) => children,
}))

import { appointmentService } from '../../services/appointmentService'
import { caseService } from '../../services/caseService'

// ─── Fixtures ────────────────────────────────────────────────────────────────

const APT = {
  id: 1,
  title: 'Initial Consultation',
  clientName: 'Jane Doe',
  date: '2025-06-01',
  time: '10:00',
  status: 'scheduled',
}

const CASE = {
  id: 1,
  title: 'Smith v. Jones',
  clientName: 'Alice Smith',
  status: 'active',
  priority: 'high',
  lastUpdated: new Date().toISOString(),
}

// ─── Setup ───────────────────────────────────────────────────────────────────

const store = {}
beforeEach(() => {
  vi.clearAllMocks()
  Object.keys(store).forEach(k => delete store[k])
  localStorage.getItem.mockImplementation(k => store[k] ?? null)
  localStorage.setItem.mockImplementation((k, v) => { store[k] = v })
  localStorage.removeItem.mockImplementation(k => { delete store[k] })

  appointmentService.getAll.mockResolvedValue([{ ...APT }])
  caseService.getAll.mockResolvedValue([{ ...CASE }])
})

const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>

async function setup() {
  const hook = renderHook(() => useApp(), { wrapper })
  await waitFor(() => expect(hook.result.current.appointmentsLoading).toBe(false))
  await waitFor(() => expect(hook.result.current.casesLoading).toBe(false))
  return hook
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('AppContext', () => {
  describe('initial load', () => {
    it('loads appointments and cases on mount', async () => {
      const { result } = await setup()

      expect(result.current.appointments).toHaveLength(1)
      expect(result.current.appointments[0].title).toBe('Initial Consultation')
      expect(result.current.cases).toHaveLength(1)
      expect(result.current.cases[0].title).toBe('Smith v. Jones')
    })

    it('sets error state when appointments fail to load', async () => {
      appointmentService.getAll.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useApp(), { wrapper })
      await waitFor(() => expect(result.current.appointmentsLoading).toBe(false))

      expect(result.current.appointmentsError).toBe('Network error')
      expect(result.current.appointments).toHaveLength(0)
    })
  })

  // ── Appointment CRUD ────────────────────────────────────────────────────

  describe('createAppointment', () => {
    it('adds the new appointment to state', async () => {
      const created = { ...APT, id: 2, title: 'Follow-up' }
      appointmentService.create.mockResolvedValue(created)

      const { result } = await setup()

      await act(async () => {
        await result.current.createAppointment({
          title: 'Follow-up',
          clientName: 'Jane Doe',
          date: '2025-06-10',
          time: '14:00',
        })
      })

      expect(result.current.appointments).toHaveLength(2)
      expect(result.current.appointments[1].title).toBe('Follow-up')
    })

    it('throws on missing required fields', async () => {
      const { result } = await setup()

      await expect(
        act(async () => result.current.createAppointment({ clientName: 'Jane' }))
      ).rejects.toThrow('title is required')
    })

    it('throws on invalid date format', async () => {
      const { result } = await setup()

      await expect(
        act(async () => result.current.createAppointment({
          title: 'Test', clientName: 'Jane', date: '01-06-2025', time: '10:00',
        }))
      ).rejects.toThrow('YYYY-MM-DD')
    })

    it('throws on invalid status value', async () => {
      const { result } = await setup()

      await expect(
        act(async () => result.current.createAppointment({
          title: 'Test', clientName: 'Jane', date: '2025-06-01', time: '10:00',
          status: 'unknown-status',
        }))
      ).rejects.toThrow('Invalid appointment status')
    })

    it('does not call service when validation fails', async () => {
      const { result } = await setup()

      await act(async () => {
        try { await result.current.createAppointment({}) } catch { /* expected */ }
      })

      expect(appointmentService.create).not.toHaveBeenCalled()
    })
  })

  describe('updateAppointment', () => {
    it('replaces the appointment in state', async () => {
      const updated = { ...APT, title: 'Updated Consultation' }
      appointmentService.update.mockResolvedValue(updated)

      const { result } = await setup()

      await act(async () => {
        await result.current.updateAppointment(1, { title: 'Updated Consultation' })
      })

      expect(result.current.appointments[0].title).toBe('Updated Consultation')
    })

    it('throws on invalid id', async () => {
      const { result } = await setup()

      await expect(
        act(async () => result.current.updateAppointment('abc', { title: 'X' }))
      ).rejects.toThrow('Invalid ID')
    })

    it('throws on invalid status in partial update', async () => {
      const { result } = await setup()

      await expect(
        act(async () => result.current.updateAppointment(1, { status: 'bad-status' }))
      ).rejects.toThrow('Invalid appointment status')
    })
  })

  describe('deleteAppointment', () => {
    it('removes the appointment from state', async () => {
      appointmentService.delete.mockResolvedValue()

      const { result } = await setup()
      expect(result.current.appointments).toHaveLength(1)

      await act(async () => {
        await result.current.deleteAppointment(1)
      })

      expect(result.current.appointments).toHaveLength(0)
    })

    it('throws on invalid id', async () => {
      const { result } = await setup()

      await expect(
        act(async () => result.current.deleteAppointment(null))
      ).rejects.toThrow('Invalid ID')
    })
  })

  // ── Case CRUD ───────────────────────────────────────────────────────────

  describe('createCase', () => {
    it('adds the new case to state', async () => {
      const created = { ...CASE, id: 2, title: 'New Case' }
      caseService.create.mockResolvedValue(created)

      const { result } = await setup()

      await act(async () => {
        await result.current.createCase({ title: 'New Case', clientName: 'Bob' })
      })

      expect(result.current.cases).toHaveLength(2)
      expect(result.current.cases[1].title).toBe('New Case')
    })

    it('throws on missing title', async () => {
      const { result } = await setup()

      await expect(
        act(async () => result.current.createCase({ clientName: 'Bob' }))
      ).rejects.toThrow('title is required')
    })

    it('throws on invalid priority', async () => {
      const { result } = await setup()

      await expect(
        act(async () => result.current.createCase({
          title: 'Test', clientName: 'Bob', priority: 'extreme',
        }))
      ).rejects.toThrow('Invalid case priority')
    })

    it('throws on invalid status', async () => {
      const { result } = await setup()

      await expect(
        act(async () => result.current.createCase({
          title: 'Test', clientName: 'Bob', status: 'archived',
        }))
      ).rejects.toThrow('Invalid case status')
    })
  })

  describe('updateCase', () => {
    it('replaces the case in state', async () => {
      const updated = { ...CASE, status: 'closed' }
      caseService.update.mockResolvedValue(updated)

      const { result } = await setup()

      await act(async () => {
        await result.current.updateCase(1, { status: 'closed' })
      })

      expect(result.current.cases[0].status).toBe('closed')
    })

    it('throws on invalid id', async () => {
      const { result } = await setup()

      await expect(
        act(async () => result.current.updateCase(0, { status: 'active' }))
      ).rejects.toThrow('Invalid ID')
    })
  })

  describe('deleteCase', () => {
    it('removes the case from state', async () => {
      caseService.delete.mockResolvedValue()

      const { result } = await setup()
      expect(result.current.cases).toHaveLength(1)

      await act(async () => {
        await result.current.deleteCase(1)
      })

      expect(result.current.cases).toHaveLength(0)
    })
  })

  // ── AI chat ─────────────────────────────────────────────────────────────

  describe('addAiMessage', () => {
    it('appends a valid message to chat history', async () => {
      const { result } = await setup()

      act(() => {
        result.current.addAiMessage({ role: 'user', content: 'Hello' })
      })

      expect(result.current.aiChatHistory).toHaveLength(1)
      expect(result.current.aiChatHistory[0].content).toBe('Hello')
      expect(result.current.aiChatHistory[0].id).toBeDefined()
    })

    it('throws on invalid role', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      expect(() => {
        act(() => result.current.addAiMessage({ role: 'bot', content: 'Hi' }))
      }).toThrow('Invalid AI message role')
    })

    it('throws on empty content', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      expect(() => {
        act(() => result.current.addAiMessage({ role: 'user', content: '   ' }))
      }).toThrow('non-empty string')
    })

    it('throws when message is not an object', () => {
      const { result } = renderHook(() => useApp(), { wrapper })

      expect(() => {
        act(() => result.current.addAiMessage('just a string'))
      }).toThrow('non-null object')
    })
  })

  describe('clearAiChatHistory', () => {
    it('empties the chat history', async () => {
      const { result } = await setup()

      act(() => result.current.addAiMessage({ role: 'user', content: 'Hello' }))
      expect(result.current.aiChatHistory).toHaveLength(1)

      act(() => result.current.clearAiChatHistory())
      expect(result.current.aiChatHistory).toHaveLength(0)
    })
  })

  // ── useApp guard ─────────────────────────────────────────────────────────

  describe('useApp hook guard', () => {
    it('throws when used outside AppProvider', () => {
      expect(() => renderHook(() => useApp())).toThrow(
        'useApp must be used within an AppProvider'
      )
    })
  })
})
