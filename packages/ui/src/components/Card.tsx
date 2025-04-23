import React from 'react';
import { BaseProps } from '../types';

export interface CardProps extends BaseProps {
  children: React.ReactNode;
  elevation?: 'low' | 'medium' | 'high';
}

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'medium',
  className = '',
  style,
}) => {
  const elevationStyles = {
    low: {
      boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    },
    medium: {
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    },
    high: {
      boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    },
  };

  const baseStyle = {
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: 'white',
    ...elevationStyles[elevation],
    ...style,
  };

  return (
    <div 
      className={`human1-card ${className}`} 
      style={baseStyle}
    >
      {children}
    </div>
  );
}; 