import { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'
import { dataService } from '../services/dataService'

const JobsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    status: 'Active'
  })
  const [errors, setErrors] = useState({})
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  
  const { addToast } = useToast()

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = () => {
    const jobsData = dataService.getJobs()
    setJobs(jobsData)
    setLoading(false)
  }

  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR']
  const statuses = ['Active', 'Archived']

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
      newErrors.title = 'Job title is required'
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (editingJob) {
      // Update existing job
      const updatedJob = dataService.updateJob(editingJob.id, formData)
      if (updatedJob) {
        loadJobs()
        addToast('Job updated successfully!', 'success')
      } else {
        addToast('Failed to update job', 'error')
      }
    } else {
      // Add new job
      const newJob = dataService.addJob(formData)
      if (newJob) {
        loadJobs()
        addToast('Job added successfully!', 'success')
      } else {
        addToast('Failed to add job', 'error')
      }
    }
    
    setShowAddModal(false)
    setEditingJob(null)
    setFormData({ title: '', department: '', status: 'Active' })
    setErrors({})
  }

  const handleEdit = (job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      department: job.department,
      status: job.status
    })
    setShowAddModal(true)
  }

  const handleDelete = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      const success = dataService.deleteJob(jobId)
      if (success) {
        loadJobs()
        addToast('Job deleted successfully!', 'success')
      } else {
        addToast('Failed to delete job', 'error')
      }
    }
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingJob(null)
    setFormData({ title: '', department: '', status: 'Active' })
    setErrors({})
  }

  const getStatusBadge = (status) => {
    return status === 'Active' 
      ? 'badge badge-success' 
      : 'badge badge-neutral'
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Jobs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage job postings and listings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary px-6 py-3"
        >
          + Add Job
        </button>
      </div>

      {/* Jobs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200 dark:bg-gray-700">
              <tr>
                <th className="text-left font-semibold text-gray-700 dark:text-gray-300">Title</th>
                <th className="text-left font-semibold text-gray-700 dark:text-gray-300">Department</th>
                <th className="text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left font-semibold text-gray-700 dark:text-gray-300">Created Date</th>
                <th className="text-left font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-base-50 dark:hover:bg-gray-700">
                  <td className="font-medium text-gray-900 dark:text-white">{job.title}</td>
                  <td className="text-gray-600 dark:text-gray-400">{job.department}</td>
                  <td>
                    <span className={getStatusBadge(job.status)}>
                      {job.status}
                    </span>
                  </td>
                  <td className="text-gray-600 dark:text-gray-400">{job.createdDate}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(job)}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {editingJob ? 'Edit Job' : 'Add New Job'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.title ? 'input-error' : ''}`}
                  placeholder="Enter job title"
                />
                {errors.title && (
                  <p className="text-error text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.department ? 'select-error' : ''}`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-error text-sm mt-1">{errors.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
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
                  {editingJob ? 'Update Job' : 'Add Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobsPage
