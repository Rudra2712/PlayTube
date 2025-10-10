import React from 'react';

const Container = ({ 
  children, 
  size = 'default',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'max-w-2xl',
    default: 'max-w-7xl',
    lg: 'max-w-full',
    full: 'w-full'
  };
  
  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;