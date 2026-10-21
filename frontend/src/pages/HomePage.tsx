// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useState } from 'react'
import { logout, type AuthUser } from '../api/auth'

interface HomePageProps {
  user: AuthUser
  onLoggedOut: () => void
}

// Placeholder until the dashboard exists.
function HomePage({ user, onLoggedOut }: HomePageProps) {
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      onLoggedOut()
    } catch {
      // Stay on the page when the server cannot be reached. The session is still valid.
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <main>
      <h1>powr</h1>
      <p>Logged in as {user.email}</p>
      <button type="button" onClick={() => void handleLogout()} disabled={loggingOut}>
        {loggingOut ? 'Logging out…' : 'Log out'}
      </button>
    </main>
  )
}

export default HomePage
