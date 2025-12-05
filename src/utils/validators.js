export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone) {
  const phoneRegex = /^\+?[\d\s-()]+$/
  return phoneRegex.test(phone)
}

export function validatePassword(password) {
  return password.length >= 8
}

export function validateRequired(value) {
  return value !== null && value !== undefined && value.trim() !== ''
}
