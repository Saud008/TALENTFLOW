import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/helpers'
import { JOB_STATUSES } from '../utils/constants'

// #job card component
const JobCard = ({ job, onArchive, onUnarchive }) => {
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
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="card-title text-lg">
            <Link 
              to={`/jobs/${job.id}`}
              className="link link-hover"
            >
              {job.title}
            </Link>
          </h3>
          <div className={`badge ${getStatusColor(job.status)}`}>
            {job.status}
          </div>
        </div>
        
        <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {job.tags?.slice(0, 3).map((tag, index) => (
            <span key={index} className="badge badge-outline badge-sm">
              {tag}
            </span>
          ))}
          {job.tags?.length > 3 && (
            <span className="badge badge-outline badge-sm">
              +{job.tags.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center text-sm text-base-content/60">
          <span>{job.location}</span>
          <span>{job.salary}</span>
        </div>
        
        <div className="card-actions justify-end mt-3">
          {job.status === JOB_STATUSES.ARCHIVED ? (
            <button 
              className="btn btn-sm btn-outline"
              onClick={() => onUnarchive(job.id)}
            >
              Unarchive
            </button>
          ) : (
            <button 
              className="btn btn-sm btn-outline btn-error"
              onClick={() => onArchive(job.id)}
            >
              Archive
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobCard
