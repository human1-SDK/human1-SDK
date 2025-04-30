import React from 'react';
import { ParagraphData } from '../../../../../types';

export interface ParagraphViewProps {
  /** Paragraph data to display */
  data: ParagraphData;
  /** Additional CSS classes */
  className?: string;
  /** When true, shows a condensed view with "Read more" option */
  condensed?: boolean;
  /** Optional max height for scrollable content */
  maxHeight?: string;
}

/**
 * ParagraphView Component
 * 
 * Displays natural language responses in paragraph format using Tailwind classes
 * 
 * @example
 * ```tsx
 * <ParagraphView 
 *   data={{ text: 'This is a sample paragraph text that will be displayed in the component.' }} 
 * />
 * ```
 */
export const ParagraphView: React.FC<ParagraphViewProps> = ({
  data,
  className = '',
  condensed = false,
  maxHeight,
}) => {
  if (!data || !data.text) {
    return (
      <div className={`text-red-500 italic px-4 py-3 text-sm ${className}`}>
        No content to display
      </div>
    );
  }

  // Split text by newlines to create paragraphs
  const paragraphs = data.text.split('\n').filter((p: string) => p.trim());
  const hasParagraphs = paragraphs.length > 0;

  const containerStyles: React.CSSProperties = {
    maxHeight: maxHeight || 'none',
  };

  return (
    <div 
      className={`p-4 sm:p-5 rounded-md bg-white border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
      style={containerStyles}
    >
      <div className={`${maxHeight ? 'overflow-y-auto' : ''} ${condensed ? 'line-clamp-3' : ''}`}>
        {hasParagraphs ? (
          <div className="space-y-3">
            {paragraphs.map((paragraph: string, index: number) => (
              <p 
                key={`p-${index}`}
                className="text-gray-700 text-base md:text-base leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 text-base md:text-base leading-relaxed">
            {data.text}
          </p>
        )}
      </div>
      
      {condensed && paragraphs.length > 3 && (
        <div className="mt-2 text-right">
          <button 
            className="text-blue-600 text-sm hover:text-blue-800 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1"
            aria-label="Expand to read more"
          >
            Read more
          </button>
        </div>
      )}
    </div>
  );
};

ParagraphView.displayName = 'ParagraphView'; 