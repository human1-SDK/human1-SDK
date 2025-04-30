import React from 'react';

// Define our custom props separately
type CustomButtonProps = {
  /** Button visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** When true, button takes full width of container */
  fullWidth?: boolean;
  /** When true, displays loading spinner and disables the button */
  loading?: boolean;
  /** Icon to display at the left side of the button text */
  iconLeft?: React.ReactNode;
  /** Icon to display at the right side of the button text */
  iconRight?: React.ReactNode;
};

// Combine them for our component props
export type ButtonProps = CustomButtonProps & 
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CustomButtonProps>;

/**
 * Button component for user interactions
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  iconLeft,
  iconRight,
  className = '',
  disabled,
  ...htmlProps
}, ref) => {
  // Base classes that are always applied
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Get size classes
  let sizeClasses = 'px-4 py-2 text-base'; // default md
  if (size === 'sm') sizeClasses = 'px-3 py-1.5 text-sm';
  if (size === 'lg') sizeClasses = 'px-6 py-3 text-lg';

  // Get variant classes
  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-300 disabled:bg-blue-300';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-300 disabled:bg-gray-100 disabled:text-gray-400';
      break;
    case 'outline':
      variantClasses = 'bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-200 disabled:border-blue-200 disabled:text-blue-200';
      break;
    case 'text':
      variantClasses = 'bg-transparent text-blue-500 hover:underline hover:bg-blue-50 focus:ring-blue-200 disabled:text-blue-200';
      break;
    default:
      variantClasses = 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-blue-300 disabled:bg-blue-300';
  }

  // Loading and disabled classes
  const stateClasses = (loading || disabled) ? 'cursor-not-allowed' : 'cursor-pointer';

  const classes = [
    baseClasses, 
    sizeClasses, 
    variantClasses, 
    widthClasses, 
    stateClasses, 
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...htmlProps}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!loading && iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {!loading && iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
});

Button.displayName = 'Button'; 