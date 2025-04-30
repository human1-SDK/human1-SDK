import React from 'react';
import { TableViewProps, TableData } from '../../types';

/**
 * TableView Component
 * 
 * Displays structured data in a table format
 */
export const TableView: React.FC<TableViewProps> = ({
  data,
  maxHeight = '400px',
  className = '',
  style,
}) => {
  // If there's no data at all
  if (!data) {
    return (
      <div className={`human1-table-error ${className}`}>
        No data available
      </div>
    );
  }

  // Check if the data has text property (which is not part of TableData interface)
  // This is a runtime check for compatibility with different response formats
  if ('text' in data && (!('columns' in data) || !('rows' in data))) {
    return (
      <div className={`human1-table-text ${className}`} style={{ whiteSpace: 'pre-wrap' }}>
        {typeof (data as any).text === 'string' 
          ? (data as any).text 
          : JSON.stringify((data as any).text, null, 2)}
      </div>
    );
  }

  // If there are no columns or rows
  if (!data.columns || !data.rows) {
    // Try to convert object to columns/rows if possible
    if (typeof data === 'object' && !Array.isArray(data)) {
      const dataObj = data as Record<string, any>;
      const columns = Object.keys(dataObj);
      
      // Filter out function properties and internal properties
      const validColumns = columns.filter(col => 
        typeof dataObj[col] !== 'function' && 
        !col.startsWith('_') && 
        col !== 'columns' && 
        col !== 'rows'
      );
      
      if (validColumns.length > 0) {
        const rows = [validColumns.map(col => 
          dataObj[col] === null || dataObj[col] === undefined 
            ? '—' 
            : (typeof dataObj[col] === 'object' 
                ? JSON.stringify(dataObj[col]) 
                : String(dataObj[col])
              )
        )];
        
        return renderTable(validColumns, rows);
      }
    }
    
    return (
      <div className={`human1-table-error ${className}`}>
        Invalid table data provided
      </div>
    );
  }

  return renderTable(data.columns, data.rows);
  
  // Helper function to render the actual table
  function renderTable(columns: string[], rows: any[][]) {
    return (
      <div 
        className={`human1-table-container ${className}`}
        style={{ 
          maxHeight,
          overflowY: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          ...style
        }}
      >
        <table 
          className="human1-table"
          style={{ 
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              {columns.map((column, index) => (
                <th 
                  key={`col-${index}`}
                  style={{ 
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 1px 0 0 #e0e0e0',
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length}
                  style={{ 
                    padding: '16px', 
                    textAlign: 'center',
                    color: '#666'
                  }}
                >
                  No data available
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr 
                  key={`row-${rowIndex}`}
                  style={{ 
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: rowIndex % 2 === 0 ? 'white' : '#fafafa',
                  }}
                >
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={`cell-${rowIndex}-${cellIndex}`}
                      style={{ padding: '8px 16px' }}
                    >
                      {cell !== null && cell !== undefined ? String(cell) : '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
}; 