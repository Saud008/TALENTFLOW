import { useState, useEffect } from 'react'
import { useToast } from '../contexts/ToastContext'
import { dataService } from '../services/dataService'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiArchive, 
  HiEye,
  HiEyeOff,
  HiDotsVertical,
  HiFolder,
  HiCalendar,
  HiUsers
} from 'react-icons/hi'

// Sortable Job Card Component
const SortableJobCard = ({ job, onEdit, onDelete, onArchive, onUnarchive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getStatusBadge = (status) => {
    return status === 'Active' 
      ? 'badge badge-success' 
      : 'badge badge-neutral'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 mb-3 transition-all ${
        isDragging ? 'shadow-lg border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900' : 'hover:shadow-md'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 flex-shrink-0"
            title="Drag to reorder jobs"
            style={{ touchAction: 'none' }}
          >
            <HiDotsVertical className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                {job.title}
              </h3>
              <span className={`${getStatusBadge(job.status)} text-xs sm:text-sm`}>
                {job.status}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <HiFolder className="w-4 h-4" />
                <span>{job.department}</span>
              </span>
              <span className="flex items-center space-x-1">
                <HiCalendar className="w-4 h-4" />
                <span>{job.createdDate}</span>
              </span>
              <span className="flex items-center space-x-1">
                <HiUsers className="w-4 h-4" />
                <span>{job.applications || 0} applications</span>
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Archive/Unarchive */}
          {job.status === 'Active' ? (
            <button
              onClick={() => onArchive(job.id)}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900 rounded"
              title="Archive Job"
            >
              <HiArchive className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          ) : (
            <button
              onClick={() => onUnarchive(job.id)}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded"
              title="Unarchive Job"
            >
              <HiEye className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Edit */}
          <button
            onClick={() => onEdit(job)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
            title="Edit Job"
          >
            <HiPencil className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(job.id)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded"
            title="Delete Job"
          >
            <HiTrash className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

const JobsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    status: 'Active',
    description: '',
    requirements: '',
    location: '',
    salary: ''
  })
  const [errors, setErrors] = useState({})
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('active')
  const [isReordering, setIsReordering] = useState(false)
  const [activeId, setActiveId] = useState(null)
  
  const { addToast } = useToast()

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = () => {
    const jobsData = dataService.getJobs()
    // Add some mock data for applications count
    const jobsWithApplications = jobsData.map(job => ({
      ...job,
      applications: Math.floor(Math.random() * 50) + 1
    }))
    setJobs(jobsWithApplications)
    setLoading(false)
  }

  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Operations', 'Finance']
  const statuses = ['Active', 'Archived']

  // Filter jobs based on active tab
  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'active') return job.status === 'Active'
    if (activeTab === 'archived') return job.status === 'Archived'
    return true
  })

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

    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      if (editingJob) {
        // Update existing job with optimistic update
        const originalJobs = [...jobs]
        const updatedJobs = jobs.map(job => 
          job.id === editingJob.id ? { ...job, ...formData } : job
        )
        setJobs(updatedJobs)
        
        try {
          const updatedJob = dataService.updateJob(editingJob.id, formData)
          if (!updatedJob) throw new Error('Update failed')
          addToast('Job updated successfully!', 'success')
        } catch (error) {
          // Rollback on failure
          setJobs(originalJobs)
          addToast('Failed to update job', 'error')
          return
        }
      } else {
        // Add new job
        const newJob = dataService.addJob(formData)
        if (newJob) {
          loadJobs()
          addToast('Job added successfully!', 'success')
        } else {
          addToast('Failed to add job', 'error')
          return
        }
      }
      
      setShowAddModal(false)
      setEditingJob(null)
      setFormData({ title: '', department: '', status: 'Active', description: '', requirements: '', location: '', salary: '' })
      setErrors({})
    } catch (error) {
      addToast('An error occurred', 'error')
    }
  }

  const handleEdit = (job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      department: job.department,
      status: job.status,
      description: job.description || '',
      requirements: job.requirements || '',
      location: job.location || '',
      salary: job.salary || ''
    })
    setShowAddModal(true)
  }

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return

    try {
      // Optimistic update
      const originalJobs = [...jobs]
      const updatedJobs = jobs.filter(job => job.id !== jobId)
      setJobs(updatedJobs)

      try {
        const success = dataService.deleteJob(jobId)
        if (!success) throw new Error('Delete failed')
        addToast('Job deleted successfully!', 'success')
      } catch (error) {
        // Rollback on failure
        setJobs(originalJobs)
        addToast('Failed to delete job', 'error')
      }
    } catch (error) {
      addToast('An error occurred', 'error')
    }
  }

  const handleArchive = async (jobId) => {
    try {
      // Optimistic update
      const originalJobs = [...jobs]
      const updatedJobs = jobs.map(job => 
        job.id === jobId ? { ...job, status: 'Archived' } : job
      )
      setJobs(updatedJobs)

      try {
        const updatedJob = dataService.updateJob(jobId, { status: 'Archived' })
        if (!updatedJob) throw new Error('Archive failed')
        addToast('Job archived successfully!', 'success')
      } catch (error) {
        // Rollback on failure
        setJobs(originalJobs)
        addToast('Failed to archive job', 'error')
      }
    } catch (error) {
      addToast('An error occurred', 'error')
    }
  }

  const handleUnarchive = async (jobId) => {
    try {
      // Optimistic update
      const originalJobs = [...jobs]
      const updatedJobs = jobs.map(job => 
        job.id === jobId ? { ...job, status: 'Active' } : job
      )
      setJobs(updatedJobs)

      try {
        const updatedJob = dataService.updateJob(jobId, { status: 'Active' })
        if (!updatedJob) throw new Error('Unarchive failed')
        addToast('Job unarchived successfully!', 'success')
      } catch (error) {
        // Rollback on failure
        setJobs(originalJobs)
        addToast('Failed to unarchive job', 'error')
      }
    } catch (error) {
      addToast('An error occurred', 'error')
    }
  }


  const handleDragStart = (event) => {
    console.log('Drag started:', event.active.id)
    console.log('Available items:', filteredJobs.map(job => job.id))
    setActiveId(event.active.id)
    setIsReordering(true)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    console.log('Drag ended:', { active: active.id, over: over?.id })

    if (active.id !== over?.id && over) {
      try {
        setIsReordering(true)
        
        // Optimistic update
        const originalJobs = [...jobs]
        
        // Find the actual indices in the full jobs array
        const activeIndex = jobs.findIndex(job => job.id === active.id)
        const overIndex = jobs.findIndex(job => job.id === over.id)
        
        if (activeIndex === -1 || overIndex === -1) {
          console.error('Could not find job indices')
          return
        }
        
        const newJobs = arrayMove(jobs, activeIndex, overIndex)
        setJobs(newJobs)

        try {
          // Simulate API call for reordering with artificial latency
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Simulate 5% failure rate for reordering (reduced for better UX)
          if (Math.random() < 0.05) {
            throw new Error('Network error during reorder')
          }
          
          dataService.saveJobs(newJobs)
          addToast('Jobs reordered successfully!', 'success')
        } catch (error) {
          // Rollback on failure
          setJobs(originalJobs)
          addToast('Failed to reorder jobs. Changes have been reverted.', 'error')
        }
      } catch (error) {
        console.error('Error during drag:', error)
        addToast('An error occurred during reordering', 'error')
      } finally {
        setIsReordering(false)
        setActiveId(null)
      }
    } else {
      setIsReordering(false)
      setActiveId(null)
    }
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingJob(null)
    setFormData({ title: '', department: '', status: 'Active', description: '', requirements: '', location: '', salary: '' })
    setErrors({})
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
      <div className="flex justify-between items-center mb-8" data-aos="fade-down">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Jobs Board</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage job postings with drag-and-drop reordering</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary px-6 py-3 flex items-center space-x-2"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <HiPlus className="w-5 h-5" />
          <span>Add Job</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1" data-aos="fade-up" data-aos-delay="100">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'active'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Active Jobs ({jobs.filter(job => job.status === 'Active').length})
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'archived'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Archived Jobs ({jobs.filter(job => job.status === 'Archived').length})
        </button>
      </div>

      {/* Jobs Board */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6" data-aos="fade-up" data-aos-delay="200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {activeTab === 'active' ? 'Active Jobs' : 'Archived Jobs'}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
            <HiDotsVertical className="w-4 h-4" />
            <span>{isReordering ? 'Reordering...' : 'Drag the handle to reorder jobs'}</span>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiArchive className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No {activeTab} jobs
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {activeTab === 'active' 
                ? "You don't have any active job postings." 
                : "You don't have any archived jobs."
              }
            </p>
            {activeTab === 'active' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary"
              >
                Create Your First Job
              </button>
            )}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredJobs.map(job => job.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredJobs.map((job) => (
                <SortableJobCard
                  key={job.id}
                  job={job}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onArchive={handleArchive}
                  onUnarchive={handleUnarchive}
                />
              ))}
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-lg opacity-90">
                  <div className="flex items-center space-x-3">
                    <HiDotsVertical className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {filteredJobs.find(job => job.id === activeId)?.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Add/Edit Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-aos="fade" data-aos-duration="300">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" data-aos="zoom-in" data-aos-duration="400">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {editingJob ? 'Edit Job' : 'Add New Job'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`textarea textarea-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.description ? 'textarea-error' : ''}`}
                  placeholder="Describe the role and responsibilities..."
                />
                {errors.description && (
                  <p className="text-error text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  className="textarea textarea-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="List the required skills and qualifications..."
                />
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