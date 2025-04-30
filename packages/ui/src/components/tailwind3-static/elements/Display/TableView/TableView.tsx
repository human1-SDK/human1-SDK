import React, { useState } from 'react';
import { TableData } from '../../../../../types';

export interface TableViewProps {
  /** Table data with columns and rows */
  data: TableData;
  /** Optional table title displayed at the top */
  title?: string;
  /** Maximum height of the table with scrolling */
  maxHeight?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to use alternating row colors */
  striped?: boolean;
  /** Whether rows highlight on hover */
  hoverable?: boolean;
  /** Whether to show borders between cells */
  bordered?: boolean;
  /** Whether to use compact padding */
  compact?: boolean;
  /** Whether columns are sortable */
  sortable?: boolean;
}

/**
 * TableView Component
 * 
 * Displays structured data in a table format using Tailwind classes
 * 
 * @example
 * ```tsx
 * <TableView 
 *   data={{ 
 *     columns: ['Name', 'Age', 'City'],
 *     rows: [
 *       ['John Doe', 28, 'New York'],
 *       ['Jane Smith', 32, 'Chicago'] 
 *     ]
 *   }}
 *   striped
 *   hoverable
 *   sortable
 * />
 * ```
 */
export const TableView: React.FC<TableViewProps> = ({
  data,
  title,
  maxHeight = '400px',
  className = '',
  striped = true,
  hoverable = true,
  bordered = false,
  compact = false,
  sortable = false,
}) => {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  if (!data || !data.columns || !data.rows) {
    return (
      <div className={`text-red-500 italic p-4 text-sm ${className}`}>
        Invalid table data provided
      </div>
    );
  }

  // Handle sorting
  const sortedRows = React.useMemo(() => {
    if (sortable && sortColumn !== null) {
      return [...data.rows].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        // Handle different data types
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        // Convert to strings for comparison
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        
        return sortDirection === 'asc' 
          ? aString.localeCompare(bString) 
          : bString.localeCompare(aString);
      });
    }
    return data.rows;
  }, [data.rows, sortColumn, sortDirection, sortable]);

  const handleSort = (columnIndex: number) => {
    if (!sortable) return;
    
    if (sortColumn === columnIndex) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Sort new column ascending
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  // Get size classes
  const sizeClasses = compact ? 'text-xs' : 'text-sm';
  
  // Cell padding
  const cellPadding = compact ? 'px-2 py-1.5' : 'px-3 py-3';

  return (
    <div 
      className={`border border-gray-200 rounded-md shadow-sm overflow-hidden ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold p-3 bg-gray-50 border-b border-gray-200">
          {title}
        </h3>
      )}
      
      <div className={`overflow-y-auto`} style={{ maxHeight }}>
        <div className="overflow-x-auto min-w-full">
          <table className="w-full border-collapse" role="table">
            <thead>
              <tr className="bg-gray-50 text-left">
                {data.columns.map((column: string, index: number) => (
                  <th 
                    key={`col-${index}`}
                    className={`${cellPadding} font-semibold ${sizeClasses} text-gray-700 sticky top-0 bg-gray-50 shadow-[0_1px_0_0_#e5e7eb] 
                              ${bordered ? 'border-x border-gray-200' : ''}
                              ${sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                    onClick={() => handleSort(index)}
                    role="columnheader"
                    scope="col"
                    aria-sort={sortColumn === index ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <span>{column}</span>
                      {sortable && sortColumn === index && (
                        <span className="ml-1" aria-hidden="true">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row: any[], rowIndex: number) => (
                <tr 
                  key={`row-${rowIndex}`}
                  className={`
                    ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
                    ${hoverable ? 'hover:bg-blue-50' : ''}
                    ${bordered ? 'border-b border-gray-200' : 'border-b border-gray-100'}
                  `}
                  role="row"
                >
                  {row.map((cell: any, cellIndex: number) => (
                    <td 
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className={`${cellPadding} ${sizeClasses} text-gray-800 align-middle
                                 ${bordered && cellIndex !== row.length - 1 ? 'border-r border-gray-200' : ''}
                                 ${bordered && cellIndex === 0 ? 'border-l border-gray-200' : ''}`}
                      role="cell"
                    >
                      {cell !== null && cell !== undefined ? String(cell) : '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {data.rows.length === 0 && (
        <div className="py-8 text-center text-gray-500 italic border-t border-gray-200">
          No data available
        </div>
      )}
    </div>
  );
};

TableView.displayName = 'TableView'; 