import React, { useState } from 'react';
import { QueryInput } from '../../Input/QueryInput';
import { QueryResponseDisplay } from '../../Response/QueryResponseDisplay';
import { Header } from '../../../layout/Header/Header';
import { Footer } from '../../../layout/Footer/Footer';
import { ResponseData } from '../../../../../types';

/**
 * Props interface for the QueryDemoSection component.
 */
export interface QueryDemoSectionProps {
  /** Title text displayed at the top of the section */
  title?: string;
  /** Description text displayed below the title */
  description?: string;
  /** Additional CSS classes to apply to the section container */
  className?: string;
  /** Inline styles for the section container */
  style?: React.CSSProperties;
  /** Whether to show guidance about submitting the query */
  showSubmitGuidance?: boolean;
  /** Text displayed in the guidance tooltip */
  guidanceText?: string;
  /** Initial value for the query input */
  initialQuery?: string;
  /** Placeholder text for the query input */
  placeholderText?: string;
  /** Label for the submit button */
  submitButtonLabel?: string;
  /** Whether to use demo mode (generates sample responses) */
  demoMode?: boolean;
  /** Custom content for the header */
  headerContent?: React.ReactNode;
  /** Text for the header */
  headerText?: string;
  /** Whether to display the header */
  showHeader?: boolean;
  /** Custom content for the footer */
  footerContent?: React.ReactNode;
  /** Text for the footer */
  footerText?: string;
  /** Whether to display the footer */
  showFooter?: boolean;
  /** Callback function called when a query is submitted */
  onSubmit?: (query: string, type?: 'paragraph' | 'table') => void;
}

/**
 * QueryDemoSection Component
 * 
 * A section component that provides a query interface with submission and response display.
 * This component is the foundational building block for both QueryDemoCard and QueryDemoPage.
 * 
 * @example
 * ```jsx
 * <QueryDemoSection
 *   title="Sales Data Query"
 *   description="Ask questions about our sales data"
 *   initialQuery="What were our Q1 sales?"
 *   showHeader={true}
 *   headerText="ACME Corp Analytics"
 *   demoMode={true}
 * />
 * ```
 */
export const QueryDemoSection: React.FC<QueryDemoSectionProps> = ({
  title = 'Query Demo',
  description = 'Enter a query to see sample responses',
  className = '',
  style,
  showSubmitGuidance = false,
  guidanceText = 'Try submitting the query to see response data!',
  initialQuery = '',
  placeholderText = 'Ask a question about your data...',
  submitButtonLabel = 'Submit Query',
  demoMode = true,
  headerContent,
  headerText = 'Demo Section',
  showHeader = false,
  footerContent,
  footerText = '© 2023 Demo Section',
  showFooter = false,
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
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`} style={style}>
      {showHeader && (
        <Header
          text={headerText}
          content={headerContent}
        />
      )}
      
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
      
      {showFooter && (
        <Footer
          text={footerText}
          content={footerContent}
        />
      )}

      {showSubmitGuidance && !querySubmitted && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 p-2 rounded shadow-md text-sm z-10">
          {guidanceText}
        </div>
      )}
    </div>
  );
}; 