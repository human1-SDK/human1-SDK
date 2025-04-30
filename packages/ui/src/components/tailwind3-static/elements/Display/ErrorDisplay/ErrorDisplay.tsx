import React from 'react';
import { ErrorData } from '../../../../../types';

export interface ErrorDisplayProps {
  /** Error data to display */
  data: ErrorData;
  /** Additional CSS classes */
  className?: string;
  /** When true, shows a simplified view with the option to expand */
  compact?: boolean;
}

/**
 * ErrorDisplay Component
 * 
 * Displays error messages in a formatted way using Tailwind classes
 * 
 * @example
 * ```tsx
 * <ErrorDisplay 
 *   data={{ 
 *     message: 'An error occurred', 
 *     query: 'SELECT * FROM users', 
 *     suggestions: ['Check your syntax', 'Verify table exists'] 
 *   }} 
 * />
 * ```
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  data,
  className = '',
  compact = false,
}) => {
  if (!data) {
    return null;
  }

  const { message, query, suggestions } = data;
  const hasSuggestions = suggestions && suggestions.length > 0;
  
  return (
    <div 
      className={`p-4 sm:p-5 rounded-md bg-red-50 border border-red-200 text-red-600 shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className={`flex items-start ${(query || (hasSuggestions && !compact)) ? 'mb-3' : ''}`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2 text-red-500 mt-0.5 flex-shrink-0"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div className="font-semibold text-base flex-grow">
          {message}
        </div>
      </div>
      
      {query && !compact && (
        <div className="mt-3 p-3 bg-white/50 rounded-md text-sm whitespace-pre-wrap overflow-auto font-mono border border-red-100 max-h-60">
          <div className="font-semibold mb-1 text-red-700">Query:</div>
          <code className="block text-red-800">{query}</code>
        </div>
      )}

      {hasSuggestions && !compact && (
        <div className="mt-4">
          <div className="font-semibold mb-1 text-red-700">Suggestions:</div>
          <ul className="space-y-1 pl-5 list-disc text-sm text-red-700">
            {suggestions.map((suggestion: string, index: number) => (
              <li key={index} className="mb-1">{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {compact && (hasSuggestions || query) && (
        <div className="mt-1">
          <button 
            className="text-xs text-red-700 underline hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded"
            aria-label="Show error details"
          >
            Show details
          </button>
        </div>
      )}
    </div>
  );
};

ErrorDisplay.displayName = 'ErrorDisplay'; 