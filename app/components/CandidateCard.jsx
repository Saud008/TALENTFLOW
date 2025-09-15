import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/helpers'
import { CANDIDATE_STAGES } from '../utils/constants'

// #candidate card component
const CandidateCard = ({ candidate, onStageChange }) => {
  const getStageColor = (stage) => {
    switch (stage) {
      case CANDIDATE_STAGES.APPLIED:
        return 'badge-info'
      case CANDIDATE_STAGES.SCREENING:
        return 'badge-warning'
      case CANDIDATE_STAGES.INTERVIEW:
        return 'badge-primary'
      case CANDIDATE_STAGES.ASSESSMENT:
        return 'badge-secondary'
      case CANDIDATE_STAGES.OFFER:
        return 'badge-success'
      case CANDIDATE_STAGES.HIRED:
        return 'badge-success'
      case CANDIDATE_STAGES.REJECTED:
        return 'badge-error'
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
              to={`/candidates/${candidate.id}`}
              className="link link-hover"
            >
              {candidate.name}
            </Link>
          </h3>
          <div className={`badge ${getStageColor(candidate.stage)}`}>
            {candidate.stage}
          </div>
        </div>
        
        <p className="text-sm text-base-content/70 mb-2">
          {candidate.email}
        </p>
        
        <p className="text-sm text-base-content/60 mb-3">
          {candidate.experience} years experience
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {candidate.skills?.slice(0, 3).map((skill, index) => (
            <span key={index} className="badge badge-outline badge-xs">
              {skill}
            </span>
          ))}
          {candidate.skills?.length > 3 && (
            <span className="badge badge-outline badge-xs">
              +{candidate.skills.length - 3}
            </span>
          )}
        </div>
        
        {candidate.notes && (
          <div className="alert alert-info py-2">
            <span className="text-xs">{candidate.notes}</span>
          </div>
        )}
        
        <div className="card-actions justify-between items-center mt-3">
          <span className="text-xs text-base-content/60">
            Applied {formatDate(candidate.createdAt)}
          </span>
          <select
            value={candidate.stage}
            onChange={(e) => onStageChange(candidate.id, e.target.value)}
            className="select select-bordered select-sm"
          >
            {Object.values(CANDIDATE_STAGES).map(stage => (
              <option key={stage} value={stage}>
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default CandidateCard
