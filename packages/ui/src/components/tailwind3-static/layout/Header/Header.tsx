import React from 'react';

export interface HeaderProps {
  /** The text to display in the header */
  text?: string;
  /** Custom content to display in the header instead of the default text */
  content?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Custom CSS styles */
  style?: React.CSSProperties;
}

/**
 * Header Component
 * 
 * A reusable header component for layout purposes
 * 
 * @example
 * ```tsx
 * <Header text="Application Title" />
 * ```
 * 
 * @example
 * ```tsx
 * <Header 
 *   content={
 *     <div className="flex justify-between items-center p-4">
 *       <h1 className="text-xl font-bold">My App</h1>
 *       <nav>
 *         <ul className="flex space-x-4">
 *           <li><a href="/">Home</a></li>
 *           <li><a href="/about">About</a></li>
 *         </ul>
 *       </nav>
 *     </div>
 *   } 
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({
  text = 'Demo Header',
  content,
  className = '',
  style,
}) => {
  const finalContent = content || (
    <div className="p-2 text-center font-bold">{text}</div>
  );

  return (
    <header 
      className={`bg-white border-b border-gray-200 w-full ${className}`} 
      style={style}
      role="banner"
    >
      {finalContent}
    </header>
  );
};

Header.displayName = 'Header'; 