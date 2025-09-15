import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { formatDate } from '../utils/helpers'
import { JOB_STATUSES } from '../utils/constants'
import LoadingSpinner from '../components/LoadingSpinner'

// #job detail page
const JobDetail = () => {
  const { jobId } = useParams()

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const response = await fetch(`/jobs/${jobId}`)
      if (!response.ok) throw new Error('Job not found')
      return response.json()
    },
    enabled: !!jobId
  })

  if (isLoading) {
    return <LoadingSpinner text="Loading job details..." />
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <Link to="/jobs" className="btn btn-primary">
            Back to Jobs
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case JOB_STATUSES.ACTIVE:
        return 'badge-success'
      case JOB_STATUSES.PAUSED:
        return 'badge-warning'
      case JOB_STATUSES.DRAFT:
        return 'badge-info'
      case JOB_STATUSES.ARCHIVED:
        return 'badge-neutral'
      default:
        return 'badge-neutral'
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* #header */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link to="/jobs" className="btn btn-ghost">
            ← Back to Jobs
          </Link>
          <h1 className="text-xl font-bold ml-4">Job Details</h1>
        </div>
        <div className="flex-none">
          <Link
            to={`/assessments/${jobId}`}
            className="btn btn-outline mr-2"
          >
            Manage Assessment
          </Link>
          <button className="btn btn-primary">
            Edit Job
          </button>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* #main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  <div className={`badge ${getStatusColor(job.status)} badge-lg`}>
                    {job.status}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-6 text-sm text-base-content/70">
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                  <span>📅 Posted {formatDate(job.createdAt)}</span>
                </div>

                <div className="prose max-w-none">
                  <h3>Job Description</h3>
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </div>
            </div>

            {/* #requirements */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="card-title">Requirements</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags?.map((tag, index) => (
                    <span key={index} className="badge badge-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* #sidebar */}
          <div className="space-y-6">
            {/* #job stats */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="card-title">Job Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Applications</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>In Review</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interviewed</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hired</span>
                    <span className="font-semibold">0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* #quick actions */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="card-title">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    to={`/candidates?jobId=${jobId}`}
                    className="btn btn-outline w-full"
                  >
                    View Candidates
                  </Link>
                  <Link
                    to={`/assessments/${jobId}`}
                    className="btn btn-outline w-full"
                  >
                    Manage Assessment
                  </Link>
                  <button className="btn btn-outline w-full">
                    Share Job
                  </button>
                </div>
              </div>
            </div>

            {/* #job details */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="card-title">Job Details</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">Status:</span> {job.status}
                  </div>
                  <div>
                    <span className="font-semibold">Created:</span> {formatDate(job.createdAt)}
                  </div>
                  <div>
                    <span className="font-semibold">Updated:</span> {formatDate(job.updatedAt)}
                  </div>
                  <div>
                    <span className="font-semibold">Slug:</span> {job.slug}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetail
