import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import candidateDataService from '../services/candidateDataService'
import { HiUser, HiBell, HiLockClosed, HiCog, HiColorSwatch, HiSun, HiMoon, HiRefresh } from 'react-icons/hi'

const CandidateSettings = () => {
  const { theme, changeTheme, effectiveTheme, systemTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('account')

  const candidateSettings = candidateDataService.getCandidateSettings()
  const candidateProfile = candidateDataService.getCandidateProfile()
  
  const [settings, setSettings] = useState({
    ...candidateSettings,
    account: {
      email: candidateProfile.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorAuth: false,
      deleteAccount: false
    }
  })

  const sections = [
    { id: 'account', name: 'Account', icon: HiUser },
    { id: 'notifications', name: 'Notifications', icon: HiBell },
    { id: 'privacy', name: 'Privacy', icon: HiLockClosed },
    { id: 'preferences', name: 'Job Preferences', icon: HiCog },
    { id: 'theme', name: 'Appearance', icon: HiColorSwatch }
  ]

  const handleSettingChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    console.log('Settings saved:', settings)
    alert('Settings saved successfully!')
  }

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme)
  }

  return (
    <div className="responsive-padding">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="responsive-text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="responsive-text-sm text-gray-600 dark:text-gray-400">Manage your account settings and preferences.</p>
      </div>

      <div className="grid-cols-responsive-2 gap-6 sm:gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Account Settings */}
            {activeSection === 'account' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account Settings</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.account.email}
                    onChange={(e) => handleSettingChange('account', 'email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={settings.account.currentPassword}
                      onChange={(e) => handleSettingChange('account', 'currentPassword', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={settings.account.newPassword}
                      onChange={(e) => handleSettingChange('account', 'newPassword', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={settings.account.confirmPassword}
                      onChange={(e) => handleSettingChange('account', 'confirmPassword', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.account.twoFactorAuth}
                      onChange={(e) => handleSettingChange('account', 'twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {key === 'emailNotifications' && 'Receive notifications via email'}
                          {key === 'jobAlerts' && 'Get notified about new job matches'}
                          {key === 'applicationUpdates' && 'Updates on your job applications'}
                          {key === 'weeklyDigest' && 'Weekly summary of job market activity'}
                          {key === 'marketingEmails' && 'Promotional emails and updates'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy Settings</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Visibility
                  </label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="public">Public - Visible to everyone</option>
                    <option value="recruiters">Recruiters Only - Visible to recruiters</option>
                    <option value="private">Private - Not visible to others</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {Object.entries(settings.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {key === 'showContactInfo' && 'Show your contact information on your profile'}
                          {key === 'allowRecruiters' && 'Allow recruiters to contact you directly'}
                          {key === 'showSalaryHistory' && 'Include salary history in your profile'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange('privacy', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Job Preferences */}
            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Job Preferences</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Job Types
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.preferences.jobTypes.includes(type)}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...settings.preferences.jobTypes, type]
                              : settings.preferences.jobTypes.filter(t => t !== type)
                            handleSettingChange('preferences', 'jobTypes', newTypes)
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Salary Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Minimum</label>
                      <input
                        type="number"
                        value={settings.preferences.salaryRange.min}
                        onChange={(e) => handleSettingChange('preferences', 'salaryRange', {
                          ...settings.preferences.salaryRange,
                          min: parseInt(e.target.value)
                        })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Maximum</label>
                      <input
                        type="number"
                        value={settings.preferences.salaryRange.max}
                        onChange={(e) => handleSettingChange('preferences', 'salaryRange', {
                          ...settings.preferences.salaryRange,
                          max: parseInt(e.target.value)
                        })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={settings.preferences.experienceLevel}
                    onChange={(e) => handleSettingChange('preferences', 'experienceLevel', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior-level">Senior-level</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>
            )}

            {/* Theme Settings */}
            {activeSection === 'theme' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Theme Preference
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'light', label: 'Light Mode', icon: HiSun, description: 'Clean and bright interface' },
                      { value: 'dark', label: 'Dark Mode', icon: HiMoon, description: 'Easy on the eyes' },
                      { value: 'auto', label: 'Auto (System)', icon: HiRefresh, description: 'Follows your system preference' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <input
                          type="radio"
                          name="theme"
                          value={option.value}
                          checked={theme === option.value}
                          onChange={() => handleThemeChange(option.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-4 ${
                          theme === option.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {theme === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <option.icon className="w-5 h-5" />
                            <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                        </div>
                        {option.value === 'auto' && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Current: {systemTheme}
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Theme Preview</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Current theme: <span className="font-medium">{effectiveTheme}</span>
                    {theme === 'auto' && (
                      <span className="ml-2">(System: {systemTheme})</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateSettings
