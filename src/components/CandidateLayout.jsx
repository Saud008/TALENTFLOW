import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import candidateDataService from '../services/candidateDataService'
import { 
  HiChartBar, 
  HiBriefcase, 
  HiBookmark, 
  HiDocumentText, 
  HiClipboardList, 
  HiUser, 
  HiCog,
  HiMenu,
  HiChevronDown,
  HiX,
  HiPencil,
  HiLogout
} from 'react-icons/hi'

const CandidateLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, effectiveTheme, changeTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [savedJobsCount, setSavedJobsCount] = useState(() => {
    const saved = localStorage.getItem('savedJobs')
    return saved ? JSON.parse(saved).length : 0
  })
  const dropdownRef = useRef(null)
  const profile = candidateDataService.getCandidateProfile()

  // Update saved jobs count when localStorage changes
  useEffect(() => {
    const updateSavedJobsCount = () => {
      const saved = localStorage.getItem('savedJobs')
      setSavedJobsCount(saved ? JSON.parse(saved).length : 0)
    }

    // Listen for localStorage changes
    window.addEventListener('storage', updateSavedJobsCount)
    
    // Check for changes periodically (for same-tab updates)
    const interval = setInterval(updateSavedJobsCount, 1000)

    return () => {
      window.removeEventListener('storage', updateSavedJobsCount)
      clearInterval(interval)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navigation = [
    { name: 'Dashboard', href: '/candidate', icon: HiChartBar },
    { name: 'Jobs', href: '/candidate/jobs', icon: HiBriefcase },
    { name: 'Saved Jobs', href: '/candidate/saved-jobs', icon: HiBookmark },
    { name: 'Applications', href: '/candidate/applications', icon: HiDocumentText },
    { name: 'Assessments', href: '/candidate/assessments', icon: HiClipboardList },
    { name: 'Profile', href: '/candidate/profile', icon: HiUser },
    { name: 'Settings', href: '/candidate/settings', icon: HiCog },
  ]

  const isActive = (href) => {
    if (href === '/candidate') {
      return location.pathname === '/candidate'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">

                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <span className="text-xl font-bold text-white">TalentFlow</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-nav-item flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                 <div className="flex items-center">
                   <item.icon className="w-5 h-5 mr-3" />
                   {item.name}
                 </div>
                {item.name === 'Saved Jobs' && savedJobsCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {savedJobsCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{profile.firstName.charAt(0)}{profile.lastName.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {profile.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
             <button
               onClick={() => setSidebarOpen(true)}
               className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
             >
               <HiMenu className="w-6 h-6" />
             </button>

            <div className="flex items-center space-x-4">
              {/* Theme toggle switch */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {effectiveTheme === 'light' ? 'Light' : 'Dark'}
                </span>
                <button
                  onClick={() => changeTheme(effectiveTheme === 'light' ? 'dark' : 'light')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    effectiveTheme === 'dark' 
                      ? 'bg-blue-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      effectiveTheme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Notifications */}
              {/* <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
                </svg>
              </button> */}

              {/* Profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{profile.firstName.charAt(0)}{profile.lastName.charAt(0)}</span>
                  </div>
                   <span className="hidden sm:block text-sm font-medium">{profile.firstName} {profile.lastName}</span>
                   <HiChevronDown className={`w-4 h-4 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{profile.firstName.charAt(0)}{profile.lastName.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {profile.firstName} {profile.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {profile.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Items */}
                    <div className="py-1">
                       <button
                         onClick={() => {
                           navigate('/candidate/profile')
                           setProfileDropdownOpen(false)
                         }}
                         className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                       >
                         <HiUser className="w-4 h-4" />
                         <span>View Profile</span>
                       </button>
                      
                       <button
                         onClick={() => {
                           setShowEditProfileModal(true)
                           setProfileDropdownOpen(false)
                         }}
                         className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                       >
                         <HiPencil className="w-4 h-4" />
                         <span>Edit Profile</span>
                       </button>

                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      
                       <button
                         onClick={() => {
                           // Handle logout
                           navigate('/')
                           setProfileDropdownOpen(false)
                         }}
                         className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                       >
                         <HiLogout className="w-4 h-4" />
                         <span>Logout</span>
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
               <button
                 onClick={() => setShowEditProfileModal(false)}
                 className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
               >
                 <HiX className="w-6 h-6" />
               </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.firstName}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.lastName}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={profile.email}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    defaultValue={profile.title}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    defaultValue={profile.phone}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateLayout
