import React from 'react';
import { ParagraphViewProps } from '../../types';

/**
 * ParagraphView Component
 * 
 * Displays natural language responses in paragraph format
 */
export const ParagraphView: React.FC<ParagraphViewProps> = ({
  data,
  className = '',
  style,
}) => {
  if (!data || !data.text) {
    return (
      <div className={`human1-paragraph-error ${className}`}>
        No content to display
      </div>
    );
  }

  // Split text by newlines to create paragraphs
  const paragraphs = data.text.split('\n').filter(p => p.trim());

  return (
    <div 
      className={`human1-paragraph-container ${className}`}
      style={{ 
        padding: '16px',
        borderRadius: '4px',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        ...style
      }}
    >
      {paragraphs.length > 0 ? (
        paragraphs.map((paragraph, index) => (
          <p 
            key={`p-${index}`}
            style={{ 
              margin: '0 0 16px',
              lineHeight: '1.6',
              fontSize: '16px',
            }}
          >
            {paragraph}
          </p>
        ))
      ) : (
        <p style={{ 
          margin: '0',
          lineHeight: '1.6',
          fontSize: '16px',
        }}>
          {data.text}
        </p>
      )}
    </div>
  );
}; 