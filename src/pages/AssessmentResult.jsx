import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

const AssessmentResult = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { assessmentId } = useParams()
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (location.state?.result) {
      setResult(location.state.result)
    } else {
      // If no result data, redirect back to assessments
      navigate('/candidate/assessments')
    }
  }, [location.state, navigate])

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    )
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400'
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreIcon = (percentage) => {
    if (percentage >= 80) {
      return (
        <svg className="w-16 h-16 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    }
    if (percentage >= 60) {
      return (
        <svg className="w-16 h-16 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    }
    return (
      <svg className="w-16 h-16 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Assessment Results
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {result.assessmentTitle}
          </p>
        </div>

        {/* Main Result Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="text-center mb-8">
            {getScoreIcon(result.percentage)}
            <h2 className={`text-4xl font-bold mt-4 ${getScoreColor(result.percentage)}`}>
              {result.percentage}%
            </h2>
            <p className={`text-xl font-semibold mt-2 ${result.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {result.status}
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.totalQuestions}</p>
              <p className="text-gray-600 dark:text-gray-400">Total Questions</p>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.correctAnswers}</p>
              <p className="text-gray-600 dark:text-gray-400">Correct Answers</p>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.wrongAnswers}</p>
              <p className="text-gray-600 dark:text-gray-400">Wrong Answers</p>
            </div>
          </div>

          {/* Completion Info */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m1-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Completed on {result.completedDate}
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Detailed Results
          </h3>
          
          <div className="space-y-6">
            {result.detailedResults.map((item, index) => (
              <div key={item.questionId} className={`p-4 rounded-lg border ${
                item.isCorrect 
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                  : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.isCorrect 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    {item.isCorrect ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">
                      Question {index + 1}: {item.question}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">Your Answer:</p>
                        <p className={`font-medium ${
                          item.isCorrect 
                            ? 'text-green-700 dark:text-green-300' 
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          {item.userAnswer !== undefined 
                            ? (() => {
                                if (item.type === 'multi-choice' && Array.isArray(item.userAnswer)) {
                                  return item.userAnswer.map(idx => 
                                    item.options ? `${String.fromCharCode(65 + idx)}. ${item.options[idx]}` : idx
                                  ).join(', ')
                                } else if (item.type === 'file-upload' && item.userAnswer) {
                                  return item.userAnswer.name || 'File uploaded'
                                } else if (item.options && typeof item.userAnswer === 'number') {
                                  return `${String.fromCharCode(65 + item.userAnswer)}. ${item.options[item.userAnswer]}`
                                } else {
                                  return String(item.userAnswer)
                                }
                              })()
                            : 'Not answered'
                          }
                        </p>
                      </div>
                      
                      {!item.isCorrect && item.correctAnswer !== undefined && (
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 mb-1">Correct Answer:</p>
                          <p className="font-medium text-green-700 dark:text-green-300">
                            {(() => {
                              if (item.type === 'multi-choice' && Array.isArray(item.correctAnswer)) {
                                return item.correctAnswer.map(idx => 
                                  item.options ? `${String.fromCharCode(65 + idx)}. ${item.options[idx]}` : idx
                                ).join(', ')
                              } else if (item.options && typeof item.correctAnswer === 'number') {
                                return `${String.fromCharCode(65 + item.correctAnswer)}. ${item.options[item.correctAnswer]}`
                              } else {
                                return String(item.correctAnswer)
                              }
                            })()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/candidate/assessments')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Assessments
          </button>
          
          <button
            onClick={() => window.print()}
            className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssessmentResult
