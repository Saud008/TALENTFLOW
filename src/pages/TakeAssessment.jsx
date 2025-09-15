import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import candidateDataService from '../services/candidateDataService'
import { HiExclamation } from 'react-icons/hi'

const TakeAssessment = () => {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  
  const [assessment, setAssessment] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [showResultPopup, setShowResultPopup] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState(null)
  const [isRetaking, setIsRetaking] = useState(false)

  useEffect(() => {
    // Clear any previous session results when starting a new assessment
    sessionStorage.removeItem(`assessment-last-result-${assessmentId}`)
    
    // Load assessment and questions
    const assessments = candidateDataService.getAssessments()
    const currentAssessment = assessments.find(a => a.id === parseInt(assessmentId))
    const assessmentQuestions = candidateDataService.getAssessmentQuestions(parseInt(assessmentId))
    
    if (!currentAssessment || !assessmentQuestions.length) {
      navigate('/candidate/assessments')
      return
    }

    setAssessment(currentAssessment)
    setQuestions(assessmentQuestions)
    setTimeLeft(currentAssessment.duration * 60) // Convert minutes to seconds
  }, [assessmentId, navigate])

  // Timer countdown
  useEffect(() => {
    if (!assessment || timeLeft <= 0) {
      if (timeLeft <= 0) {
        handleAutoSubmit()
      }
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, assessment])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleMultiChoiceChange = (questionId, optionIndex, isChecked) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || []
      if (isChecked) {
        return {
          ...prev,
          [questionId]: [...currentAnswers, optionIndex].sort()
        }
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter(idx => idx !== optionIndex)
        }
      }
    })
  }

  const handleFileUpload = (questionId, file) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: file
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true)
    try {
      // Store answers locally
      const submissionData = {
        assessmentId: parseInt(assessmentId),
        answers,
        submittedAt: new Date().toISOString(),
        timeSpent: assessment ? ((assessment.duration * 60) - timeLeft) : 0
      }
      
      localStorage.setItem(`assessment-submission-${assessmentId}`, JSON.stringify(submissionData))
      
      // Calculate results
      const result = candidateDataService.submitAssessment(parseInt(assessmentId), answers)
      
      if (result && result.results) {
        setAssessmentResult(result.results)
        setShowConfirmSubmit(false)
        setShowResultPopup(true)
      } else {
        console.error('Failed to get assessment results')
        navigate('/candidate/assessments')
      }
      setIsSubmitting(false)
    } catch (error) {
      console.error('Error submitting assessment:', error)
      setIsSubmitting(false)
    }
  }

  const handleAutoSubmit = () => {
    if (!isSubmitting) {
      handleSubmitAssessment()
    }
  }

  const handleRetakeAssessment = () => {
    // Clear all session data
    sessionStorage.removeItem(`assessment-last-result-${assessmentId}`)
    
    // Reset all component state
    setAnswers({})
    setCurrentQuestionIndex(0)
    setShowResultPopup(false)
    setAssessmentResult(null)
    setIsSubmitting(false)
    setShowConfirmSubmit(false)
    setIsRetaking(true)
    
    // Reset timer
    if (assessment) {
      setTimeLeft(assessment.duration * 60)
    }
    
    // Small delay to ensure state is reset
    setTimeout(() => {
      setIsRetaking(false)
    }, 100)
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).filter(key => {
      const answer = answers[key]
      if (Array.isArray(answer)) return answer.length > 0
      if (typeof answer === 'string') return answer.trim().length > 0
      if (answer instanceof File) return true
      return answer !== undefined && answer !== null && answer !== ''
    }).length
  }

  const isQuestionAnswered = (questionId) => {
    const answer = answers[questionId]
    if (Array.isArray(answer)) return answer.length > 0
    if (typeof answer === 'string') return answer.trim().length > 0
    if (answer instanceof File) return true
    return answer !== undefined && answer !== null && answer !== ''
  }

  const getTimeColor = () => {
    const minutes = timeLeft / 60
    if (minutes <= 5) return 'text-red-600 dark:text-red-400'
    if (minutes <= 10) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  if (!assessment || !questions.length || isRetaking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {isRetaking ? 'Restarting assessment...' : 'Loading assessment...'}
          </p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with Timer */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {assessment.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Answered</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {getAnsweredCount()}/{questions.length}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Time Remaining</p>
              <p className={`text-lg font-bold ${getTimeColor()}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 px-6 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              {currentQuestion.question}
            </h2>
            
            {/* Single Choice Questions */}
            {currentQuestion.type === 'single-choice' && (
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <label 
                    key={index}
                    className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={index}
                      checked={answers[currentQuestion.id] === index}
                      onChange={() => handleAnswerChange(currentQuestion.id, index)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-3 text-gray-900 dark:text-white">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Multi Choice Questions */}
            {currentQuestion.type === 'multi-choice' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Select all that apply:
                </p>
                {currentQuestion.options.map((option, index) => (
                  <label 
                    key={index}
                    className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(answers[currentQuestion.id] || []).includes(index)}
                      onChange={(e) => handleMultiChoiceChange(currentQuestion.id, index, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-3 text-gray-900 dark:text-white">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Short Text Questions */}
            {currentQuestion.type === 'short-text' && (
              <div>
                <input
                  type="text"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  maxLength={currentQuestion.maxLength}
                  placeholder="Enter your answer..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {currentQuestion.maxLength && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {(answers[currentQuestion.id] || '').length}/{currentQuestion.maxLength} characters
                  </p>
                )}
              </div>
            )}

            {/* Long Text Questions */}
            {currentQuestion.type === 'long-text' && (
              <div>
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  maxLength={currentQuestion.maxLength}
                  rows={6}
                  placeholder="Enter your detailed answer..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-vertical"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span>
                    {currentQuestion.minLength && (
                      `Minimum ${currentQuestion.minLength} characters`
                    )}
                  </span>
                  <span>
                    {(answers[currentQuestion.id] || '').length}
                    {currentQuestion.maxLength && `/${currentQuestion.maxLength}`} characters
                  </span>
                </div>
              </div>
            )}

            {/* Numeric Questions */}
            {currentQuestion.type === 'numeric' && (
              <div>
                <input
                  type="number"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, parseFloat(e.target.value) || '')}
                  min={currentQuestion.range?.min}
                  max={currentQuestion.range?.max}
                  placeholder="Enter a number..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {currentQuestion.range && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Range: {currentQuestion.range.min} - {currentQuestion.range.max}
                  </p>
                )}
              </div>
            )}

            {/* File Upload Questions */}
            {currentQuestion.type === 'file-upload' && (
              <div>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {answers[currentQuestion.id] ? 'File Selected' : 'Upload File'}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {answers[currentQuestion.id] ? 
                      answers[currentQuestion.id].name : 
                      'Click to upload or drag and drop'
                    }
                  </p>
                  <input
                    type="file"
                    accept={currentQuestion.acceptedTypes?.join(',')}
                    onChange={(e) => handleFileUpload(currentQuestion.id, e.target.files[0])}
                    className="hidden"
                    id={`file-upload-${currentQuestion.id}`}
                  />
                  <label
                    htmlFor={`file-upload-${currentQuestion.id}`}
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Choose File
                  </label>
                  {currentQuestion.acceptedTypes && (
                    <p className="text-xs text-gray-400 mt-2">
                      Accepted: {currentQuestion.acceptedTypes.join(', ')} 
                      {currentQuestion.maxSize && ` (Max ${currentQuestion.maxSize})`}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Legacy MCQ Questions (no type specified) */}
            {!currentQuestion.type && currentQuestion.options && (
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <label 
                    key={index}
                    className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={index}
                      checked={answers[currentQuestion.id] === index}
                      onChange={() => handleAnswerChange(currentQuestion.id, index)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-3 text-gray-900 dark:text-white">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={() => setShowConfirmSubmit(true)}
                  className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                >
                  Submit Assessment
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Question Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : isQuestionAnswered(questions[index].id)
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Submit Assessment
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to submit your assessment? You have answered {getAnsweredCount()} out of {questions.length} questions.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Continue
                </button>
                <button
                  onClick={handleSubmitAssessment}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto-submit warning */}
      {timeLeft <= 300 && timeLeft > 0 && ( // Show warning in last 5 minutes
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-40">
          <p className="text-sm font-medium">
            <HiExclamation className="w-4 h-4 inline mr-1" /> Assessment will auto-submit in {formatTime(timeLeft)}
          </p>
        </div>
      )}

      {/* Beautiful Result Popup */}
      {showResultPopup && assessmentResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Assessment Completed!</h2>
                <p className="text-lg opacity-90">
                  {assessmentResult.assessmentTitle}
                </p>
              </div>
            </div>

            {/* Results Content */}
            <div className="p-6">
              {/* Score Display */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold mb-4 ${
                  assessmentResult.passed 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                    : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                }`}>
                  {assessmentResult.percentage}%
                </div>
                <p className={`text-xl font-semibold ${
                  assessmentResult.passed 
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {assessmentResult.status}
                </p>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{assessmentResult.totalQuestions}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                </div>

                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{assessmentResult.correctAnswers}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
                </div>

                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{assessmentResult.wrongAnswers}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Wrong</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowResultPopup(false)
                    navigate(`/candidate/assessments/${assessmentId}/result`, { 
                      state: { result: assessmentResult } 
                    })
                  }}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View Detailed Results
                </button>
                <button
                  onClick={handleRetakeAssessment}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Retake Assessment
                </button>
                <button
                  onClick={() => {
                    setShowResultPopup(false)
                    // Navigate back and force a refresh of the assessments page
                    navigate('/candidate/assessments', { replace: true })
                  }}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Back to Assessments
                </button>
              </div>

              {/* Congratulatory Message */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {assessmentResult.passed 
                    ? "🎉 Congratulations! You have successfully passed this assessment."
                    : "📚 Keep learning and try again when you're ready!"
                  }
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Your responses have been saved locally.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TakeAssessment
