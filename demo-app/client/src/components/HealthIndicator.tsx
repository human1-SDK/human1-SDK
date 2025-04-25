import React, { useState, useEffect } from 'react';
import { HealthStatus } from '../services/healthCheck';

export type { HealthStatus };

interface HealthIndicatorProps {
  status: HealthStatus;
}

const CHECK_INTERVAL = 20000; // 20 seconds

export const HealthIndicator: React.FC<HealthIndicatorProps> = ({ status }) => {
  const [countdown, setCountdown] = useState(CHECK_INTERVAL / 1000);

  useEffect(() => {
    // Always run the countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => prev <= 1 ? CHECK_INTERVAL / 1000 : prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []); // No dependency on status anymore

  return (
    <div className="flex items-center gap-2">
      <div className="relative group">
        <div 
          className={`relative w-5 h-5 rounded-full ${status === 'healthy' ? 'bg-green-500' : 'bg-red-500'} flex items-center justify-center shadow-sm cursor-help`}
        >
          <span className="text-white text-[10px] font-medium select-none">{countdown}</span>
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {status === 'healthy' ? 'Backend is available' : 'Backend is unavailable'}
        </div>
      </div>
    </div>
  );
}; 