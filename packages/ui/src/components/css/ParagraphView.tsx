import React from 'react';
import { ParagraphViewProps } from '../../types';
import ReactMarkdown from "react-markdown";

const MarkdownViewer = ({ markdown }: { markdown: string }) => {
  // Pre-process the markdown to ensure line breaks are respected
  const processedMarkdown = markdown
    .replace(/\\n\\n/g, '\n\n') // Replace literal \n\n with actual double newlines
    .replace(/\\n/g, '\n')      // Replace literal \n with actual newlines
    .replace(/\n\n/g, '\n\n')   // Preserve paragraph breaks (double newlines)
    .replace(/\n(?!\n)/g, '  \n'); // Add two spaces before single newlines (but not double)
    
  return (
    <div className="prose">
      <ReactMarkdown 
        components={{
          p: ({node, ...props}) => <p style={{whiteSpace: 'pre-wrap'}} {...props} />,
          br: () => <br />
        }}
      >
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  );
};

/**
 * Tries to identify if text is JSON and formats it nicely
 * @param text - Text to check and format
 * @returns Formatted text
 */
const formatJsonIfNeeded = (text: string): string => {
  if (!text) return '';
  
  try {
    // See if it's valid JSON
    const parsed = JSON.parse(text);
    // If it's already a string representation, don't double-format it
    if (typeof parsed === 'string') {
      return text;
    }
    // Return pretty-printed JSON
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    // Not JSON, return as is
    return text;
  }
};

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
  if (!data) {
    return (
      <div className={`human1-paragraph-error ${className}`}>
        No content to display
      </div>
    );
  }

  // Handle cases when text isn't directly available
  let textContent = '';
  if (typeof data.text === 'string') {
    textContent = data.text;
  } else if (data.text === undefined && typeof data === 'object') {
    // Try to use the whole data object as text
    textContent = JSON.stringify(data, null, 2);
  } else if (data.text === undefined && typeof data === 'string') {
    textContent = data;
  } else if (data.text === null || data.text === undefined) {
    return (
      <div className={`human1-paragraph-error ${className}`}>
        No content to display
      </div>
    );
  } else {
    // Handle any other data types
    textContent = String(data.text);
  }

  // Format JSON if needed
  const formattedText = formatJsonIfNeeded(textContent);
  
  // Check if it's JSON data
  const isJsonData = formattedText !== textContent && formattedText.includes('{') && formattedText.includes('}');
  
  if (isJsonData) {
    // For JSON data, use pre tag for proper formatting
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
        <pre 
          style={{ 
            margin: '0',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            overflowX: 'auto',
          }}
        >
          {formattedText}
        </pre>
      </div>
    );
  }
  
  // For regular text, split by newlines to create paragraphs
  return (
    <MarkdownViewer markdown={data.text} />
  );
}; 
