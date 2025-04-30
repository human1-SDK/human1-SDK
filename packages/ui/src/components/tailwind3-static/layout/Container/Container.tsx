import React from 'react';

export interface ContainerProps {
  /** Content to be rendered inside the container */
  children: React.ReactNode;
  /** Maximum width of the container */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to add padding to the container */
  padding?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom CSS styles */
  style?: React.CSSProperties;
}

/**
 * Container Component
 * 
 * A flexible layout container that centers content with a max-width
 * 
 * @example
 * ```tsx
 * <Container maxWidth="lg">
 *   <h1>My Content</h1>
 *   <p>This will be centered with a max-width</p>
 * </Container>
 * ```
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({
  children,
  maxWidth = 'xl',
  padding = true,
  className = '',
  style,
  ...props
}, ref) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    full: 'max-w-full',
  };
  
  const classes = `
    mx-auto
    w-full
    ${maxWidthClasses[maxWidth]}
    ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}
    ${className}
  `;
  
  return (
    <div 
      ref={ref}
      className={classes}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container'; 