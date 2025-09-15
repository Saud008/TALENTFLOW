import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useJobsStore } from '../stores/jobsStore'
import { JOB_STATUSES } from '../utils/constants'
import JobCard from '../components/JobCard'
import JobForm from '../components/JobForm'
import LoadingSpinner from '../components/LoadingSpinner'

// #jobs page component
const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  
  const { filters, setFilters } = useJobsStore()
  const queryClient = useQueryClient()

  // #update filters from URL params
  React.useEffect(() => {
    const urlFilters = {
      search: searchParams.get('search') || '',
      status: searchParams.get('status') || '',
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: parseInt(searchParams.get('pageSize') || '20')
    }
    setFilters(urlFilters)
  }, [searchParams, setFilters])

  // #fetch jobs
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      const response = await fetch(`/jobs?${params}`)
      return response.json()
    }
  })

  // #mutations
  const createJobMutation = useMutation({
    mutationFn: async (jobData) => {
      const response = await fetch('/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      })
      
      if (!response.ok) throw new Error('Failed to create job')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      setShowCreateForm(false)
    }
  })

  const updateJobMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await fetch(`/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) throw new Error('Failed to update job')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      setEditingJob(null)
    }
  })

  const archiveJobMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: JOB_STATUSES.ARCHIVED })
      })
      
      if (!response.ok) throw new Error('Failed to archive job')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    }
  })

  const unarchiveJobMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: JOB_STATUSES.ACTIVE })
      })
      
      if (!response.ok) throw new Error('Failed to unarchive job')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    }
  })

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setFilters(updatedFilters)
    
    // #update URL params
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params)
  }

  const handleCreateJob = (jobData) => {
    createJobMutation.mutate(jobData)
  }

  const handleUpdateJob = (jobData) => {
    updateJobMutation.mutate({ id: editingJob.id, updates: jobData })
  }

  const handleArchiveJob = (id) => {
    if (window.confirm('Are you sure you want to archive this job?')) {
      archiveJobMutation.mutate(id)
    }
  }

  const handleUnarchiveJob = (id) => {
    unarchiveJobMutation.mutate(id)
  }

  const handleEditJob = (job) => {
    setEditingJob(job)
  }

  const jobs = jobsData?.data || []
  const pagination = jobsData?.pagination

  return (
    <div className="min-h-screen bg-base-200">
      {/* #header */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link to="/admin" className="btn btn-ghost">
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold ml-4">Jobs Management</h1>
        </div>
        <div className="flex-none">
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            Create Job
          </button>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* #filters */}
        <div className="card bg-base-100 shadow-sm mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Search</span>
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="input input-bordered"
                  placeholder="Search jobs..."
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange({ status: e.target.value })}
                  className="select select-bordered"
                >
                  <option value="">All Statuses</option>
                  {Object.values(JOB_STATUSES).map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Page Size</span>
                </label>
                <select
                  value={filters.pageSize}
                  onChange={(e) => handleFilterChange({ pageSize: parseInt(e.target.value) })}
                  className="select select-bordered"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* #jobs grid */}
        {isLoading ? (
          <LoadingSpinner text="Loading jobs..." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onArchive={handleArchiveJob}
                  onUnarchive={handleUnarchiveJob}
                />
              ))}
            </div>

            {/* #pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <div className="btn-group">
                  <button
                    onClick={() => handleFilterChange({ page: pagination.page - 1 })}
                    disabled={pagination.page <= 1}
                    className="btn btn-sm"
                  >
                    «
                  </button>
                  <button className="btn btn-sm btn-active">
                    Page {pagination.page} of {pagination.totalPages}
                  </button>
                  <button
                    onClick={() => handleFilterChange({ page: pagination.page + 1 })}
                    disabled={pagination.page >= pagination.totalPages}
                    className="btn btn-sm"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* #create/edit job modal */}
        {(showCreateForm || editingJob) && (
          <div className="modal modal-open">
            <JobForm
              job={editingJob}
              onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
              onCancel={() => {
                setShowCreateForm(false)
                setEditingJob(null)
              }}
              isLoading={createJobMutation.isPending || updateJobMutation.isPending}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default JobsPage
