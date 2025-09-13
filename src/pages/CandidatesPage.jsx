import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { dataService } from '../services/dataService'

const CandidatesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStage, setSelectedStage] = useState('All')
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { addToast } = useToast()

  useEffect(() => {
    loadCandidates()
  }, [])

  const loadCandidates = () => {
    const candidatesData = dataService.getCandidates()
    setCandidates(candidatesData)
    setLoading(false)
  }

  const stages = ['All', 'Applied', 'Interview', 'Hired']

  // Filter candidates based on search term and stage
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.appliedJob.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStage = selectedStage === 'All' || candidate.stage === selectedStage
    
    return matchesSearch && matchesStage
  })

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
                onClick={() => navigate(`/candidates/${candidate.id}`)}
                className="btn btn-sm btn-outline btn-primary flex-1"
              >
                View Profile
              </button>
              <button className="btn btn-sm btn-outline btn-secondary flex-1">
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

      {/* Results Count */}
      {filteredCandidates.length > 0 && (
        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </div>
      )}
    </div>
  )
}

export default CandidatesPage
