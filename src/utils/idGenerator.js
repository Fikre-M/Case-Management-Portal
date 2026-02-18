/**
 * ID Generator Utility
 * Provides efficient ID generation strategies
 */

// Store last generated IDs for each entity type
const lastIds = new Map()

/**
 * Generate next ID efficiently without iterating through entire array
 * @param {string} entityType - Type of entity (e.g., 'appointment', 'case')
 * @param {Array} existingItems - Existing items (optional, for initialization)
 * @returns {number} Next available ID
 */
export function generateId(entityType, existingItems = null) {
  // Initialize last ID if not set
  if (!lastIds.has(entityType)) {
    if (existingItems && existingItems.length > 0) {
      // Find max ID only once during initialization
      const maxId = Math.max(...existingItems.map(item => item.id || 0))
      lastIds.set(entityType, maxId)
    } else {
      lastIds.set(entityType, 0)
    }
  }

  // Increment and return
  const nextId = lastIds.get(entityType) + 1
  lastIds.set(entityType, nextId)
  return nextId
}

/**
 * Reset ID counter for an entity type (useful for testing)
 * @param {string} entityType - Type of entity
 */
export function resetIdCounter(entityType) {
  lastIds.delete(entityType)
}

/**
 * Generate UUID v4 (for more robust ID generation)
 * @returns {string} UUID
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * Generate timestamp-based ID (guaranteed unique)
 * @returns {number} Timestamp-based ID
 */
export function generateTimestampId() {
  return Date.now() + Math.floor(Math.random() * 1000)
}

/**
 * Initialize ID counter from existing data
 * @param {string} entityType - Type of entity
 * @param {Array} items - Existing items
 */
export function initializeIdCounter(entityType, items) {
  if (items && items.length > 0) {
    const maxId = Math.max(...items.map(item => item.id || 0))
    lastIds.set(entityType, maxId)
  }
}
