import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import { UserProvider } from './contexts/UserContext'
import AOS from 'aos'
import 'aos/dist/aos.css'
import DashboardLayout from './components/DashboardLayout'
import CandidateLayout from './components/CandidateLayout'
import AdminDashboard from './pages/AdminDashboard'
import JobsPage from './pages/JobsPage'
import CandidatesPage from './pages/CandidatesPage'
import CandidateProfile from './pages/CandidateProfile'
import AssessmentsPage from './pages/AssessmentsPage'
import AssessmentDetail from './pages/AssessmentDetail'
import SettingsPage from './pages/SettingsPage'
import CandidateDashboard from './pages/CandidateDashboard'
import CandidateJobs from './pages/CandidateJobs'
import CandidateSavedJobs from './pages/CandidateSavedJobs'
import CandidateApplications from './pages/CandidateApplications'
import CandidateAssessments from './pages/CandidateAssessments'
import TakeAssessment from './pages/TakeAssessment'
import AssessmentResult from './pages/AssessmentResult'
import CandidateSettings from './pages/CandidateSettings'
import JobApplication from './pages/JobApplication'

function App() {
  useEffect(() => {
    // Initialize AOS with error handling
    try {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100,
      })
    } catch (error) {
      console.warn('AOS initialization failed:', error)
    }
  }, [])

  return (
    <ThemeProvider>
      <ToastProvider>
        <UserProvider>
          <div className="min-h-screen bg-base-200 dark:bg-gray-900">
          <Routes>
            {/* Admin Portal Routes */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="candidates" element={<CandidatesPage />} />
              <Route path="candidates/:id" element={<CandidateProfile />} />
              <Route path="assessments" element={<AssessmentsPage />} />
              <Route path="assessments/:id" element={<AssessmentDetail />} />
              <Route path="assessments/:id/edit" element={<AssessmentDetail />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
        {/* Candidate Portal Routes */}
        <Route path="/candidate" element={<CandidateLayout />}>
          <Route index element={<CandidateDashboard />} />
          <Route path="jobs" element={<CandidateJobs />} />
          <Route path="jobs/:jobId" element={<JobApplication />} />
          <Route path="saved-jobs" element={<CandidateSavedJobs />} />
          <Route path="applications" element={<CandidateApplications />} />
          <Route path="assessments" element={<CandidateAssessments />} />
          <Route path="profile" element={<CandidateProfile />} />
          <Route path="settings" element={<CandidateSettings />} />
        </Route>

        {/* Assessment Routes (outside layout for full-screen experience) */}
        <Route path="/candidate/assessments/:assessmentId/take" element={<TakeAssessment />} />
        <Route path="/candidate/assessments/:assessmentId/result" element={<AssessmentResult />} />

            {/* Root redirect to admin */}
            <Route path="/" element={<Navigate to="/candidate" replace />} />
          </Routes>
          </div>
        </UserProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App