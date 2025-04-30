import React from 'react';
import { QueryResponseDisplayProps } from '../../../../types';
import { TableView } from '../../elements/Display/TableView';
import { ParagraphView } from '../../elements/Display/ParagraphView';
import { ErrorDisplay } from '../../elements/Display/ErrorDisplay';

/**
 * QueryResponseDisplay Component
 * 
 * Main display component that renders the appropriate view based on the response type
 * 
 * @example
 * ```tsx
 * <QueryResponseDisplay 
 *   data={{ 
 *     type: 'paragraph',
 *     data: { text: 'This is a sample response text.' }
 *   }}
 *   title="Query Results" 
 * />
 * ```
 */
export const QueryResponseDisplay: React.FC<QueryResponseDisplayProps> = ({
  data,
  title,
  className = '',
  style,
}) => {
  if (!data) {
    return null;
  }

  return (
    <div 
      className={`mt-5 ${className}`}
      style={style}
      aria-live="polite"
    >
      {title && (
        <h3 className="text-xl font-semibold mb-4">
          {title}
        </h3>
      )}

      {data.type === 'table' && (
        <TableView data={data.data} />
      )}

      {data.type === 'paragraph' && (
        <ParagraphView data={data.data} />
      )}

      {data.type === 'error' && (
        <ErrorDisplay data={data.data} />
      )}
    </div>
  );
};

QueryResponseDisplay.displayName = 'QueryResponseDisplay'; 