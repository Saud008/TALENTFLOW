import React from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CANDIDATE_STAGES } from '../utils/constants'

// #sortable candidate item
const SortableCandidate = ({ candidate, onStageChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="card-body p-3">
        <h4 className="font-semibold text-sm">{candidate.name}</h4>
        <p className="text-xs text-base-content/70">{candidate.email}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {candidate.skills?.slice(0, 2).map((skill, index) => (
            <span key={index} className="badge badge-outline badge-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// #kanban column
const KanbanColumn = ({ stage, candidates, onStageChange }) => {
  const getStageColor = (stage) => {
    switch (stage) {
      case CANDIDATE_STAGES.APPLIED:
        return 'border-blue-200 bg-blue-50'
      case CANDIDATE_STAGES.SCREENING:
        return 'border-yellow-200 bg-yellow-50'
      case CANDIDATE_STAGES.INTERVIEW:
        return 'border-purple-200 bg-purple-50'
      case CANDIDATE_STAGES.ASSESSMENT:
        return 'border-indigo-200 bg-indigo-50'
      case CANDIDATE_STAGES.OFFER:
        return 'border-green-200 bg-green-50'
      case CANDIDATE_STAGES.HIRED:
        return 'border-green-300 bg-green-100'
      case CANDIDATE_STAGES.REJECTED:
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className={`kanban-column rounded-lg border-2 ${getStageColor(stage)} p-4`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold capitalize">{stage}</h3>
        <span className="badge badge-neutral">{candidates.length}</span>
      </div>
      
      <SortableContext
        items={candidates.map(c => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {candidates.map(candidate => (
            <SortableCandidate
              key={candidate.id}
              candidate={candidate}
              onStageChange={onStageChange}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

// #main kanban board component
const KanbanBoard = ({ candidates, onStageChange }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // #group candidates by stage
  const candidatesByStage = CANDIDATE_STAGES.reduce((acc, stage) => {
    acc[stage] = candidates.filter(candidate => candidate.stage === stage)
    return acc
  }, {})

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over) return

    const activeCandidate = candidates.find(c => c.id === active.id)
    const overStage = over.id

    if (activeCandidate && activeCandidate.stage !== overStage) {
      onStageChange(activeCandidate.id, overStage)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(candidatesByStage).map(([stage, stageCandidates]) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            candidates={stageCandidates}
            onStageChange={onStageChange}
          />
        ))}
      </div>
    </DndContext>
  )
}

export default KanbanBoard
