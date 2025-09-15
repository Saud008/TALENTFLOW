import React, { useState, useEffect } from 'react'
import { generateSlug } from '../utils/helpers'
import { JOB_STATUSES } from '../utils/constants'

// #job form component
const JobForm = ({ job, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: JOB_STATUSES.DRAFT,
    location: '',
    salary: '',
    tags: []
  })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        status: job.status || JOB_STATUSES.DRAFT,
        location: job.location || '',
        salary: job.salary || '',
        tags: job.tags || []
      })
    }
  }, [job])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // #clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const jobData = {
      ...formData,
      slug: generateSlug(formData.title)
    }
    
    onSubmit(jobData)
  }

  return (
    <div className="modal-box max-w-2xl">
      <h3 className="font-bold text-lg mb-4">
        {job ? 'Edit Job' : 'Create New Job'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title *</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
            placeholder="Enter job title"
          />
          {errors.title && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.title}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description *</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`textarea textarea-bordered ${errors.description ? 'textarea-error' : ''}`}
            placeholder="Enter job description"
            rows={4}
          />
          {errors.description && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.description}</span>
            </label>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select select-bordered"
            >
              {Object.values(JOB_STATUSES).map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input input-bordered"
              placeholder="e.g., Remote, New York"
            />
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Salary Range</span>
          </label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="input input-bordered"
            placeholder="e.g., 80k - 120k"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Tags</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="input input-bordered flex-1"
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn btn-outline"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span key={index} className="badge badge-primary gap-2">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="btn btn-ghost btn-xs"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="modal-action">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              job ? 'Update Job' : 'Create Job'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default JobForm
