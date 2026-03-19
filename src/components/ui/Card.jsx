import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-brand-surface rounded-lg border border-gray-800 p-4 md:p-6 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
};
