import axios from 'axios';

export type HealthStatus = 'healthy' | 'unhealthy';

export const CHECK_INTERVAL = 20000; // 20 seconds

export const checkHealth = async (apiUrl: string): Promise<HealthStatus> => {
  if (!apiUrl) {
    console.error('API URL is required for health check');
    return 'unhealthy';
  }
  
  try {
    const { status } = await axios.get(`${apiUrl}/health`);
    return status === 200 ? 'healthy' : 'unhealthy';
  } catch {
    return 'unhealthy';
  }
};

export const startHealthMonitoring = (
  onStatusChange: (status: HealthStatus) => void,
  apiUrl: string,
  interval = CHECK_INTERVAL
) => {
  if (!apiUrl) {
    console.error('API URL is required for health monitoring');
    onStatusChange('unhealthy');
    return () => {}; // Return empty cleanup function
  }
  
  const check = () => checkHealth(apiUrl).then(onStatusChange);
  check();
  const intervalId = setInterval(check, interval);
  return () => clearInterval(intervalId);
}; 