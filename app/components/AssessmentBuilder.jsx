import React, { useState } from 'react'
import { QUESTION_TYPES } from '../utils/constants'

// #assessment builder component
const AssessmentBuilder = ({ assessment, onSave, onPreview }) => {
  const [formData, setFormData] = useState({
    title: assessment?.title || '',
    description: assessment?.description || '',
    timeLimit: assessment?.timeLimit || 60,
    passingScore: assessment?.passingScore || 70,
    questions: assessment?.questions || []
  })

  const [editingQuestion, setEditingQuestion] = useState(null)

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addQuestion = (type) => {
    const newQuestion = {
      id: `q${Date.now()}`,
      type,
      question: '',
      required: true,
      order: formData.questions.length + 1,
      ...getDefaultQuestionData(type)
    }
    
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
    setEditingQuestion(newQuestion.id)
  }

  const getDefaultQuestionData = (type) => {
    switch (type) {
      case QUESTION_TYPES.SINGLE_CHOICE:
      case QUESTION_TYPES.MULTI_CHOICE:
        return { options: ['Option 1', 'Option 2'] }
      case QUESTION_TYPES.SHORT_TEXT:
      case QUESTION_TYPES.LONG_TEXT:
        return { maxLength: type === QUESTION_TYPES.SHORT_TEXT ? 100 : 500 }
      case QUESTION_TYPES.NUMERIC:
        return { min: 0, max: 100 }
      case QUESTION_TYPES.FILE_UPLOAD:
        return { acceptedTypes: ['.pdf', '.doc', '.docx'], maxSize: 10485760 }
      default:
        return {}
    }
  }

  const updateQuestion = (questionId, updates) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }))
  }

  const deleteQuestion = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
    setEditingQuestion(null)
  }

  const handleSave = () => {
    onSave(formData)
  }

  const renderQuestionEditor = (question) => {
    return (
      <div className="card bg-base-100 shadow-md mb-4">
        <div className="card-body">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold">Question {question.order}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingQuestion(null)}
                className="btn btn-sm btn-ghost"
              >
                Close
              </button>
              <button
                onClick={() => deleteQuestion(question.id)}
                className="btn btn-sm btn-error"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Question Text</span>
              </label>
              <textarea
                value={question.question}
                onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                className="textarea textarea-bordered"
                rows={2}
                placeholder="Enter your question..."
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Required</span>
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                  className="checkbox"
                />
              </label>
            </div>

            {/* #question type specific fields */}
            {(question.type === QUESTION_TYPES.SINGLE_CHOICE || question.type === QUESTION_TYPES.MULTI_CHOICE) && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Options</span>
                </label>
                {question.options?.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options]
                        newOptions[index] = e.target.value
                        updateQuestion(question.id, { options: newOptions })
                      }}
                      className="input input-bordered flex-1"
                    />
                    <button
                      onClick={() => {
                        const newOptions = question.options.filter((_, i) => i !== index)
                        updateQuestion(question.id, { options: newOptions })
                      }}
                      className="btn btn-sm btn-error"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newOptions = [...(question.options || []), 'New Option']
                    updateQuestion(question.id, { options: newOptions })
                  }}
                  className="btn btn-sm btn-outline"
                >
                  Add Option
                </button>
              </div>
            )}

            {question.type === QUESTION_TYPES.NUMERIC && (
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Min Value</span>
                  </label>
                  <input
                    type="number"
                    value={question.min || 0}
                    onChange={(e) => updateQuestion(question.id, { min: parseInt(e.target.value) })}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Max Value</span>
                  </label>
                  <input
                    type="number"
                    value={question.max || 100}
                    onChange={(e) => updateQuestion(question.id, { max: parseInt(e.target.value) })}
                    className="input input-bordered"
                  />
                </div>
              </div>
            )}

            {(question.type === QUESTION_TYPES.SHORT_TEXT || question.type === QUESTION_TYPES.LONG_TEXT) && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Max Length</span>
                </label>
                <input
                  type="number"
                  value={question.maxLength || 100}
                  onChange={(e) => updateQuestion(question.id, { maxLength: parseInt(e.target.value) })}
                  className="input input-bordered"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* #assessment header */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title">Assessment Builder</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="input input-bordered"
                placeholder="Assessment title"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Time Limit (minutes)</span>
              </label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => handleChange('timeLimit', parseInt(e.target.value))}
                className="input input-bordered"
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="textarea textarea-bordered"
              rows={3}
              placeholder="Assessment description"
            />
          </div>
        </div>
      </div>

      {/* #question types */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h3 className="font-semibold mb-4">Add Question</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(QUESTION_TYPES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => addQuestion(value)}
                className="btn btn-outline btn-sm"
              >
                {key.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* #questions list */}
      <div className="space-y-4">
        {formData.questions.map((question, index) => (
          <div key={question.id} className="card bg-base-100 shadow-md">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-primary">Q{question.order}</span>
                    <span className="badge badge-outline">{question.type.replace('_', ' ')}</span>
                    {question.required && <span className="badge badge-error">Required</span>}
                  </div>
                  <p className="text-sm">{question.question || 'No question text'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingQuestion(question.id)}
                    className="btn btn-sm btn-outline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteQuestion(question.id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* #actions */}
      <div className="flex justify-between">
        <button
          onClick={() => onPreview(formData)}
          className="btn btn-outline"
        >
          Preview
        </button>
        <button
          onClick={handleSave}
          className="btn btn-primary"
        >
          Save Assessment
        </button>
      </div>

      {/* #question editor modal */}
      {editingQuestion && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            {renderQuestionEditor(formData.questions.find(q => q.id === editingQuestion))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AssessmentBuilder
