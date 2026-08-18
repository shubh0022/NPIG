import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useStore from './store/useStore'

// Public Pages
import LandingPage    from './pages/LandingPage'
import SolutionsPage  from './pages/SolutionsPage'
import AboutPage      from './pages/AboutPage'
import ResourcesPage  from './pages/ResourcesPage'
import ContactPage    from './pages/ContactPage'
import NexusPage      from './pages/NexusPage'
import LoginPage      from './pages/LoginPage'

// Protected Platform / Dashboard Pages
import DashboardPage  from './pages/DashboardPage'
import AlertsPage     from './pages/AlertsPage'
import IncidentsPage  from './pages/IncidentsPage'
import AnalyticsPage  from './pages/AnalyticsPage'
import PredictionsPage from './pages/PredictionsPage'
import ReportsPage    from './pages/ReportsPage'
import DataCenterPage from './pages/DataCenterPage'
import UsersTeamsPage from './pages/UsersTeamsPage'
import SettingsPage   from './pages/SettingsPage'
import DigitalTwinPage from './pages/DigitalTwinPage'
import SecurityPage   from './pages/SecurityPage'
import AdminPage      from './pages/AdminPage'
import ProfilePage    from './pages/ProfilePage'

import AppShell from './components/Dashboard/AppShell'

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { theme } = useStore()

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'light' ? '#FFFFFF' : '#0B1020',
            color: theme === 'light' ? '#111827' : '#F8FAFC',
            border: theme === 'light' ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          },
          duration: 4000,
          success: { iconTheme: { primary: '#10B981', secondary: theme === 'light' ? '#FFFFFF' : '#0B1020' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: theme === 'light' ? '#FFFFFF' : '#0B1020' } },
        }}
      />
      <Routes>
        {/* ── Public Routes Matching Reference Navigation ── */}
        <Route path="/"            element={<LandingPage />} />
        <Route path="/solutions"   element={<SolutionsPage />} />
        <Route path="/about"       element={<AboutPage />} />
        <Route path="/resources"   element={<ResourcesPage />} />
        <Route path="/contact"     element={<ContactPage />} />
        <Route path="/login"       element={<LoginPage />} />

        {/* ── Protected Command Center / Platform Shell Routes ── */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppShell>
                <Routes>
                  <Route path="/dashboard"    element={<DashboardPage />} />
                  <Route path="/platform"     element={<DashboardPage />} />
                  <Route path="/alerts"       element={<AlertsPage />} />
                  <Route path="/incidents"    element={<IncidentsPage />} />
                  <Route path="/analytics"    element={<AnalyticsPage />} />
                  <Route path="/predictions"  element={<PredictionsPage />} />
                  <Route path="/reports"      element={<ReportsPage />} />
                  <Route path="/data-center"  element={<DataCenterPage />} />
                  <Route path="/users"        element={<UsersTeamsPage />} />
                  <Route path="/profile"      element={<UsersTeamsPage />} />
                  <Route path="/settings"     element={<SettingsPage />} />
                  <Route path="/nexus"        element={<NexusPage />} />
                  <Route path="/digital-twin" element={<DigitalTwinPage />} />
                  <Route path="/security"     element={<SecurityPage />} />
                  <Route path="/admin"        element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
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
