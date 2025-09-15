import { create } from 'zustand'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// #assessments store
export const useAssessmentsStore = create((set, get) => ({
  currentAssessment: null,
  isPreviewMode: false,

  setCurrentAssessment: (assessment) => {
    set({ currentAssessment: assessment })
  },

  setPreviewMode: (isPreview) => {
    set({ isPreviewMode: isPreview })
  }
}))

// #assessments query hooks
export const useAssessment = (jobId) => {
  return useQuery({
    queryKey: ['assessment', jobId],
    queryFn: async () => {
      const response = await fetch(`/assessments/${jobId}`)
      return response.json()
    },
    enabled: !!jobId
  })
}

export const useSaveAssessment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ jobId, assessmentData }) => {
      const response = await fetch(`/assessments/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save assessment')
      }
      
      return response.json()
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assessment', variables.jobId] })
    }
  })
}
