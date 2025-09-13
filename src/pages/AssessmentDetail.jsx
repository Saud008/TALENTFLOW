import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const AssessmentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showPreview, setShowPreview] = useState(false)

  // Sample assessment data - in real app, this would come from API
  const assessment = {
    id: parseInt(id),
    title: 'Frontend Developer Assessment',
    job: 'Senior Frontend Developer',
    questionsCount: 15,
    duration: '60 minutes',
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
            onClick={() => navigate('/assessments')}
            className="btn btn-ghost btn-sm"
          >
            ← Back to Assessments
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assessment Details</h1>
            <p className="text-gray-600 mt-1">View and manage assessment information</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="btn btn-outline btn-primary">
            Edit Assessment
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="btn btn-primary"
          >
            Preview Assessment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assessment Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-base-300 p-6 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{assessment.title}</h2>
                <p className="text-gray-600 mb-4">{assessment.job}</p>
                <div className="flex items-center space-x-3">
                  <span className={getStatusBadge(assessment.status)}>
                    {assessment.status}
                  </span>
                  <span className={getDifficultyBadge(assessment.difficulty)}>
                    {assessment.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{assessment.questionsCount}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{assessment.duration}</div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{assessment.createdDate}</div>
                <div className="text-sm text-gray-600">Created</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{assessment.lastModified}</div>
                <div className="text-sm text-gray-600">Modified</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700">{assessment.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills Tested</h3>
              <div className="flex flex-wrap gap-2">
                {assessment.skills.map((skill, index) => (
                  <span key={index} className="badge badge-outline">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-base-300 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Questions ({assessment.questionsCount})</h3>
            <div className="space-y-4">
              {assessment.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
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
              ))}
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
