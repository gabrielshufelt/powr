// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useRef, useState, type SubmitEvent } from 'react'
import { Link } from 'react-router'
import { AuthError, login, type AuthUser } from '../api/auth'
import AuthLayout, { SubmitButton, TextField } from '../components/auth/AuthLayout'
import { validateEmail, validatePassword } from './validation'

interface LoginPageProps {
  onLoggedIn: (user: AuthUser) => void
}

function LoginPage({ onLoggedIn }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextEmailError = validateEmail(email)
    const nextPasswordError = validatePassword(password)
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    setFormError(null)
    if (nextEmailError || nextPasswordError) {
      const firstInvalid = nextEmailError ? emailRef : passwordRef
      firstInvalid.current?.focus()
      return
    }

    setSubmitting(true)
    try {
      onLoggedIn(await login(email.trim(), password))
    } catch (error) {
      setFormError(error instanceof AuthError ? error.message : 'Something went wrong. Try again.')
      passwordRef.current?.focus()
      passwordRef.current?.select()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome"
      subtitle="Log in to your account."
      error={formError ? { title: 'Could not sign in', message: formError } : null}
      footer={
        <>
          New to POWR? <Link to="/signup" className="auth-link">Create an account</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@restaurant.com"
          value={email}
          error={emailError}
          inputRef={emailRef}
          onChange={(value) => {
            setEmail(value)
            if (emailError) setEmailError(validateEmail(value))
          }}
          onBlur={() => email && setEmailError(validateEmail(email))}
        />

        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          error={passwordError}
          inputRef={passwordRef}
          onChange={(value) => {
            setPassword(value)
            if (passwordError) setPasswordError(validatePassword(value))
          }}
        />

        <Link to="/forgot-password" className="auth-link forgot-link">Forgot password?</Link>

        <SubmitButton pending={submitting} label="Log in" pendingLabel="Logging in…" />
      </form>
    </AuthLayout>
  )
}

export default LoginPage
