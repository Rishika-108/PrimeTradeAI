import React from 'react';

export const Input = React.forwardRef(({ 
  className = '', 
  error, 
  id, 
  label, 
  ...props 
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full bg-[#121212] border ${error ? 'border-accent-sell focus:ring-accent-sell' : 'border-gray-700 focus:ring-accent-buy'} border-gray-700 rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 transition-colors ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-accent-sell font-medium mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
