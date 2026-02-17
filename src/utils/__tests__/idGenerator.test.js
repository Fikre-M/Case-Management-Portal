import { describe, it, expect, beforeEach } from 'vitest'
import { 
  generateId, 
  resetIdCounter, 
  generateUUID, 
  generateTimestampId,
  initializeIdCounter 
} from '../idGenerator'

describe('ID Generator', () => {
  beforeEach(() => {
    resetIdCounter('test')
  })

  describe('generateId', () => {
    it('should generate sequential IDs', () => {
      const id1 = generateId('test')
      const id2 = generateId('test')
      const id3 = generateId('test')

      expect(id1).toBe(1)
      expect(id2).toBe(2)
      expect(id3).toBe(3)
    })

    it('should maintain separate counters for different entity types', () => {
      const appointmentId1 = generateId('appointment')
      const caseId1 = generateId('case')
      const appointmentId2 = generateId('appointment')

      expect(appointmentId1).toBe(1)
      expect(caseId1).toBe(1)
      expect(appointmentId2).toBe(2)
    })

    it('should initialize from existing items', () => {
      const existingItems = [
        { id: 5 },
        { id: 10 },
        { id: 3 }
      ]

      const id = generateId('test', existingItems)
      expect(id).toBe(11) // Max is 10, so next is 11
    })

    it('should handle empty array', () => {
      const id = generateId('test', [])
      expect(id).toBe(1)
    })

    it('should be O(1) after initialization', () => {
      // Initialize with large array
      const largeArray = Array.from({ length: 10000 }, (_, i) => ({ id: i + 1 }))
      
      const start = performance.now()
      generateId('performance', largeArray)
      const firstCallTime = performance.now() - start

      // Subsequent calls should be much faster
      const start2 = performance.now()
      generateId('performance')
      const secondCallTime = performance.now() - start2

      // Second call should be significantly faster (no array iteration)
      expect(secondCallTime).toBeLessThan(firstCallTime)
    })
  })

  describe('resetIdCounter', () => {
    it('should reset counter to start from 1', () => {
      generateId('test')
      generateId('test')
      generateId('test')

      resetIdCounter('test')

      const id = generateId('test')
      expect(id).toBe(1)
    })
  })

  describe('generateUUID', () => {
    it('should generate valid UUID format', () => {
      const uuid = generateUUID()
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      
      expect(uuid).toMatch(uuidRegex)
    })

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID()
      const uuid2 = generateUUID()
      const uuid3 = generateUUID()

      expect(uuid1).not.toBe(uuid2)
      expect(uuid2).not.toBe(uuid3)
      expect(uuid1).not.toBe(uuid3)
    })
  })

  describe('generateTimestampId', () => {
    it('should generate numeric ID', () => {
      const id = generateTimestampId()
      expect(typeof id).toBe('number')
    })

    it('should generate unique IDs', () => {
      const id1 = generateTimestampId()
      const id2 = generateTimestampId()
      
      expect(id1).not.toBe(id2)
    })

    it('should be based on timestamp', () => {
      const id = generateTimestampId()
      const now = Date.now()
      
      // ID should be close to current timestamp
      expect(id).toBeGreaterThan(now - 1000)
      expect(id).toBeLessThan(now + 1000)
    })
  })

  describe('initializeIdCounter', () => {
    it('should initialize counter from items', () => {
      const items = [{ id: 5 }, { id: 10 }, { id: 3 }]
      
      initializeIdCounter('test', items)
      const nextId = generateId('test')
      
      expect(nextId).toBe(11)
    })

    it('should handle empty array', () => {
      initializeIdCounter('test', [])
      const nextId = generateId('test')
      
      expect(nextId).toBe(1)
    })
  })
})
