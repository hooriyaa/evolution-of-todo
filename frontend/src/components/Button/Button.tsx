import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
}) => {
  // Base classes for all buttons
  let baseClasses = 'font-bold px-6 py-3 rounded-full shadow-sm hover:brightness-105 transition-all active:scale-95';
  
  // Variant-specific classes
  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = disabled 
        ? 'bg-brand-gray text-white cursor-not-allowed' 
        : 'bg-brand-lime text-brand-black';
      break;
    case 'secondary':
      variantClasses = disabled 
        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
      break;
    case 'danger':
      variantClasses = disabled 
        ? 'bg-red-300 text-white cursor-not-allowed' 
        : 'bg-red-500 text-white hover:bg-red-600';
      break;
    default:
      variantClasses = 'bg-brand-lime text-brand-black';
  }

  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
