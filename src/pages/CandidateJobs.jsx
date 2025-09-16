import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import candidateDataService from '../services/candidateDataService'

const CandidateJobs = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [selectedExperience, setSelectedExperience] = useState('All')
  const [notification, setNotification] = useState(null)
  const [savedJobs, setSavedJobs] = useState(() => {
    const saved = localStorage.getItem('savedJobs')
    return saved ? JSON.parse(saved) : []
  })

  const categories = ['All', 'Frontend', 'Backend', 'Full Stack', 'DevOps', 'Data Science']
  const locations = ['All', 'Remote', 'New York', 'San Francisco', 'London', 'Berlin']
  const experienceLevels = ['All', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead/Principal']

  const jobs = candidateDataService.getAvailableJobs()

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory
    const matchesLocation = selectedLocation === 'All' || 
                           (selectedLocation === 'Remote' && job.remote) ||
                           job.location.includes(selectedLocation)
    const matchesExperience = selectedExperience === 'All' || 
                             job.title.toLowerCase().includes(selectedExperience.toLowerCase().replace(' level', ''))
    
    return matchesSearch && matchesCategory && matchesLocation && matchesExperience
  })

  const handleApply = (job) => {
    navigate(`/candidate/jobs/${job.id}`)
  }

  const handleSave = async (job) => {
    const isJobSaved = savedJobs.some(savedJob => savedJob.id === job.id)
    
    if (isJobSaved) {
      // Unsave the job
      const updatedSavedJobs = savedJobs.filter(savedJob => savedJob.id !== job.id)
      setSavedJobs(updatedSavedJobs)
      localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs))
      showNotification(`"${job.title}" removed from saved jobs!`, 'info')
    } else {
      try {
        // Save the job with artificial latency and error injection
        await candidateDataService.saveJob(job.id)
        const updatedSavedJobs = [...savedJobs, job]
        setSavedJobs(updatedSavedJobs)
        localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs))
        showNotification(`"${job.title}" saved successfully!`, 'success')
      } catch (error) {
        showNotification(error.message, 'error')
      }
    }
  }

  const isJobSaved = (jobId) => {
    return savedJobs.some(savedJob => savedJob.id === jobId)
  }

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <div className="responsive-padding">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="responsive-text-3xl font-bold text-gray-900 dark:text-white mb-2">Find Your Next Job</h1>
        <p className="responsive-text-sm text-gray-600 dark:text-gray-400">Discover opportunities that match your skills and interests.</p>
      </div>

      {/* Search and Filters */}
      <div className="card-responsive mb-6 sm:mb-8">
        <div className="grid-cols-responsive-4 gap-4">
          {/* Search */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Jobs
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Job title, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Experience
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Job Listings */}
      <div className="space-y-4 sm:space-y-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 ${job.featured ? 'ring-2 ring-blue-500' : ''}`}>
            {job.featured && (
              <div className="flex items-center mb-4">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ Featured
                </span>
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                  {job.remote && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium self-start">
                      Remote
                    </span>
                  )}
                </div>
                
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">{job.company}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {job.salary}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.posted}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">{job.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req, index) => (
                    <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-row lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 lg:ml-6">
                <button
                  onClick={() => handleApply(job)}
                  className="flex-1 lg:flex-none px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-medium text-sm sm:text-base"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => handleSave(job)}
                  className={`flex-1 lg:flex-none px-4 py-2 sm:px-6 sm:py-2 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-medium text-sm sm:text-base ${
                    isJobSaved(job.id)
                      ? 'bg-green-100 border border-green-300 text-green-700 dark:bg-green-900 dark:border-green-600 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                      : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {isJobSaved(job.id) ? (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Saved</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span>Save Job</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria or filters.</p>
        </div>
      )}


      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : notification.type === 'info'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-500 text-white'
          } transition-all duration-300`}>
            <div className="flex items-center space-x-2">
              {notification.type === 'success' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {notification.type === 'info' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateJobs
