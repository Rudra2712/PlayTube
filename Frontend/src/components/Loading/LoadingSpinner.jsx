import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 border-4 border-gray-600 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-[#ae7aff] rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;