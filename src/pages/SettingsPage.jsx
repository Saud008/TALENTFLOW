import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'
import { dataService } from '../services/dataService'

const SettingsPage = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const { theme, effectiveTheme, systemTheme, changeTheme } = useTheme()
  const { addToast } = useToast()

  // Handle theme change with immediate feedback
  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme)
    // Provide immediate feedback
    addToast(`Switched to ${newTheme === 'auto' ? 'Auto (System)' : newTheme === 'dark' ? 'Dark' : 'Light'} mode`, 'success')
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    const savedSettings = dataService.getSettings()
    setSettings(savedSettings)
    setLoading(false)
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validatePasswordForm = () => {
    const newErrors = {}
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    
    if (!validatePasswordForm()) return
    
    // Simulate password change
    setTimeout(() => {
      addToast('Password changed successfully!', 'success')
      setShowPasswordModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordErrors({})
    }, 1000)
  }

  const handleSettingChange = (section, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }))
  }

  const handleSaveSettings = () => {
    if (settings) {
      dataService.saveSettings(settings)
      addToast('Settings saved successfully!', 'success')
    }
  }

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false)
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setPasswordErrors({})
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="p-8">
        <div className="alert alert-error">
          <span>Failed to load settings. Please try again.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>
          
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={settings.profile.avatar}
              alt={settings.profile.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{settings.profile.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{settings.profile.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{settings.profile.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={settings.profile.name}
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={settings.profile.email}
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Member Since
              </label>
              <input
                type="text"
                value={settings.profile.joinDate}
                className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                readOnly
              />
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="btn btn-outline btn-primary w-full"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Application Settings</h2>
          
          <div className="space-y-6">
            {/* Theme Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="radio radio-primary"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    </div>
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Light Mode</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Always use light theme</p>
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="radio radio-primary"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    </div>
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Dark Mode</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Always use dark theme</p>
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="radio"
                    name="theme"
                    value="auto"
                    checked={theme === 'auto'}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="radio radio-primary"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-white to-gray-800 border-2 border-gray-300 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Auto (System)</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Follow system preference {systemTheme && `(${systemTheme} mode)`}
                      </p>
                    </div>
                  </div>
                </label>
              </div>
              
              {/* Theme Preview */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current theme:</p>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${effectiveTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} border border-gray-300 transition-colors`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize transition-colors">
                    {effectiveTheme} mode
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Theme changes are applied instantly across the entire application
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notifications</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications for new applications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.preferences.notifications}
                    onChange={(e) => handleSettingChange('preferences', 'notifications', e.target.checked)}
                    className="toggle toggle-primary"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-700 dark:text-gray-300">Email Updates</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get email notifications for important updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.preferences.emailUpdates}
                    onChange={(e) => handleSettingChange('preferences', 'emailUpdates', e.target.checked)}
                    className="toggle toggle-primary"
                  />
                </label>
              </div>
            </div>

            {/* Additional Settings */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Zone
                  </label>
                  <select 
                    value={settings.preferences.timezone}
                    onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                    className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+1 (Central European Time)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select 
                    value={settings.preferences.language}
                    onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                    className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={handleSaveSettings}
              className="btn btn-primary"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Change Password
            </h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password *
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`input input-bordered w-full ${passwordErrors.currentPassword ? 'input-error' : ''}`}
                  placeholder="Enter current password"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-error text-sm mt-1">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`input input-bordered w-full ${passwordErrors.newPassword ? 'input-error' : ''}`}
                  placeholder="Enter new password"
                />
                {passwordErrors.newPassword && (
                  <p className="text-error text-sm mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`input input-bordered w-full ${passwordErrors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm new password"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-error text-sm mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage
