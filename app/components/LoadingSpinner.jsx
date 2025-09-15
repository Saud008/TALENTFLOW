import React from 'react'

// #loading spinner component
const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <span className={`loading loading-spinner ${sizeClasses[size]}`}></span>
      {text && <p className="mt-2 text-sm text-base-content/70">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
