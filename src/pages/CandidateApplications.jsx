import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import candidateDataService from '../services/candidateDataService'
import { HiEye, HiChat, HiX, HiCheck, HiClipboardList, HiExternalLink, HiTrash } from 'react-icons/hi'

const CandidateApplications = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const navigate = useNavigate()

  const filters = ['All', 'Pending', 'Under Review', 'Interview', 'Rejected', 'Accepted']

  const applications = candidateDataService.getCandidateApplications()

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Under Review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'Interview': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'Accepted': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return HiClipboardList
      case 'Under Review': return HiEye
      case 'Interview': return HiChat
      case 'Rejected': return HiX
      case 'Accepted': return HiCheck
      default: return HiClipboardList
    }
  }

  const filteredApplications = activeFilter === 'All' 
    ? applications 
    : applications.filter(app => app.status === activeFilter)

  const statusCounts = {
    All: applications.length,
    Pending: applications.filter(app => app.status === 'Pending').length,
    'Under Review': applications.filter(app => app.status === 'Under Review').length,
    Interview: applications.filter(app => app.status === 'Interview').length,
    Rejected: applications.filter(app => app.status === 'Rejected').length,
    Accepted: applications.filter(app => app.status === 'Accepted').length
  }

  const handleViewDetails = (application) => {
    setSelectedApplication(application)
    setShowDetailsModal(true)
  }

  const handleWithdraw = (application) => {
    setSelectedApplication(application)
    setShowWithdrawModal(true)
  }

  const confirmWithdraw = async () => {
    try {
      // In a real app, this would make an API call
      console.log('Withdrawing application:', selectedApplication.id)
      
      // Simulate API call with artificial latency
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Close modal and show success message
      setShowWithdrawModal(false)
      setSelectedApplication(null)
      
      // You could add a toast notification here
      alert('Application withdrawn successfully!')
      
    } catch (error) {
      console.error('Error withdrawing application:', error)
      alert('Failed to withdraw application. Please try again.')
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8" data-aos="fade-down">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Applications</h1>
        <p className="text-gray-600 dark:text-gray-400">Track the status of your job applications.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {filters.map((filter) => (
          <div
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              activeFilter === filter
                ? 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                activeFilter === filter
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {statusCounts[filter]}
              </div>
              <div className={`text-sm font-medium ${
                activeFilter === filter
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {filter}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Applications List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700" data-aos="fade-up" data-aos-delay="200">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {activeFilter === 'All' ? 'All Applications' : `${activeFilter} Applications`}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredApplications.map((application) => (
            <div key={application.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {application.jobTitle}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(application.status)}`}>
                      {(() => {
                        const IconComponent = getStatusIcon(application.status)
                        return <IconComponent className="w-4 h-4" />
                      })()}
                      <span>{application.status}</span>
                    </span>
                  </div>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">{application.company}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {application.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {application.salary}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Applied: {application.appliedDate}
                    </div>
                  </div>
                  
                  {application.notes && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{application.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Last updated: {application.lastUpdate}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-6">
                  <button 
                    onClick={() => handleViewDetails(application)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <HiExternalLink className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <button 
                    onClick={() => handleWithdraw(application)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <HiTrash className="w-4 h-4" />
                    <span>Withdraw</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Applications */}
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No {activeFilter.toLowerCase()} applications
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {activeFilter === 'All' 
                ? "You haven't applied to any jobs yet." 
                : `You don't have any ${activeFilter.toLowerCase()} applications.`
              }
            </p>
            {activeFilter === 'All' && (
              <button 
                onClick={() => navigate('/candidate/jobs')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Jobs
              </button>
            )}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-aos="fade" data-aos-duration="300">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" data-aos="zoom-in" data-aos-duration="400">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Application Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Job Title and Status */}
                <div className="flex items-center justify-between">
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedApplication.jobTitle}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(selectedApplication.status)}`}>
                    {(() => {
                      const IconComponent = getStatusIcon(selectedApplication.status)
                      return <IconComponent className="w-4 h-4" />
                    })()}
                    <span>{selectedApplication.status}</span>
                  </span>
                </div>

                {/* Company */}
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Company</h5>
                  <p className="text-gray-600 dark:text-gray-400">{selectedApplication.company}</p>
                </div>

                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium text-gray-900 dark:text-white mb-1">Location</h6>
                    <p className="text-gray-600 dark:text-gray-400">{selectedApplication.location}</p>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900 dark:text-white mb-1">Salary Range</h6>
                    <p className="text-gray-600 dark:text-gray-400">{selectedApplication.salary}</p>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900 dark:text-white mb-1">Applied Date</h6>
                    <p className="text-gray-600 dark:text-gray-400">{selectedApplication.appliedDate}</p>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900 dark:text-white mb-1">Last Updated</h6>
                    <p className="text-gray-600 dark:text-gray-400">{selectedApplication.lastUpdate}</p>
                  </div>
                </div>

                {/* Notes */}
                {selectedApplication.notes && (
                  <div>
                    <h6 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h6>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-600 dark:text-gray-400">{selectedApplication.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => navigate('/candidate/jobs')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <HiExternalLink className="w-4 h-4" />
                    <span>View Job Posting</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false)
                      handleWithdraw(selectedApplication)
                    }}
                    className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors flex items-center space-x-2"
                  >
                    <HiTrash className="w-4 h-4" />
                    <span>Withdraw Application</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Confirmation Modal */}
      {showWithdrawModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-aos="fade" data-aos-duration="300">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4" data-aos="zoom-in" data-aos-duration="400">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-4">
                  <HiTrash className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Withdraw Application</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Are you sure you want to withdraw your application for:
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedApplication.jobTitle}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedApplication.company}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmWithdraw}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <HiTrash className="w-4 h-4" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateApplications
