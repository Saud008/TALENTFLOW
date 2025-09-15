import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatDateTime } from '../utils/helpers'
import { CANDIDATE_STAGES } from '../utils/constants'

// #candidate profile component
const CandidateProfile = ({ candidate, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [notes, setNotes] = useState(candidate.notes || '')

  // #fetch candidate timeline
  const { data: timeline, isLoading: timelineLoading } = useQuery({
    queryKey: ['candidateTimeline', candidate.id],
    queryFn: async () => {
      const response = await fetch(`/candidates/${candidate.id}/timeline`)
      return response.json()
    }
  })

  const handleSaveNotes = () => {
    onUpdate(candidate.id, { notes })
    setIsEditing(false)
  }

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
    <div className="space-y-6">
      {/* #candidate header */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{candidate.name}</h1>
              <p className="text-base-content/70">{candidate.email}</p>
              <p className="text-sm text-base-content/60">{candidate.phone}</p>
            </div>
            <div className={`badge ${getStageColor(candidate.stage)} badge-lg`}>
              {candidate.stage}
            </div>
          </div>
        </div>
      </div>

      {/* #candidate details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Details</h2>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Experience:</span> {candidate.experience} years
              </div>
              <div>
                <span className="font-semibold">Resume:</span> 
                <a href="#" className="link link-primary ml-2">
                  {candidate.resume}
                </a>
              </div>
              <div>
                <span className="font-semibold">Applied:</span> {formatDateTime(candidate.createdAt)}
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.map((skill, index) => (
                <span key={index} className="badge badge-primary">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* #notes section */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Notes</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-sm btn-outline"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setNotes(candidate.notes || '')
                    setIsEditing(false)
                  }}
                  className="btn btn-sm btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="btn btn-sm btn-primary"
                >
                  Save
                </button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="textarea textarea-bordered w-full"
              rows={4}
              placeholder="Add notes about this candidate..."
            />
          ) : (
            <p className="text-base-content/80">
              {candidate.notes || 'No notes added yet.'}
            </p>
          )}
        </div>
      </div>

      {/* #timeline section */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Timeline</h2>
          {timelineLoading ? (
            <div className="flex justify-center py-4">
              <span className="loading loading-spinner"></span>
            </div>
          ) : (
            <div className="space-y-4">
              {timeline?.map((entry, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className={`badge ${getStageColor(entry.stage)}`}>
                        {entry.stage}
                      </span>
                      <span className="text-sm text-base-content/60">
                        {formatDateTime(entry.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-base-content/80 mt-1">
                      {entry.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CandidateProfile
