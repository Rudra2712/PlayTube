import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false,
  ...props 
}) => {
  const baseClasses = 'bg-gray-800 border border-gray-700 rounded-xl shadow-lg';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const hoverClasses = hover ? 'hover:bg-gray-750 hover:border-gray-600 transition-all duration-200' : '';
  
  return (
    <div
      className={`${baseClasses} ${paddings[padding]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;