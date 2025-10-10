import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const ComponentLoader = ({ 
  message = 'Loading...', 
  size = 'md', 
  className = '',
  fullHeight = false 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${fullHeight ? 'min-h-[400px]' : ''} ${className}`}>
      <LoadingSpinner size={size} className="mb-4" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
};

export default ComponentLoader;