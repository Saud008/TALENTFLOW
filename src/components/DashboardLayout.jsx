import { useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useUser } from '../contexts/UserContext'
import { 
  HiChartBar, 
  HiBriefcase, 
  HiUsers, 
  HiDocumentText, 
  HiCog,
  HiUser,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { theme } = useTheme()
  const { user } = useUser()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HiChartBar },
    { name: 'Jobs', href: '/admin/jobs', icon: HiBriefcase },
    { name: 'Candidates', href: '/admin/candidates', icon: HiUsers },
    { name: 'Assessments', href: '/admin/assessments', icon: HiDocumentText },
    { name: 'Settings', href: '/admin/settings', icon: HiCog },
  ]

  const candidatePortalLink = { name: 'Candidate Portal', href: '/candidate', icon: HiUser, external: true }

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex h-screen bg-base-200 dark:bg-gray-900">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } fixed lg:relative z-50 lg:z-auto sidebar-transition bg-white dark:bg-gray-800 shadow-lg flex flex-col h-full`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-base-300 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">TF</span>
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">TalentFlow</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`sidebar-nav-item flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
          
          {/* Candidate Portal Link */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to={candidatePortalLink.href}
              className="sidebar-nav-item flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <candidatePortalLink.icon className="w-5 h-5 mr-3" />
              {sidebarOpen && <span>{candidatePortalLink.name}</span>}
            </Link>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-base-300 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.avatar}
            </div>
            {sidebarOpen && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button - Desktop */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:block absolute top-4 right-4 p-2 rounded-lg bg-base-200 dark:bg-gray-700 hover:bg-base-300 dark:hover:bg-gray-600 transition-colors"
        >
          {sidebarOpen ? <HiChevronLeft className="w-4 h-4" /> : <HiChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">TalentFlow</h1>
          <div className="w-10"></div>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
