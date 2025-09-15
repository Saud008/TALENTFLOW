import React, { useMemo } from 'react'
import { FixedSizeList as List } from 'react-window'
import CandidateCard from './CandidateCard'

// #virtualized list component for candidates
const VirtualizedList = ({ candidates, onStageChange, height = 600 }) => {
  const memoizedCandidates = useMemo(() => candidates, [candidates])

  const Row = ({ index, style }) => {
    const candidate = memoizedCandidates[index]
    
    return (
      <div style={style} className="p-2">
        <CandidateCard
          candidate={candidate}
          onStageChange={onStageChange}
        />
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-base-content/60">No candidates found</p>
      </div>
    )
  }

  return (
    <div className="virtualized-list">
      <List
        height={height}
        itemCount={candidates.length}
        itemSize={200} // Approximate height of each candidate card
        width="100%"
      >
        {Row}
      </List>
    </div>
  )
}

export default VirtualizedList
