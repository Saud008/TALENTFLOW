import { create } from 'zustand'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// #jobs store for state management
export const useJobsStore = create((set, get) => ({
  filters: {
    search: '',
    status: '',
    page: 1,
    pageSize: 20
  },
  selectedJob: null,

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }))
  },

  setSelectedJob: (job) => {
    set({ selectedJob: job })
  }
}))

// #jobs query hooks
export const useJobs = (filters) => {
  return useQuery({
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
}

export const useCreateJob = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (jobData) => {
      const response = await fetch('/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to create job')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    }
  })
}

export const useUpdateJob = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await fetch(`/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update job')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    }
  })
}

export const useReorderJobs = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, jobIds }) => {
      const response = await fetch(`/jobs/${id}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobIds })
      })
      
      if (!response.ok) {
        throw new Error('Failed to reorder jobs')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    }
  })
}
