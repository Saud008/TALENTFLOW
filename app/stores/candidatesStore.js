import { create } from 'zustand'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// #candidates store
export const useCandidatesStore = create((set, get) => ({
  filters: {
    search: '',
    stage: '',
    page: 1,
    pageSize: 20
  },
  selectedCandidate: null,

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }))
  },

  setSelectedCandidate: (candidate) => {
    set({ selectedCandidate: candidate })
  }
}))

// #candidates query hooks
export const useCandidates = (filters) => {
  return useQuery({
    queryKey: ['candidates', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      
      const response = await fetch(`/candidates?${params}`)
      return response.json()
    }
  })
}

export const useUpdateCandidate = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const response = await fetch(`/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update candidate')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
    }
  })
}
