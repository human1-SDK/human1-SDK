import React from 'react';
import { TableViewProps } from '../../types';

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
  if (!data || !data.columns || !data.rows) {
    return (
      <div className={`human1-table-error ${className}`}>
        Invalid table data provided
      </div>
    );
  }

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
            {data.columns.map((column, index) => (
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
          {data.rows.map((row, rowIndex) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}; 