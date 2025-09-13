import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import DashboardLayout from './components/DashboardLayout'
import AdminDashboard from './pages/AdminDashboard'
import JobsPage from './pages/JobsPage'
import CandidatesPage from './pages/CandidatesPage'
import CandidateProfile from './pages/CandidateProfile'
import AssessmentsPage from './pages/AssessmentsPage'
import AssessmentDetail from './pages/AssessmentDetail'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-base-200 dark:bg-gray-900">
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="candidates" element={<CandidatesPage />} />
              <Route path="candidates/:id" element={<CandidateProfile />} />
              <Route path="assessments" element={<AssessmentsPage />} />
              <Route path="assessments/:id" element={<AssessmentDetail />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App