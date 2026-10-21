// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useRef, useState, type SubmitEvent } from 'react'
import { Link } from 'react-router'
import { AuthError, signup, type AuthUser } from '../api/auth'
import AuthLayout, { FieldError, SubmitButton, TextField } from '../components/auth/AuthLayout'
import EulaDialog, { EULA_VERSION } from '../components/auth/EulaDialog'
import {
  validateEmail,
  validateEula,
  validateNewPassword,
  validateRestaurantName,
} from './validation'

interface SignupPageProps {
  onSignedUp: (user: AuthUser) => void
}

type Field = 'restaurantName' | 'email' | 'password' | 'eula'
type FieldErrors = Record<Field, string | null>

const NO_ERRORS: FieldErrors = { restaurantName: null, email: null, password: null, eula: null }

function SignupPage({ onSignedUp }: SignupPageProps) {
  const [restaurantName, setRestaurantName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [eulaAccepted, setEulaAccepted] = useState(false)
  const [eulaOpen, setEulaOpen] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>(NO_ERRORS)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const restaurantNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const eulaRef = useRef<HTMLInputElement>(null)

  function setError(field: Field, message: string | null) {
    setErrors((current) => ({ ...current, [field]: message }))
  }

  function revalidate(field: Field, message: string | null) {
    if (errors[field]) setError(field, message)
  }

  function answerEula(accepted: boolean) {
    setEulaAccepted(accepted)
    revalidate('eula', validateEula(accepted))
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: FieldErrors = {
      restaurantName: validateRestaurantName(restaurantName),
      email: validateEmail(email),
      password: validateNewPassword(password),
      eula: validateEula(eulaAccepted),
    }
    setErrors(nextErrors)
    setFormError(null)
    const firstInvalid = (Object.keys(nextErrors) as Field[]).find((field) => nextErrors[field])
    if (firstInvalid) {
      const fieldRefs = {
        restaurantName: restaurantNameRef,
        email: emailRef,
        password: passwordRef,
        eula: eulaRef,
      }
      fieldRefs[firstInvalid].current?.focus()
      return
    }

    setSubmitting(true)
    try {
      onSignedUp(
        await signup({
          restaurantName: restaurantName.trim(),
          email: email.trim(),
          password,
          eulaAccepted,
          eulaVersion: EULA_VERSION,
        }),
      )
    } catch (error) {
      setFormError(error instanceof AuthError ? error.message : 'Something went wrong. Try again.')
      restaurantNameRef.current?.focus()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start forecasting ingredient needs."
      error={formError ? { title: 'Could not create account', message: formError } : null}
      footer={
        <>
          Already registered? <Link to="/login" className="auth-link">Log in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <TextField
          id="restaurant-name"
          label="Restaurant name"
          type="text"
          autoComplete="organization"
          placeholder="Your restaurant"
          value={restaurantName}
          error={errors.restaurantName}
          inputRef={restaurantNameRef}
          onChange={(value) => {
            setRestaurantName(value)
            revalidate('restaurantName', validateRestaurantName(value))
          }}
        />

        <TextField
          id="email"
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="you@restaurant.com"
          value={email}
          error={errors.email}
          inputRef={emailRef}
          onChange={(value) => {
            setEmail(value)
            revalidate('email', validateEmail(value))
          }}
          onBlur={() => email && setError('email', validateEmail(email))}
        />

        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          hint="Include upper and lower case letters, a number and a symbol."
          value={password}
          error={errors.password}
          inputRef={passwordRef}
          onChange={(value) => {
            setPassword(value)
            revalidate('password', validateNewPassword(value))
          }}
          onBlur={() => password && setError('password', validateNewPassword(password))}
        />

        <div className="checkbox-field">
          <label className="checkbox-label">
            <input
              ref={eulaRef}
              type="checkbox"
              checked={eulaAccepted}
              onChange={(event) => answerEula(event.target.checked)}
              aria-invalid={errors.eula ? true : undefined}
              aria-describedby={errors.eula ? 'eula-error' : undefined}
            />
            <span>
              I agree to the{' '}
              <button type="button" className="auth-link link-button" onClick={() => setEulaOpen(true)}>
                End User License Agreement
              </button>
            </span>
          </label>
          <FieldError id="eula-error" message={errors.eula} />
        </div>

        {eulaOpen && (
          <EulaDialog
            onAccept={() => {
              answerEula(true)
              setEulaOpen(false)
            }}
            onDecline={() => {
              answerEula(false)
              setEulaOpen(false)
            }}
            onDismiss={() => setEulaOpen(false)}
          />
        )}

        <SubmitButton
          pending={submitting}
          label="Create account"
          pendingLabel="Creating account…"
        />
      </form>
    </AuthLayout>
  )
}

export default SignupPage
