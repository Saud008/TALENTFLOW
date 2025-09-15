import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { setupMSW } from './services/mswHandlers'
import { initDexie } from './services/dexie'

// Pages
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import JobsPage from './pages/JobsPage'
import JobDetail from './pages/JobDetail'
import CandidatesPage from './pages/CandidatesPage'
import CandidateDetail from './pages/CandidateDetail'
import AssessmentPage from './pages/AssessmentPage'

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore()

  useEffect(() => {
    // #initialize msw and dexie on app start
    const initializeApp = async () => {
      await setupMSW()
      await initDexie()
      checkAuth()
    }
    initializeApp()
  }, [checkAuth])

  return (
    <div className="min-h-screen bg-base-200">
      <Routes>
        <Route 
          path="/admin/login" 
          element={!isAuthenticated ? <AdminLogin /> : <Navigate to="/admin" replace />} 
        />
        <Route 
          path="/admin" 
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} 
        />
        <Route 
          path="/jobs" 
          element={isAuthenticated ? <JobsPage /> : <Navigate to="/admin/login" replace />} 
        />
        <Route 
          path="/jobs/:jobId" 
          element={isAuthenticated ? <JobDetail /> : <Navigate to="/admin/login" replace />} 
        />
        <Route 
          path="/candidates" 
          element={isAuthenticated ? <CandidatesPage /> : <Navigate to="/admin/login" replace />} 
        />
        <Route 
          path="/candidates/:id" 
          element={isAuthenticated ? <CandidateDetail /> : <Navigate to="/admin/login" replace />} 
        />
        <Route 
          path="/assessments/:jobId" 
          element={isAuthenticated ? <AssessmentPage /> : <Navigate to="/admin/login" replace />} 
        />
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </div>
  )
}

export default App
