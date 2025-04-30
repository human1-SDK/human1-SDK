import React from 'react';

export interface FooterProps {
  /** The text to display in the footer */
  text?: string;
  /** Custom content to display in the footer instead of the default text */
  content?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Custom CSS styles */
  style?: React.CSSProperties;
}

/**
 * Footer Component
 * 
 * A reusable footer component for layout purposes
 * 
 * @example
 * ```tsx
 * <Footer text="© 2023 My Company" />
 * ```
 * 
 * @example
 * ```tsx
 * <Footer 
 *   content={
 *     <div className="flex justify-between items-center p-4">
 *       <div>© 2023 My Company</div>
 *       <div className="flex space-x-4">
 *         <a href="/privacy">Privacy</a>
 *         <a href="/terms">Terms</a>
 *       </div>
 *     </div>
 *   } 
 * />
 * ```
 */
export const Footer: React.FC<FooterProps> = ({
  text = '© 2023 Demo Footer',
  content,
  className = '',
  style,
}) => {
  const finalContent = content || (
    <div className="text-center text-gray-500 text-sm">{text}</div>
  );

  return (
    <footer 
      className={`bg-white border-t border-gray-200 py-2 ${className}`} 
      style={style}
      role="contentinfo"
    >
      <div className="w-full px-2 text-center">
        {finalContent}
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer'; 