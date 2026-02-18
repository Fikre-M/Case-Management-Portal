import { describe, it, expect, beforeEach } from 'vitest'
import {
  sanitizeHTML,
  sanitizeInput,
  validateEmail,
  validatePassword,
  sanitizeFormData,
  RateLimiter,
  SecurityAudit
} from '../security'

describe('Security Utilities', () => {
  describe('sanitizeHTML', () => {
    it('should escape HTML entities', () => {
      const malicious = '<script>alert("xss")</script>'
      const sanitized = sanitizeHTML(malicious)
      expect(sanitized).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
    })

    it('should handle various XSS attempts', () => {
      const tests = [
        { input: '<img src=x onerror=alert(1)>', expected: '&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;' },
        { input: 'javascript:alert(1)', expected: 'javascript:alert(1)' },
        { input: '<iframe src="javascript:alert(1)"></iframe>', expected: '&lt;iframe src&#x3D;&quot;javascript:alert(1)&quot;&gt;&lt;/iframe&gt;' }
      ]

      tests.forEach(({ input, expected }) => {
        expect(sanitizeHTML(input)).toBe(expected)
      })
    })

    it('should handle non-string inputs', () => {
      expect(sanitizeHTML(null)).toBe(null)
      expect(sanitizeHTML(undefined)).toBe(undefined)
      expect(sanitizeHTML(123)).toBe(123)
    })
  })

  describe('sanitizeInput', () => {
    it('should sanitize with default options', () => {
      const input = '  <script>alert("xss")</script>  '
      const result = sanitizeInput(input)
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
    })

    it('should respect maxLength option', () => {
      const input = 'a'.repeat(100)
      const result = sanitizeInput(input, { maxLength: 10 })
      expect(result).toBe('a'.repeat(10))
    })

    it('should preserve HTML when allowHTML is true', () => {
      const input = '<b>Bold text</b>'
      const result = sanitizeInput(input, { allowHTML: true })
      expect(result).toBe('<b>Bold text</b>')
    })

    it('should remove control characters', () => {
      const input = 'test\x00\x01\x1Fstring'
      const result = sanitizeInput(input, { removeControlChars: true })
      expect(result).toBe('teststring')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ]

      validEmails.forEach(email => {
        const result = validateEmail(email)
        expect(result.isValid).toBe(true)
        expect(result.sanitized).toBe(email.toLowerCase())
      })
    })

    it('should reject invalid emails', () => {
      const invalidEmails = [
        '',
        'invalid',
        '@example.com',
        'test@',
        'test..test@example.com'
      ]

      invalidEmails.forEach(email => {
        const result = validateEmail(email)
        expect(result.isValid).toBe(false)
        expect(result.error).toBeDefined()
      })
    })

    it('should detect dangerous patterns', () => {
      const dangerousEmails = [
        'test@example.com<script>alert(1)</script>',
        'javascript:alert(1)@example.com',
        'test@example.com onload=alert(1)'
      ]

      dangerousEmails.forEach(email => {
        const result = validateEmail(email)
        expect(result.isValid).toBe(false)
        expect(result.error).toContain('Invalid characters')
      })
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const strongPassword = 'StrongP@ssw0rd123'
      const result = validatePassword(strongPassword)
      
      expect(result.isValid).toBe(true)
      expect(result.strength).toBeGreaterThan(80)
      expect(result.checks.length).toBe(true)
      expect(result.checks.uppercase).toBe(true)
      expect(result.checks.lowercase).toBe(true)
      expect(result.checks.numbers).toBe(true)
      expect(result.checks.symbols).toBe(true)
    })

    it('should reject weak passwords', () => {
      const weakPasswords = [
        '',
        '123',
        'password',
        '123456',
        'qwerty'
      ]

      weakPasswords.forEach(password => {
        const result = validatePassword(password)
        expect(result.isValid).toBe(false)
        expect(result.error).toBeDefined()
      })
    })

    it('should calculate strength correctly', () => {
      const tests = [
        { password: 'abc', expectedStrength: 0 },
        { password: 'abcdef', expectedStrength: 33 },
        { password: 'Abcdef1!', expectedStrength: 100 }
      ]

      tests.forEach(({ password, expectedStrength }) => {
        const result = validatePassword(password)
        expect(result.strength).toBeCloseTo(expectedStrength, 0)
      })
    })
  })

  describe('sanitizeFormData', () => {
    it('should sanitize form data according to config', () => {
      const formData = {
        name: '<script>alert("xss")</script>',
        email: 'USER@EXAMPLE.COM',
        bio: 'Some bio text with <b>HTML</b>'
      }

      const config = {
        name: { maxLength: 50 },
        email: { type: 'email' },
        bio: { maxLength: 500, allowHTML: false }
      }

      const result = sanitizeFormData(formData, config)

      expect(result.name).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
      expect(result.email).toBe('user@example.com')
      expect(result.bio).toBe('Some bio text with &lt;b&gt;HTML&lt;/b&gt;')
    })
  })

  describe('RateLimiter', () => {
    let rateLimiter

    beforeEach(() => {
      rateLimiter = new RateLimiter(3, 1000) // 3 attempts per second
    })

    it('should allow requests within limit', () => {
      const result1 = rateLimiter.checkLimit('user1')
      const result2 = rateLimiter.checkLimit('user1')
      const result3 = rateLimiter.checkLimit('user1')

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(true)
      expect(result3.remaining).toBe(0)
    })

    it('should block requests over limit', () => {
      // Use up the limit
      rateLimiter.checkLimit('user1')
      rateLimiter.checkLimit('user1')
      rateLimiter.checkLimit('user1')

      // This should be blocked
      const result = rateLimiter.checkLimit('user1')
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
      expect(result.retryAfter).toBeGreaterThan(0)
    })

    it('should handle different users separately', () => {
      // Use up limit for user1
      rateLimiter.checkLimit('user1')
      rateLimiter.checkLimit('user1')
      rateLimiter.checkLimit('user1')

      // user2 should still be allowed
      const result = rateLimiter.checkLimit('user2')
      expect(result.allowed).toBe(true)
    })

    it('should reset attempts for a user', () => {
      // Use up limit
      rateLimiter.checkLimit('user1')
      rateLimiter.checkLimit('user1')
      rateLimiter.checkLimit('user1')

      // Reset and try again
      rateLimiter.reset('user1')
      const result = rateLimiter.checkLimit('user1')
      expect(result.allowed).toBe(true)
    })
  })

  describe('SecurityAudit', () => {
    let audit

    beforeEach(() => {
      audit = new SecurityAudit()
    })

    it('should log security events', () => {
      audit.logEvent('TEST_EVENT', { detail: 'test' })
      
      const events = audit.getEvents()
      expect(events).toHaveLength(1)
      expect(events[0].type).toBe('TEST_EVENT')
      expect(events[0].detail).toBe('test')
      expect(events[0].timestamp).toBeDefined()
    })

    it('should filter events by type', () => {
      audit.logEvent('LOGIN_SUCCESS', { userId: 1 })
      audit.logEvent('LOGIN_FAILURE', { email: 'test@example.com' })
      audit.logEvent('LOGIN_SUCCESS', { userId: 2 })

      const loginSuccesses = audit.getEvents('LOGIN_SUCCESS')
      expect(loginSuccesses).toHaveLength(2)
      
      const loginFailures = audit.getEvents('LOGIN_FAILURE')
      expect(loginFailures).toHaveLength(1)
    })

    it('should limit stored events', () => {
      // Add more than 100 events
      for (let i = 0; i < 150; i++) {
        audit.logEvent('TEST_EVENT', { index: i })
      }

      const events = audit.getEvents()
      expect(events).toHaveLength(100)
      
      // Should keep the most recent events
      expect(events[0].index).toBe(50) // First kept event
      expect(events[99].index).toBe(149) // Last event
    })
  })
})