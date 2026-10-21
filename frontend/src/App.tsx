// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import type { AuthUser } from './api/auth'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

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
            </main>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
