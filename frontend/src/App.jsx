import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useStore from './store/useStore'

// Pages
import LandingPage      from './pages/LandingPage'
import LoginPage        from './pages/LoginPage'
import DashboardPage    from './pages/DashboardPage'
import AlertsPage       from './pages/AlertsPage'
import PredictionsPage  from './pages/PredictionsPage'
import DigitalTwinPage  from './pages/DigitalTwinPage'
import AnalyticsPage    from './pages/AnalyticsPage'
import ReportsPage      from './pages/ReportsPage'
import AdminPage        from './pages/AdminPage'
import ProfilePage      from './pages/ProfilePage'

import AppShell from './components/Dashboard/AppShell'

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1632',
            color: '#f0f4ff',
            border: '1px solid rgba(96,165,250,0.2)',
            borderRadius: '14px',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
          },
          duration: 4000,
          success: { iconTheme: { primary: '#22c55e', secondary: '#0d1632' } },
          error:   { iconTheme: { primary: '#ff2d6b', secondary: '#0d1632' } },
        }}
      />
      <Routes>
        <Route path="/"      element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected shell routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppShell>
                <Routes>
                  <Route path="/dashboard"    element={<DashboardPage />} />
                  <Route path="/alerts"       element={<AlertsPage />} />
                  <Route path="/predictions"  element={<PredictionsPage />} />
                  <Route path="/digital-twin" element={<DigitalTwinPage />} />
                  <Route path="/analytics"    element={<AnalyticsPage />} />
                  <Route path="/reports"      element={<ReportsPage />} />
                  <Route path="/admin"        element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
                  <Route path="/profile"      element={<ProfilePage />} />
                  <Route path="*"             element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </AppShell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
