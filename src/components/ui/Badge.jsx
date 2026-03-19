import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
  
  const variants = {
    neutral: 'bg-gray-800 text-text-secondary',
    buy: 'bg-accent-buy/20 text-accent-buy',
    sell: 'bg-accent-sell/20 text-accent-sell',
    success: 'bg-green-600/20 text-green-500', 
    warning: 'bg-yellow-500/20 text-yellow-500',
    danger: 'bg-red-500/20 text-red-500',
  };

  return (
    <span className={`${baseClasses} ${variants[variant] || variants.neutral} ${className}`}>
      {children}
    </span>
  );
};
