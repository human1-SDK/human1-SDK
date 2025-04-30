import React, { useState, useEffect } from 'react';
import { HealthStatus, CHECK_INTERVAL, checkHealth, startHealthMonitoring } from '../../../services/healthCheck';
import { Tooltip } from './Tooltip';

export type { HealthStatus };

export interface HealthIndicatorProps {
  status?: HealthStatus;
  apiUrl?: string;
  checkInterval?: number;
  autoMonitor?: boolean;
}

export const HealthIndicator: React.FC<HealthIndicatorProps> = ({ 
  status: externalStatus, 
  apiUrl,
  checkInterval = CHECK_INTERVAL,
  autoMonitor = false 
}) => {
  const [internalStatus, setInternalStatus] = useState<HealthStatus>(externalStatus || 'unhealthy');
  const [countdown, setCountdown] = useState(checkInterval / 1000);
  
  // Use external status if provided, otherwise use internal status
  const status = externalStatus || internalStatus;

  useEffect(() => {
    // Set up monitoring if autoMonitor is enabled and no external status is provided
    if (autoMonitor && !externalStatus && apiUrl) {
      // Initialize with current status
      checkHealth(apiUrl).then(setInternalStatus);
      
      // Start monitoring
      const cleanup = startHealthMonitoring(setInternalStatus, apiUrl, checkInterval);
      return cleanup;
    }
  }, [autoMonitor, apiUrl, checkInterval, externalStatus]);

  useEffect(() => {
    // Always run the countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => prev <= 1 ? checkInterval / 1000 : prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [checkInterval]);

  const indicatorContent = status === 'healthy' ? (
    <div className="relative w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-sm cursor-help">
      <span className="text-white text-xs font-medium select-none">{countdown}</span>
    </div>
  ) : (
    <div className="relative w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow-sm cursor-help">
      <span className="text-white text-xs font-medium select-none">{countdown}</span>
    </div>
  );

  const tooltipContent = status === 'healthy' ? 'Backend is available' : 'Backend is unavailable';

  return (
    <div className="flex items-center gap-2">
      <Tooltip content={tooltipContent}>
        {indicatorContent}
      </Tooltip>
    </div>
  );
}; 