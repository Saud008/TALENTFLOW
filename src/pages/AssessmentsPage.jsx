import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AssessmentsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    job: '',
    questionsCount: ''
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  // Sample assessments data
  const [assessments, setAssessments] = useState([
    {
      id: 1,
      title: 'Frontend Developer Assessment',
      job: 'Senior Frontend Developer',
      questionsCount: 15,
      createdDate: '2024-01-15',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Product Management Test',
      job: 'Product Manager',
      questionsCount: 20,
      createdDate: '2024-01-10',
      status: 'Active'
    },
    {
      id: 3,
      title: 'UX Design Challenge',
      job: 'UX Designer',
      questionsCount: 12,
      createdDate: '2024-01-05',
      status: 'Draft'
    },
    {
      id: 4,
      title: 'DevOps Technical Assessment',
      job: 'DevOps Engineer',
      questionsCount: 18,
      createdDate: '2024-01-20',
      status: 'Active'
    }
  ])

  const jobs = ['Senior Frontend Developer', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'Backend Developer', 'Data Scientist']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Assessment title is required'
    }
    
    if (!formData.job) {
      newErrors.job = 'Related job is required'
    }
    
    if (!formData.questionsCount || isNaN(formData.questionsCount) || formData.questionsCount < 1) {
      newErrors.questionsCount = 'Please enter a valid number of questions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const newAssessment = {
      id: Date.now(),
      ...formData,
      questionsCount: parseInt(formData.questionsCount),
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Draft'
    }
    
    setAssessments(prev => [...prev, newAssessment])
    setShowCreateModal(false)
    setFormData({ title: '', job: '', questionsCount: '' })
    setErrors({})
  }

  const handleCloseModal = () => {
    setShowCreateModal(false)
    setFormData({ title: '', job: '', questionsCount: '' })
    setErrors({})
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'badge badge-success'
      case 'Draft':
        return 'badge badge-warning'
      case 'Archived':
        return 'badge badge-neutral'
      default:
        return 'badge badge-neutral'
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assessments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create and manage assessment tests for candidates</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary px-6 py-3"
        >
          + Create Assessment
        </button>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="assessment-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => navigate(`/assessments/${assessment.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                {assessment.title}
              </h3>
              <span className={getStatusBadge(assessment.status)}>
                {assessment.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                <span className="truncate">{assessment.job}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{assessment.questionsCount} questions</span>
              </div>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Created {assessment.createdDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className="btn btn-sm btn-outline btn-primary flex-1 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white">
                Edit
              </button>
              <button className="btn btn-sm btn-outline btn-secondary flex-1 hover:bg-gray-600 hover:text-white dark:hover:bg-gray-600 dark:hover:text-white">
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Assessment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Create New Assessment
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assessment Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                  placeholder="Enter assessment title"
                />
                {errors.title && (
                  <p className="text-error text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Related Job *
                </label>
                <select
                  name="job"
                  value={formData.job}
                  onChange={handleInputChange}
                  className={`select select-bordered w-full ${errors.job ? 'select-error' : ''}`}
                >
                  <option value="">Select Job</option>
                  {jobs.map(job => (
                    <option key={job} value={job}>{job}</option>
                  ))}
                </select>
                {errors.job && (
                  <p className="text-error text-sm mt-1">{errors.job}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Questions *
                </label>
                <input
                  type="number"
                  name="questionsCount"
                  value={formData.questionsCount}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${errors.questionsCount ? 'input-error' : ''}`}
                  placeholder="Enter number of questions"
                  min="1"
                />
                {errors.questionsCount && (
                  <p className="text-error text-sm mt-1">{errors.questionsCount}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Create Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssessmentsPage
