import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import CandidateProfile from '../components/CandidateProfile'
import LoadingSpinner from '../components/LoadingSpinner'

// #candidate detail page
const CandidateDetail = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data: candidate, isLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: async () => {
      const response = await fetch(`/candidates/${id}`)
      if (!response.ok) throw new Error('Candidate not found')
      return response.json()
    },
    enabled: !!id
  })

  const updateCandidateMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await fetch(`/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) throw new Error('Failed to update candidate')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', id] })
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
    }
  })

  const handleUpdate = (candidateId, updates) => {
    updateCandidateMutation.mutate({ id: candidateId, updates })
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading candidate details..." />
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Candidate Not Found</h1>
          <Link to="/candidates" className="btn btn-primary">
            Back to Candidates
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* #header */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link to="/candidates" className="btn btn-ghost">
            ← Back to Candidates
          </Link>
          <h1 className="text-xl font-bold ml-4">Candidate Profile</h1>
        </div>
        <div className="flex-none">
          <button className="btn btn-outline mr-2">
            Download Resume
          </button>
          <button className="btn btn-primary">
            Schedule Interview
          </button>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <CandidateProfile
          candidate={candidate}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  )
}

export default CandidateDetail
