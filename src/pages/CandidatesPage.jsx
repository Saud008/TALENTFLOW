import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { dataService } from '../services/dataService'

const CandidatesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStage, setSelectedStage] = useState('All')
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({})
  const navigate = useNavigate()
  const { addToast } = useToast()

  useEffect(() => {
    loadCandidates()
  }, [currentPage, filters])

  const loadCandidates = () => {
    setLoading(true)
    const result = dataService.getCandidates(currentPage, 20, filters)
    setCandidates(result.candidates)
    setPagination({
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage
    })
    setLoading(false)
  }

  const handleFilterChange = () => {
    const newFilters = {}
    if (selectedStage !== 'All') {
      newFilters.stage = selectedStage
    }
    if (searchTerm.trim()) {
      newFilters.job = searchTerm
    }
    setFilters(newFilters)
    setCurrentPage(1)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilterChange()
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedStage])

  const stages = ['All', 'Screening', 'Interview', 'Offer', 'Hired', 'Archived']

  // Candidates are already filtered by the backend
  const filteredCandidates = candidates

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'Applied':
        return 'badge badge-info'
      case 'Interview':
        return 'badge badge-warning'
      case 'Hired':
        return 'badge badge-success'
      default:
        return 'badge badge-neutral'
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Candidates</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage candidate applications and track their progress</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search candidates by name, email, or job..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Stage Filter */}
          <div className="md:w-48">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="select select-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {stages.map(stage => (
                <option key={stage} value={stage}>
                  {stage === 'All' ? 'All Stages' : stage}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="candidate-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6 hover:shadow-md dark:hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>

              {/* Candidate Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {candidate.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {candidate.email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                  Applied for: {candidate.appliedJob}
                </p>
                
                {/* Stage Badge */}
                <div className="mt-3">
                  <span className={getStageBadge(candidate.stage)}>
                    {candidate.stage}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex space-x-2">
              <button 
                onClick={() => navigate(`/admin/candidates/${candidate.id}`)}
                className="btn btn-sm btn-outline btn-primary flex-1"
              >
                View Profile
              </button>
              <button 
                onClick={() => {
                  window.location.href = `mailto:${candidate.email}?subject=Regarding your application for ${candidate.appliedJob}&body=Dear ${candidate.name},%0D%0A%0D%0AThank you for your interest in the ${candidate.appliedJob} position.%0D%0A%0D%0ABest regards,%0D%0ASaud Masaud%0D%0ATalentFlow Team`
                  addToast('Opening email client...', 'info')
                }}
                className="btn btn-sm btn-outline btn-primary flex-1"
              >
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No candidates found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search terms or filter criteria
          </p>
        </div>
      )}

      {/* Results Count and Pagination */}
      {filteredCandidates.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalCount)} of {pagination.totalCount} candidates
            </div>
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                    const pageNumber = Math.max(1, pagination.currentPage - 2) + index
                    if (pageNumber > pagination.totalPages) return null
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-1 text-sm border rounded-md ${
                          pageNumber === pagination.currentPage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidatesPage
