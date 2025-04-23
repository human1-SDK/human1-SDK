/**
 * Type definitions for Human1 SDK UI components
 */
import React from 'react';

/**
 * Base props for all UI components
 */
export interface BaseProps {
  /** Custom CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

/**
 * Query input component props
 */
export interface QueryInputProps extends BaseProps {
  /** Callback function triggered when a query is submitted */
  onSubmit: (query: string) => void;
  /** Loading state to display spinner/disabled state */
  isLoading?: boolean;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Initial query value */
  initialValue?: string;
  /** Width of the input component */
  width?: string | number;
  /** Label for the submit button */
  submitButtonLabel?: string;
  /** Additional class name for the submit button */
  submitButtonClassName?: string;
}

/**
 * Structure of table data for display
 */
export interface TableData {
  /** Column headers */
  columns: string[];
  /** Row data */
  rows: any[][];
}

/**
 * Structure of paragraph data for display
 */
export interface ParagraphData {
  /** Text content */
  text: string;
}

/**
 * Structure of error data for display
 */
export interface ErrorData {
  /** Error message */
  message: string;
  /** SQL query that caused the error (if applicable) */
  query?: string;
  /** Suggested corrections */
  suggestions?: string[];
}

/**
 * Union type for all possible response data types
 */
export type ResponseData = 
  | { type: 'table'; data: TableData } 
  | { type: 'paragraph'; data: ParagraphData }
  | { type: 'error'; data: ErrorData };

/**
 * Props for the response display component
 */
export interface QueryResponseDisplayProps extends BaseProps {
  /** Response data to display */
  data: ResponseData;
  /** Optional title for the response section */
  title?: string;
}

/**
 * Props for the table view component
 */
export interface TableViewProps extends BaseProps {
  /** Table data to display */
  data: TableData;
  /** Optional maximum height for the table container */
  maxHeight?: string | number;
}

/**
 * Props for the paragraph view component
 */
export interface ParagraphViewProps extends BaseProps {
  /** Paragraph data to display */
  data: ParagraphData;
}

/**
 * Props for the error display component
 */
export interface ErrorDisplayProps extends BaseProps {
  /** Error data to display */
  data: ErrorData;
} 