import React from 'react';

/**
 * Ensures identical corner radiuses and spacing rules per the design requirement.
 */
export const Button = React.forwardRef(({ 
  className = '', 
  variant = 'primary', 
  type = 'button', 
  children, 
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg rounded-lg';
  
  // 4-pixel grid: px-4 = 16px, py-2 = 8px
  const sizingClasses = 'px-4 py-2 text-sm';
  
  // Variants mapping out our colors
  const variants = {
    primary: 'bg-brand-surface border border-gray-700 hover:bg-brand-surface-hover text-text-primary focus:ring-gray-500',
    buy: 'bg-accent-buy hover:bg-accent-buy-hover text-white focus:ring-accent-buy',
    sell: 'bg-accent-sell hover:bg-accent-sell-hover text-white focus:ring-accent-sell',
    ghost: 'hover:bg-brand-surface text-text-secondary hover:text-text-primary focus:ring-gray-600',
  };

  const finalClasses = `${baseClasses} ${sizingClasses} ${variants[variant] || variants.primary} ${className}`;

  return (
    <button ref={ref} type={type} className={finalClasses} {...props}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';
