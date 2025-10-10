import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import Logo from '../Atoms/Logo';

const LoadingPage = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <Logo />
        </div>
        
        {/* Loading Spinner */}
        <div className="mb-6">
          <LoadingSpinner size="xl" className="mx-auto" />
        </div>
        
        {/* Loading Message */}
        <p className="text-gray-300 text-lg font-medium">{message}</p>
        
        {/* Animated dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-[#ae7aff] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#ae7aff] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#ae7aff] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;