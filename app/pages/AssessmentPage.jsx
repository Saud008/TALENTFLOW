import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAssessmentsStore } from '../stores/assessmentsStore'
import AssessmentBuilder from '../components/AssessmentBuilder'
import AssessmentPreview from '../components/AssessmentPreview'
import LoadingSpinner from '../components/LoadingSpinner'

// #assessment page component
const AssessmentPage = () => {
  const { jobId } = useParams()
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  
  const { setPreviewMode } = useAssessmentsStore()
  const queryClient = useQueryClient()

  const { data: assessment, isLoading } = useQuery({
    queryKey: ['assessment', jobId],
    queryFn: async () => {
      const response = await fetch(`/assessments/${jobId}`)
      return response.json()
    },
    enabled: !!jobId
  })

  const saveAssessmentMutation = useMutation({
    mutationFn: async (assessmentData) => {
      const response = await fetch(`/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData)
      })
      
      if (!response.ok) throw new Error('Failed to save assessment')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment', jobId] })
    }
  })

  const submitResponseMutation = useMutation({
    mutationFn: async (responseData) => {
      const response = await fetch(`/assessments/${jobId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(responseData)
      })
      
      if (!response.ok) throw new Error('Failed to submit assessment')
      return response.json()
    },
    onSuccess: () => {
      alert('Assessment submitted successfully!')
    }
  })

  const handleSaveAssessment = (assessmentData) => {
    saveAssessmentMutation.mutate(assessmentData)
  }

  const handlePreviewAssessment = (assessmentData) => {
    setPreviewMode(true)
    setIsPreviewMode(true)
  }

  const handleSubmitResponse = (responses) => {
    submitResponseMutation.mutate({
      candidateId: 1, // In a real app, this would come from auth context
      responses
    })
  }

  const handleBackToBuilder = () => {
    setIsPreviewMode(false)
    setPreviewMode(false)
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading assessment..." />
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* #header */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link to={`/jobs/${jobId}`} className="btn btn-ghost">
            ← Back to Job
          </Link>
          <h1 className="text-xl font-bold ml-4">
            {assessment ? 'Edit Assessment' : 'Create Assessment'}
          </h1>
        </div>
        <div className="flex-none">
          {isPreviewMode ? (
            <button
              onClick={handleBackToBuilder}
              className="btn btn-outline"
            >
              Back to Builder
            </button>
          ) : (
            <button
              onClick={() => handlePreviewAssessment(assessment)}
              className="btn btn-primary"
              disabled={!assessment}
            >
              Preview
            </button>
          )}
        </div>
      </div>

      <div className="container mx-auto p-6">
        {isPreviewMode ? (
          <AssessmentPreview
            assessment={assessment}
            onSubmit={handleSubmitResponse}
          />
        ) : (
          <AssessmentBuilder
            assessment={assessment}
            onSave={handleSaveAssessment}
            onPreview={handlePreviewAssessment}
          />
        )}
      </div>
    </div>
  )
}

export default AssessmentPage
