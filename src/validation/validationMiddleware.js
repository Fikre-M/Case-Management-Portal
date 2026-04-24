import { ZodError, ZodType } from 'zod'
import { reportError } from '../services/errorReporter'
import { validation } from '../utils/logger'

/**
 * Validation error class for API response validation failures
 */
export class ValidationError extends Error {
  constructor(message, schema, data, zodError) {
    super(message)
    this.name = 'ValidationError'
    this.schema = schema
    this.data = data
    this.zodError = zodError
    this.timestamp = new Date().toISOString()
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      schema: this.schema,
      data: this.data,
      zodError: this.zodError?.errors || [],
      timestamp: this.timestamp,
    }
  }
}

/**
 * Validates API response data against a Zod schema
 * @param {any} data - The data to validate
 * @param {ZodType} schema - The Zod schema to validate against
 * @param {string} context - Context for error reporting (e.g., 'appointmentService.getAll')
 * @returns {any} - The validated and parsed data
 * @throws {ValidationError} - If validation fails
 */
export function validateApiResponse(data, schema, context = 'API Response') {
  try {
    // Handle null/undefined data gracefully
    if (data === null || data === undefined) {
      throw new ValidationError(
        'API response data is null or undefined',
        schema.description || context,
        data
      )
    }

    // Parse and validate the data
    const validatedData = schema.parse(data)
    
    // Log successful validation
    validation(`Validation successful for ${context}`, {
      dataType: schema.description || context,
      dataKeys: Object.keys(validatedData),
      isArray: Array.isArray(validatedData),
      itemCount: Array.isArray(validatedData) ? validatedData.length : null,
    }, true)

    return validatedData
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = new ValidationError(
        `API response validation failed for ${context}`,
        schema.description || context,
        data,
        error
      )

      // Report validation error to error tracking service
      reportError(validationError, {
        context,
        schema: schema.description || context,
        dataType: Array.isArray(data) ? 'array' : typeof data,
        itemCount: Array.isArray(data) ? data.length : null,
      })

      // Log validation error
      validation(`Validation failed for ${context}`, {
        errors: error.errors,
        data,
        schema: schema.description || context,
      }, false)

      throw validationError
    }
    throw error
  }
}

/**
 * Higher-order function that wraps an API service method with validation
 * @param {Function} apiMethod - The API service method to wrap
 * @param {ZodType} responseSchema - The schema to validate the response against
 * @param {string} context - Context for error reporting
 * @returns {Function} - The wrapped API method with validation
 */
export function withValidation(apiMethod, responseSchema, context) {
  return async (...args) => {
    try {
      // Call the original API method
      const response = await apiMethod(...args)
      
      // Validate the response
      const validatedResponse = validateApiResponse(response, responseSchema, context)
      
      return validatedResponse
    } catch (error) {
      // If it's already a ValidationError, re-throw it
      if (error instanceof ValidationError) {
        throw error
      }
      
      // For other errors, wrap them in a ValidationError if they contain invalid data
      if (error.response?.data) {
        try {
          validateApiResponse(error.response.data, responseSchema, context)
        } catch (validationError) {
          throw validationError
        }
      }
      
      // Re-throw the original error
      throw error
    }
  }
}

/**
 * Validates request data before sending to API
 * @param {any} data - The request data to validate
 * @param {ZodType} schema - The schema to validate against
 * @param {string} context - Context for error reporting
 * @returns {any} - The validated and parsed request data
 * @throws {ValidationError} - If validation fails
 */
export function validateApiRequest(data, schema, context = 'API Request') {
  try {
    const validatedData = schema.parse(data)
    
    // Log successful request validation
    validation(`Request validation successful for ${context}`, {
      dataType: schema.description || context,
      dataKeys: Object.keys(validatedData),
    }, true)

    return validatedData
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = new ValidationError(
        `API request validation failed for ${context}`,
        schema.description || context,
        data,
        error
      )

      // Log request validation error
      validation(`Request validation failed for ${context}`, {
        errors: error.errors,
        data,
        schema: schema.description || context,
      }, false)

      throw validationError
    }
    throw error
  }
}

/**
 * React hook for validating API responses with loading states
 * @param {ZodType} schema - The schema to validate against
 * @returns {Object} - Validation utilities and state
 */
export function useValidation(schema) {
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState(null)

  const validate = useCallback((data, context) => {
    setIsValidating(true)
    setValidationError(null)
    
    try {
      const result = validateApiResponse(data, schema, context)
      setIsValidating(false)
      return result
    } catch (error) {
      setValidationError(error)
      setIsValidating(false)
      throw error
    }
  }, [schema])

  const clearError = useCallback(() => {
    setValidationError(null)
  }, [])

  return {
    validate,
    isValidating,
    validationError,
    clearError,
  }
}

/**
 * Safe validation that returns null instead of throwing errors
 * Useful for optional validation where you want to handle errors gracefully
 * @param {any} data - The data to validate
 * @param {ZodType} schema - The schema to validate against
 * @param {string} context - Context for error reporting
 * @returns {any|null} - The validated data or null if validation fails
 */
export function safeValidate(data, schema, context = 'Safe Validation') {
  try {
    return validateApiResponse(data, schema, context)
  } catch (error) {
    validation(`Safe validation failed for ${context}`, { error: error.message }, false)
    return null
  }
}

/**
 * Validates partial data (useful for updates and patches)
 * @param {any} data - The partial data to validate
 * @param {ZodType} schema - The base schema (will be made partial)
 * @param {string} context - Context for error reporting
 * @returns {any} - The validated partial data
 */
export function validatePartial(data, schema, context = 'Partial Validation') {
  const partialSchema = schema.partial()
  return validateApiResponse(data, partialSchema, context)
}

/**
 * Batch validation for multiple data items
 * @param {any[]} dataArray - Array of data items to validate
 * @param {ZodType} schema - The schema to validate against
 * @param {string} context - Context for error reporting
 * @returns {any[]} - Array of validated data items
 * @throws {ValidationError} - If any validation fails
 */
export function validateBatch(dataArray, schema, context = 'Batch Validation') {
  if (!Array.isArray(dataArray)) {
    throw new ValidationError(
      'Batch validation requires an array of data',
      schema.description || context,
      dataArray
    )
  }

  const results = []
  const errors = []

  dataArray.forEach((data, index) => {
    try {
      const validatedData = validateApiResponse(data, schema, `${context}[${index}]`)
      results.push(validatedData)
    } catch (error) {
      errors.push({ index, error })
    }
  })

  if (errors.length > 0) {
    throw new ValidationError(
      `Batch validation failed for ${errors.length} items`,
      schema.description || context,
      { errors, totalCount: dataArray.length }
    )
  }

  return results
}

// Import useState and useCallback for React hooks
import { useState, useCallback } from 'react'
