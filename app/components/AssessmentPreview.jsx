import React, { useState } from 'react'
import { QUESTION_TYPES } from '../utils/constants'

// #assessment preview component
const AssessmentPreview = ({ assessment, onSubmit }) => {
  const [responses, setResponses] = useState({})
  const [errors, setErrors] = useState({})

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
    
    // #clear error when user responds
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: ''
      }))
    }
  }

  const validateResponses = () => {
    const newErrors = {}
    
    assessment.questions.forEach(question => {
      if (question.required && !responses[question.id]) {
        newErrors[question.id] = 'This question is required'
      }
      
      if (question.type === QUESTION_TYPES.NUMERIC && responses[question.id]) {
        const value = Number(responses[question.id])
        if (value < question.min || value > question.max) {
          newErrors[question.id] = `Value must be between ${question.min} and ${question.max}`
        }
      }
      
      if ((question.type === QUESTION_TYPES.SHORT_TEXT || question.type === QUESTION_TYPES.LONG_TEXT) && 
          responses[question.id] && responses[question.id].length > question.maxLength) {
        newErrors[question.id] = `Response must be ${question.maxLength} characters or less`
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateResponses()) return
    
    onSubmit(responses)
  }

  const renderQuestion = (question) => {
    const questionId = question.id
    const value = responses[questionId] || ''
    const error = errors[questionId]

    switch (question.type) {
      case QUESTION_TYPES.SINGLE_CHOICE:
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={questionId}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleResponseChange(questionId, e.target.value)}
                  className="radio radio-primary"
                />
                <span>{option}</span>
              </label>
            ))}
            {error && <p className="text-error text-sm">{error}</p>}
          </div>
        )

      case QUESTION_TYPES.MULTI_CHOICE:
        const selectedValues = value || []
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option]
                      : selectedValues.filter(v => v !== option)
                    handleResponseChange(questionId, newValues)
                  }}
                  className="checkbox checkbox-primary"
                />
                <span>{option}</span>
              </label>
            ))}
            {error && <p className="text-error text-sm">{error}</p>}
          </div>
        )

      case QUESTION_TYPES.SHORT_TEXT:
        return (
          <div>
            <input
              type="text"
              value={value}
              onChange={(e) => handleResponseChange(questionId, e.target.value)}
              className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
              maxLength={question.maxLength}
            />
            {error && <p className="text-error text-sm">{error}</p>}
            <p className="text-xs text-base-content/60 mt-1">
              {value.length}/{question.maxLength} characters
            </p>
          </div>
        )

      case QUESTION_TYPES.LONG_TEXT:
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => handleResponseChange(questionId, e.target.value)}
              className={`textarea textarea-bordered w-full ${error ? 'textarea-error' : ''}`}
              rows={4}
              maxLength={question.maxLength}
            />
            {error && <p className="text-error text-sm">{error}</p>}
            <p className="text-xs text-base-content/60 mt-1">
              {value.length}/{question.maxLength} characters
            </p>
          </div>
        )

      case QUESTION_TYPES.NUMERIC:
        return (
          <div>
            <input
              type="number"
              value={value}
              onChange={(e) => handleResponseChange(questionId, e.target.value)}
              className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
              min={question.min}
              max={question.max}
            />
            {error && <p className="text-error text-sm">{error}</p>}
            <p className="text-xs text-base-content/60 mt-1">
              Range: {question.min} - {question.max}
            </p>
          </div>
        )

      case QUESTION_TYPES.FILE_UPLOAD:
        return (
          <div>
            <input
              type="file"
              onChange={(e) => handleResponseChange(questionId, e.target.files[0])}
              className="file-input file-input-bordered w-full"
              accept={question.acceptedTypes?.join(',')}
            />
            {error && <p className="text-error text-sm">{error}</p>}
            <p className="text-xs text-base-content/60 mt-1">
              Accepted types: {question.acceptedTypes?.join(', ')}
            </p>
          </div>
        )

      default:
        return <p>Unsupported question type</p>
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h1 className="text-2xl font-bold mb-2">{assessment.title}</h1>
          <p className="text-base-content/70 mb-4">{assessment.description}</p>
          
          <div className="flex justify-between items-center mb-6">
            <span className="badge badge-info">
              Time Limit: {assessment.timeLimit} minutes
            </span>
            <span className="badge badge-primary">
              Passing Score: {assessment.passingScore}%
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {assessment.questions.map((question, index) => (
              <div key={question.id} className="assessment-question">
                <div className="flex items-start gap-2 mb-3">
                  <span className="badge badge-primary">Q{question.order}</span>
                  {question.required && <span className="badge badge-error">Required</span>}
                </div>
                
                <h3 className="font-semibold mb-3">{question.question}</h3>
                
                {renderQuestion(question)}
              </div>
            ))}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Submit Assessment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AssessmentPreview
