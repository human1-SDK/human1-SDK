import React, { useState } from 'react';
import { QueryInput } from '../../Input/QueryInput';
import { QueryResponseDisplay } from '../../Response/QueryResponseDisplay';
import { Header } from '../../../layout/Header/Header';
import { Footer } from '../../../layout/Footer/Footer';
import { ResponseData } from '../../../../../types';

/**
 * Props interface for the QueryDemoPage component.
 */
export interface QueryDemoPageProps {
  /** Title text displayed at the top of the page */
  title?: string;
  /** Description text displayed below the title */
  description?: string;
  /** Additional CSS classes to apply to the outer container */
  className?: string;
  /** Inline styles for the outer container */
  style?: React.CSSProperties;
  /** Custom content for the header */
  headerContent?: React.ReactNode;
  /** Custom content for the footer */
  footerContent?: React.ReactNode;
  /** Whether to show guidance about submitting the query */
  showSubmitGuidance?: boolean;
  /** Text displayed in the guidance tooltip */
  guidanceText?: string;
  /** Additional CSS classes to apply to the inner container */
  containerClassName?: string;
  /** Inline styles for the inner container */
  containerStyle?: React.CSSProperties;
  /** Width of the page container */
  width?: string | number;
  /** Default text for the header when no custom content is provided */
  defaultHeaderText?: string;
  /** Default text for the footer when no custom content is provided */
  defaultFooterText?: string;
  /** Initial value for the query input */
  initialQuery?: string;
  /** Placeholder text for the query input */
  placeholderText?: string;
  /** Label for the submit button */
  submitButtonLabel?: string;
  /** Whether to use demo mode (generates sample responses) */
  demoMode?: boolean;
  /** Callback function called when a query is submitted */
  onSubmit?: (query: string, type?: 'paragraph' | 'table') => void;
}

/**
 * QueryDemoPage Component
 * 
 * A self-contained page component that provides a complete query interface with 
 * submission and response display. This is the top-level component in the query demo
 * hierarchy, designed to be used as a standalone page without needing additional containers.
 * 
 * @example
 * ```jsx
 * <QueryDemoPage
 *   title="Enterprise Data Query"
 *   description="Ask questions about our enterprise data"
 *   initialQuery="What were the Q1 sales figures?"
 *   defaultHeaderText="Company Data Portal"
 *   defaultFooterText="© 2023 Enterprise Corp"
 *   demoMode={true}
 * />
 * ```
 */
export const QueryDemoPage: React.FC<QueryDemoPageProps> = ({
  title = 'Query Demo',
  description = 'Enter a query to see sample responses',
  className = '',
  style,
  headerContent,
  footerContent,
  showSubmitGuidance = false,
  guidanceText = 'Try submitting the query to see response data!',
  containerClassName = 'p-4',
  containerStyle,
  width = '100%',
  defaultHeaderText = 'Demo Header',
  defaultFooterText = '© 2023 Demo Footer',
  initialQuery = '',
  placeholderText = 'Ask a question about your data...',
  submitButtonLabel = 'Submit Query',
  demoMode = true,
  onSubmit,
}) => {
  const [querySubmitted, setQuerySubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ResponseData | null>(null);

  // Sample data for demo mode
  const sampleTableData = {
    type: 'table' as const,
    data: {
      columns: ['ID', 'Name', 'Email', 'Status', 'Department'],
      rows: [
        [1, 'John Doe', 'john.doe@example.com', 'Active', 'Engineering'],
        [2, 'Jane Smith', 'jane.smith@example.com', 'Inactive', 'Marketing'],
        [3, 'Bob Johnson', 'bob.johnson@example.com', 'Active', 'Sales'],
        [4, 'Alice Brown', 'alice.brown@example.com', 'Pending', 'HR'],
        [5, 'Charlie Davis', 'charlie.davis@example.com', 'Active', 'Finance'],
      ],
    },
  };

  const sampleParagraphData = {
    type: 'paragraph' as const,
    data: {
      text: 'Based on your query, we found that sales have increased by 15% in Q1 2023 compared to the previous quarter. The North region showed the highest growth at 22%, followed by the West at 18%. The South and East regions showed modest growth of 10% and 9% respectively.\n\nProduct categories that performed exceptionally well include electronics (up 27%), home goods (up 19%), and outdoor equipment (up 23%). Fashion and accessories saw a slight decline of 3% compared to the previous quarter.',
    },
  };

  const sampleErrorData = {
    type: 'error' as const,
    data: {
      message: 'Error executing query: Invalid query syntax',
      query: 'SELECT * FROM users WHERE status = Active',
      suggestions: [
        'Make sure to enclose string values in quotes: WHERE status = "Active"',
        'Check for any missing commas or parentheses',
        'Verify that all tables and columns referenced exist in the database',
      ],
    },
  };

  const handleSubmit = async (query: string, type?: 'paragraph' | 'table') => {
    setQuerySubmitted(true);
    
    // Default to 'paragraph' if type is undefined
    const resolvedType = type || 'paragraph';
    
    // Call external onSubmit if provided
    if (onSubmit) {
      onSubmit(query, resolvedType);
    }

    if (demoMode) {
      // Demo mode - simulate API call with sample data
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine which sample data to show based on query content and type
      if (resolvedType === 'table') {
        setResponse(sampleTableData);
      } else if (query.toLowerCase().includes('error')) {
        setResponse(sampleErrorData);
      } else {
        setResponse(sampleParagraphData);
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-4 ${className}`} style={style}>
      <div 
        className={`max-w-4xl mx-auto bg-white rounded-lg shadow overflow-hidden ${containerClassName}`}
        style={{width, ...containerStyle}}
      >
        <Header 
          text={defaultHeaderText}
          content={headerContent}
        />
        
        <div className="p-6">
          {(title || description) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold mb-2">{title}</h1>}
              {description && <p className="text-gray-600">{description}</p>}
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Query Input</h2>
            <div className="mb-4">
              <QueryInput
                onSubmit={handleSubmit}
                isLoading={isLoading}
                initialValue={initialQuery}
                placeholder={placeholderText}
                submitButtonLabel={submitButtonLabel}
              />
            </div>
          </div>

          {response && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Response</h2>
              <QueryResponseDisplay data={response} />
            </div>
          )}
        </div>
        
        <Footer
          text={defaultFooterText}
          content={footerContent}
        />
      </div>

      {showSubmitGuidance && !querySubmitted && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 p-2 rounded shadow-md text-sm z-10">
          {guidanceText}
        </div>
      )}
    </div>
  );
}; 