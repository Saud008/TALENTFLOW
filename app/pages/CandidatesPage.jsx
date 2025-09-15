import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCandidatesStore } from '../stores/candidatesStore'
import { CANDIDATE_STAGES } from '../utils/constants'
import VirtualizedList from '../components/VirtualizedList'
import KanbanBoard from '../components/KanbanBoard'
import LoadingSpinner from '../components/LoadingSpinner'

// #candidates page component
const CandidatesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('list') // 'list' or 'kanban'
  
  const { filters, setFilters } = useCandidatesStore()
  const queryClient = useQueryClient()

  // #update filters from URL params
  React.useEffect(() => {
    const urlFilters = {
      search: searchParams.get('search') || '',
      stage: searchParams.get('stage') || '',
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: parseInt(searchParams.get('pageSize') || '20')
    }
    setFilters(urlFilters)
  }, [searchParams, setFilters])

  // #fetch candidates
  const { data: candidatesData, isLoading } = useQuery({
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

  // #update candidate stage mutation
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
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
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

  const handleStageChange = (candidateId, newStage) => {
    updateCandidateMutation.mutate({
      id: candidateId,
      updates: { stage: newStage }
    })
  }

  const candidates = candidatesData?.data || []
  const pagination = candidatesData?.pagination

  return (
    <div className="min-h-screen bg-base-200">
      {/* #header */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link to="/admin" className="btn btn-ghost">
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold ml-4">Candidates Management</h1>
        </div>
        <div className="flex-none">
          <div className="flex gap-2">
            <div className="tabs tabs-boxed">
              <button
                className={`tab ${viewMode === 'list' ? 'tab-active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
              <button
                className={`tab ${viewMode === 'kanban' ? 'tab-active' : ''}`}
                onClick={() => setViewMode('kanban')}
              >
                Kanban View
              </button>
            </div>
          </div>
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
                  placeholder="Search candidates..."
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Stage</span>
                </label>
                <select
                  value={filters.stage}
                  onChange={(e) => handleFilterChange({ stage: e.target.value })}
                  className="select select-bordered"
                >
                  <option value="">All Stages</option>
                  {Object.values(CANDIDATE_STAGES).map(stage => (
                    <option key={stage} value={stage}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
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
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* #candidates content */}
        {isLoading ? (
          <LoadingSpinner text="Loading candidates..." />
        ) : (
          <>
            {viewMode === 'list' ? (
              <VirtualizedList
                candidates={candidates}
                onStageChange={handleStageChange}
                height={600}
              />
            ) : (
              <KanbanBoard
                candidates={candidates}
                onStageChange={handleStageChange}
              />
            )}

            {/* #pagination for list view */}
            {viewMode === 'list' && pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
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
      </div>
    </div>
  )
}

export default CandidatesPage
