import React from 'react';
import { BaseProps } from '../types';

export interface ButtonProps extends BaseProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
  style,
}) => {
  const baseStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.7 : 1,
    ...style,
  };

  // Add variant-specific styles here
  const variantStyles = {
    primary: {
      backgroundColor: '#3498db',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#2ecc71',
      color: 'white',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#3498db',
      border: '1px solid #3498db',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variantStyles[variant] }}
      className={`human1-button ${className}`}
    >
      {children}
    </button>
  );
}; 