// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router'
import type { AuthUser } from './api/auth'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ToastSettingsPage from './pages/ToastSettingsPage'

function App() {
  const [user, setUser] = useState<AuthUser | null>(null)

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage onLoggedIn={setUser} />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <SignupPage onSignedUp={setUser} />}
      />
      <Route
        path="/"
        element={
          user ? (
            // Placeholder until the dashboard exists.
            <main>
              <h1>powr</h1>
              <p>Logged in as {user.email}</p>
              {user.role === 'owner' && <Link to="/settings/pos">Manage Toast connection</Link>}
            </main>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/settings/pos" element={user
        ? <ToastSettingsPage key={user.restaurant_id} user={user} />
        : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
