import React from 'react';
import { QueryDemoSection, QueryDemoSectionProps } from '../Section/QueryDemoSection';

/**
 * Props interface for the QueryDemoCard component.
 * Extends all props from QueryDemoSection and adds card-specific properties.
 */
export interface QueryDemoCardProps extends QueryDemoSectionProps {
  /** Title text displayed in the card header */
  cardTitle?: string;
  /** Description text displayed below the title */
  cardDescription?: string;
  /** Additional CSS classes to apply to the card container */
  cardClassName?: string;
  /** Inline styles for the card container */
  cardStyle?: React.CSSProperties;
  /** Custom content for the card footer */
  cardFooterContent?: React.ReactNode;
  /** Text for the default footer link */
  cardFooterText?: string;
  /** Whether to display the card footer */
  showCardFooter?: boolean;
}

/**
 * QueryDemoCard Component
 * 
 * A card component that wraps the QueryDemoSection component to provide a 
 * complete, contained query interface with header, body, and customizable footer.
 * 
 * @example
 * ```jsx
 * <QueryDemoCard
 *   cardTitle="Customer Query Tool"
 *   cardDescription="Search our customer database with natural language"
 *   initialQuery="Show me all customers in California"
 *   showCardFooter={true}
 *   cardFooterText="Need help?"
 * />
 * ```
 */
export const QueryDemoCard: React.FC<QueryDemoCardProps> = ({
  cardTitle = 'Human1 Query Demo',
  cardDescription = 'Try out the Human1 query system with this interactive demo',
  cardClassName = '',
  cardStyle,
  cardFooterContent,
  cardFooterText = 'Learn more about Human1',
  showCardFooter = true,
  ...sectionProps
}) => {
  const finalFooterContent = cardFooterContent || (
    <a 
      href="https://human1.ai" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
    >
      {cardFooterText}
    </a>
  );

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden ${cardClassName}`}
      style={cardStyle}
    >
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">{cardTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{cardDescription}</p>
      </div>
      
      <div className="p-4">
        <QueryDemoSection 
          {...sectionProps}
          className="p-0 max-w-none"
        />
      </div>
      
      {showCardFooter && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 text-right">
          {finalFooterContent}
        </div>
      )}
    </div>
  );
}; 