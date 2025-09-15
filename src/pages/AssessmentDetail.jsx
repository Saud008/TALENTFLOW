import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'

const AssessmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast } = useToast()
  const [showPreview, setShowPreview] = useState(false)
  
  // Check if we're in edit mode
  const isEditMode = location.pathname.includes('/edit')

  // Sample assessment data - in real app, this would come from API
  const originalAssessment = {
    id: parseInt(id),
    title: 'Frontend Developer Assessment',
    job: 'Senior Frontend Developer',
    questionsCount: 15,
    duration: 60, // Store as number for easier editing
    difficulty: 'Intermediate',
    status: 'Active',
    createdDate: '2024-01-15',
    lastModified: '2024-01-20',
    description: 'This assessment evaluates candidates on their frontend development skills including React, JavaScript, CSS, and problem-solving abilities.',
    skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Problem Solving'],
    questions: [
      {
        id: 1,
        type: 'Multiple Choice',
        question: 'What is the correct way to create a functional component in React?',
        points: 5
      },
      {
        id: 2,
        type: 'Coding',
        question: 'Write a function to reverse a string in JavaScript.',
        points: 10
      },
      {
        id: 3,
        type: 'Multiple Choice',
        question: 'Which CSS property is used to change the text color?',
        points: 5
      }
    ]
  }

  // Form state for editing
  const [formData, setFormData] = useState(originalAssessment)
  const [hasChanges, setHasChanges] = useState(false)

  // Use either form data (in edit mode) or original data (in view mode)
  const assessment = isEditMode ? formData : originalAssessment

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setHasChanges(true)
  }

  // Handle save changes
  const handleSaveChanges = () => {
    // In a real app, this would make an API call
    addToast('Assessment updated successfully!', 'success')
    setHasChanges(false)
    navigate(`/admin/assessments/${id}`)
  }

  // Handle cancel changes
  const handleCancelChanges = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        setFormData(originalAssessment)
        setHasChanges(false)
        navigate(`/admin/assessments/${id}`)
      }
    } else {
      navigate(`/admin/assessments/${id}`)
    }
  }

  // Handle question changes
  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...formData.questions]
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }))
    setHasChanges(true)
  }

  // Add new question
  const handleAddQuestion = () => {
    const maxId = formData.questions.length > 0 ? Math.max(...formData.questions.map(q => q.id)) : 0
    const newQuestion = {
      id: maxId + 1,
      type: 'Multiple Choice',
      question: '',
      points: 5
    }
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      questionsCount: prev.questions.length + 1
    }))
    setHasChanges(true)
  }

  // Delete question
  const handleDeleteQuestion = (questionIndex) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const updatedQuestions = formData.questions.filter((_, index) => index !== questionIndex)
      setFormData(prev => ({
        ...prev,
        questions: updatedQuestions,
        questionsCount: updatedQuestions.length
      }))
      setHasChanges(true)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'badge badge-success'
      case 'Draft':
        return 'badge badge-warning'
      case 'Archived':
        return 'badge badge-neutral'
      default:
        return 'badge badge-neutral'
    }
  }

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'badge badge-info'
      case 'Intermediate':
        return 'badge badge-warning'
      case 'Hard':
        return 'badge badge-error'
      default:
        return 'badge badge-neutral'
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/assessments')}
            className="btn btn-ghost btn-sm"
          >
            ← Back to Assessments
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Assessment' : 'Assessment Details'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isEditMode ? 'Modify assessment settings and questions' : 'View and manage assessment information'}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          {isEditMode ? (
            <>
              <button 
                onClick={handleCancelChanges}
                className="btn btn-outline btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveChanges}
                className={`btn btn-primary ${hasChanges ? '' : 'btn-disabled'}`}
                disabled={!hasChanges}
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate(`/admin/assessments/${id}/edit`)}
                className="btn btn-outline btn-primary"
              >
                Edit Assessment
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="btn btn-primary"
              >
                Preview Assessment
              </button>
            </>
          )}
        </div>
      </div>

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">Edit Mode Active</h3>
              <p className="text-xs text-blue-700 dark:text-blue-300">You can now modify assessment settings and questions. Don't forget to save your changes!</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assessment Info */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                {isEditMode ? (
                  <div className="space-y-4">
                    {/* Title Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Assessment Title
                      </label>
                      <input
                        type="text"
                        value={assessment.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter assessment title"
                      />
                    </div>
                    
                    {/* Job Position Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Job Position
                      </label>
                      <input
                        type="text"
                        value={assessment.job}
                        onChange={(e) => handleInputChange('job', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter job position"
                      />
                    </div>
                    
                    {/* Status and Difficulty Dropdowns */}
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Status
                        </label>
                        <select
                          value={assessment.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="Active">Active</option>
                          <option value="Draft">Draft</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Difficulty
                        </label>
                        <select
                          value={assessment.difficulty}
                          onChange={(e) => handleInputChange('difficulty', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{assessment.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{assessment.job}</p>
                    <div className="flex items-center space-x-3">
                      <span className={getStatusBadge(assessment.status)}>
                        {assessment.status}
                      </span>
                      <span className={getDifficultyBadge(assessment.difficulty)}>
                        {assessment.difficulty}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {isEditMode ? (
                  <div>
                    <input
                      type="number"
                      value={assessment.questionsCount}
                      onChange={(e) => handleInputChange('questionsCount', parseInt(e.target.value))}
                      className="w-full text-center text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white"
                      min="1"
                      max="100"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{assessment.questionsCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
                  </div>
                )}
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {isEditMode ? (
                  <div>
                    <input
                      type="number"
                      value={assessment.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                      className="w-full text-center text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white"
                      min="5"
                      max="300"
                    />
                    <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{assessment.duration} minutes</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                  </div>
                )}
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{assessment.createdDate}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Created</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{assessment.lastModified}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Modified</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
              {isEditMode ? (
                <textarea
                  value={assessment.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows="4"
                  placeholder="Enter assessment description"
                />
              ) : (
                <p className="text-gray-700 dark:text-gray-300">{assessment.description}</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Skills Tested</h3>
              {isEditMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={assessment.skills.join(', ')}
                    onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter skills separated by commas (e.g., React, JavaScript, CSS)"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Separate skills with commas</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {assessment.skills.map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Questions List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Questions ({assessment.questionsCount})</h3>
              {isEditMode && (
                <button
                  onClick={handleAddQuestion}
                  className="btn btn-sm btn-primary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Question
                </button>
              )}
            </div>
            <div className="space-y-4">
              {assessment.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                  {isEditMode ? (
                    <div className="space-y-4">
                      {/* Question Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <select
                            value={question.type}
                            onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white text-sm"
                          >
                            <option value="Multiple Choice">Multiple Choice</option>
                            <option value="Coding">Coding</option>
                            <option value="Short Answer">Short Answer</option>
                            <option value="Essay">Essay</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={question.points}
                            onChange={(e) => handleQuestionChange(index, 'points', parseInt(e.target.value))}
                            className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white text-sm text-center"
                            min="1"
                            max="20"
                          />
                          <span className="text-sm text-gray-500 dark:text-gray-400">points</span>
                          <button
                            onClick={() => handleDeleteQuestion(index)}
                            className="btn btn-sm btn-error btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                            title="Delete question"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Question Text */}
                      <div className="ml-11">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Question Text
                        </label>
                        <textarea
                          value={question.question}
                          onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          rows="3"
                          placeholder="Enter your question here..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{question.type}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{question.points} points</span>
                      </div>
                      <p className="text-gray-900 dark:text-white ml-11">{question.question}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Empty state when no questions */}
              {assessment.questions.length === 0 && isEditMode && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mb-4">No questions added yet</p>
                  <button
                    onClick={handleAddQuestion}
                    className="btn btn-primary"
                  >
                    Add Your First Question
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="btn btn-outline btn-primary w-full">
                Duplicate Assessment
              </button>
              <button className="btn btn-outline btn-secondary w-full">
                Share Assessment
              </button>
              <button className="btn btn-outline btn-warning w-full">
                Archive Assessment
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Attempts</span>
                <span className="font-medium text-gray-900 dark:text-white">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                <span className="font-medium text-gray-900 dark:text-white">78%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                <span className="font-medium text-gray-900 dark:text-white">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Used</span>
                <span className="font-medium text-gray-900 dark:text-white">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Assessment Preview: {assessment.title}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="btn btn-ghost btn-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
                <p className="text-gray-700">
                  This assessment contains {assessment.questionsCount} questions and should take approximately {assessment.duration} to complete. 
                  Please answer all questions to the best of your ability.
                </p>
              </div>

              {assessment.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-gray-900">Question {index + 1}</h5>
                    <span className="text-sm text-gray-500">{question.points} points</span>
                  </div>
                  <p className="text-gray-700 mb-4">{question.question}</p>
                  
                  {question.type === 'Multiple Choice' ? (
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3">
                        <input type="radio" name={`q${question.id}`} className="radio" />
                        <span>Option A</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="radio" name={`q${question.id}`} className="radio" />
                        <span>Option B</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="radio" name={`q${question.id}`} className="radio" />
                        <span>Option C</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="radio" name={`q${question.id}`} className="radio" />
                        <span>Option D</span>
                      </label>
                    </div>
                  ) : (
                    <textarea
                      className="textarea textarea-bordered w-full"
                      placeholder="Enter your answer here..."
                      rows={4}
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  onClick={() => setShowPreview(false)}
                  className="btn btn-ghost"
                >
                  Close Preview
                </button>
                <button className="btn btn-primary">
                  Submit Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssessmentDetail
