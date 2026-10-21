// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { describe, expect, it } from 'vitest'
import {
  validateEmail,
  validateEula,
  validateNewPassword,
  validatePassword,
  validateRestaurantName,
} from '../src/pages/validation'

describe('validateEmail', () => {
  it('requires an email', () => {
    expect(validateEmail('   ')).toBe('Enter your email address.')
  })

  it('rejects a malformed email', () => {
    expect(validateEmail('chef@restaurant')).toBe('Enter a valid email address.')
  })

  it('accepts a well-formed email', () => {
    expect(validateEmail(' chef@restaurant.com ')).toBeNull()
  })
})

describe('validatePassword', () => {
  it('requires a password', () => {
    expect(validatePassword('')).toBe('Enter your password.')
  })

  it('accepts any non-empty password', () => {
    expect(validatePassword('x')).toBeNull()
  })
})

describe('validateRestaurantName', () => {
  it('requires a non-blank name', () => {
    expect(validateRestaurantName('   ')).toBe('Enter your restaurant name.')
  })

  it('caps the length at 255 characters', () => {
    expect(validateRestaurantName('a'.repeat(256))).toBe('Use 255 characters or fewer.')
    expect(validateRestaurantName('a'.repeat(255))).toBeNull()
  })
})

describe('validateNewPassword', () => {
  it.each([
    ['', 'Enter a password.'],
    ['Ab1!', 'Use at least 8 characters.'],
    [`Ab1!${'a'.repeat(125)}`, 'Use 128 characters or fewer.'],
    ['abcdefg1!', 'Add an uppercase letter.'],
    ['ABCDEFG1!', 'Add a lowercase letter.'],
    ['Abcdefgh!', 'Add a number.'],
    ['Abcdefgh1', 'Add a symbol, such as ! or #.'],
  ])('rejects %j', (password, message) => {
    expect(validateNewPassword(password)).toBe(message)
  })

  it('accepts a password that meets the backend policy', () => {
    expect(validateNewPassword('TestRestaurant1!')).toBeNull()
  })
})

describe('validateEula', () => {
  it('requires acceptance', () => {
    expect(validateEula(false)).not.toBeNull()
    expect(validateEula(true)).toBeNull()
  })
})
