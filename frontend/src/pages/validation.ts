// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

// Deliberately loose: the backend does the authoritative check.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Enter your email address.'
  if (!EMAIL_PATTERN.test(email.trim())) return 'Enter a valid email address.'
  return null
}

export function validatePassword(password: string): string | null {
  return password ? null : 'Enter your password.'
}

export function validateRestaurantName(name: string): string | null {
  if (!name.trim()) return 'Enter your restaurant name.'
  if (name.trim().length > 255) return 'Use 255 characters or fewer.'
  return null
}

// Mirrors validate_password_policy in backend/app/core/security.py.
export function validateNewPassword(password: string): string | null {
  if (!password) return 'Enter a password.'
  if (password.length < 8) return 'Use at least 8 characters.'
  if (password.length > 128) return 'Use 128 characters or fewer.'
  if (!/[A-Z]/.test(password)) return 'Add an uppercase letter.'
  if (!/[a-z]/.test(password)) return 'Add a lowercase letter.'
  if (!/\d/.test(password)) return 'Add a number.'
  if (!/[^A-Za-z0-9]/.test(password)) return 'Add a symbol, such as ! or #.'
  return null
}

export function validateEula(accepted: boolean): string | null {
  return accepted ? null : 'Agree to the End User License Agreement to continue.'
}
