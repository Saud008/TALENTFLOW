import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { dataService } from '../services/dataService'

const CandidateProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showContactModal, setShowContactModal] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [notes, setNotes] = useState([])
  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    loadCandidateData()
  }, [id])

  const loadCandidateData = () => {
    const candidates = dataService.getCandidates()
    const candidateData = candidates.find(c => c.id === parseInt(id))
    
    if (candidateData) {
      setCandidate(candidateData)
      const candidateNotes = dataService.getCandidateNotes(parseInt(id))
      setNotes(candidateNotes)
    }
    setLoading(false)
  }

  const statusTimeline = [
    {
      status: 'Applied',
      date: '2024-01-15',
      description: 'Application submitted',
      completed: true
    },
    {
      status: 'Phone Screen',
      date: '2024-01-18',
      description: 'Initial phone screening completed',
      completed: true
    },
    {
      status: 'Interview',
      date: '2024-01-25',
      description: 'Technical interview scheduled',
      completed: false
    },
    {
      status: 'Decision',
      date: 'TBD',
      description: 'Final decision pending',
      completed: false
    }
  ]

  const handleAddNote = (e) => {
    e.preventDefault()
    if (!newNote.trim()) return

    const note = {
      text: newNote,
      author: 'John Admin'
    }

    const newNoteData = dataService.addCandidateNote(parseInt(id), note)
    if (newNoteData) {
      setNotes(prev => [newNoteData, ...prev])
      setNewNote('')
      addToast('Note added successfully!', 'success')
    } else {
      addToast('Failed to add note', 'error')
    }
  }

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'Applied':
        return 'badge badge-info'
      case 'Interview':
        return 'badge badge-warning'
      case 'Hired':
        return 'badge badge-success'
      case 'Rejected':
        return 'badge badge-error'
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

  if (!candidate) {
    return (
      <div className="p-8">
        <div className="alert alert-error">
          <span>Candidate not found.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/candidates')}
            className="btn btn-ghost btn-sm"
          >
            ← Back to Candidates
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Candidate Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage candidate information</p>
          </div>
        </div>
        <button
          onClick={() => setShowContactModal(true)}
          className="btn btn-primary"
        >
          Contact Candidate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Candidate Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-base-300 p-6">
            <div className="text-center mb-6">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
              <p className="text-gray-600">{candidate.email}</p>
              <div className="mt-2">
                <span className={getStageBadge(candidate.stage)}>
                  {candidate.stage}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Applied Position
                </label>
                <p className="text-gray-900">{candidate.appliedJob}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <p className="text-gray-900">{candidate.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <p className="text-gray-900">{candidate.experience}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <p className="text-gray-900">{candidate.location}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Applied Date
                </label>
                <p className="text-gray-900">{candidate.appliedDate}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume
                </label>
                <a href="#" className="text-green-600 hover:text-green-700 underline">
                  {candidate.resume}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline and Notes */}
        <div className="lg:col-span-2 space-y-8">
          {/* Status Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-base-300 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Application Timeline</h3>
            <div className="space-y-4">
              {statusTimeline.map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    item.completed ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${
                        item.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {item.status}
                      </h4>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                    <p className={`text-sm ${
                      item.completed ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-xl shadow-sm border border-base-300 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Notes</h3>
            
            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="mb-6">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this candidate..."
                  className="input input-bordered flex-1"
                />
                <button type="submit" className="btn btn-primary">
                  Add Note
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="border-l-4 border-green-600 pl-4 py-2">
                  <p className="text-gray-900">{note.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">by {note.author}</span>
                    <span className="text-sm text-gray-500">{note.date} at {note.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Contact {candidate.name}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-gray-900">{candidate.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{candidate.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <p className="text-gray-900">{candidate.phone}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="btn btn-ghost flex-1"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.open(`mailto:${candidate.email}`)
                  setShowContactModal(false)
                }}
                className="btn btn-primary flex-1"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateProfile
