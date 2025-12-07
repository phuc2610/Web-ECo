import React from 'react'

const Loading = ({ size = 'medium', text = 'Đang tải...', fullScreen = false }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  const LoadingComponent = (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}></div>
      {text && (
        <p className='text-gray-600 text-sm font-medium animate-pulse'>{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className='fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50'>
        {LoadingComponent}
      </div>
    )
  }

  return LoadingComponent
}

export default Loading
