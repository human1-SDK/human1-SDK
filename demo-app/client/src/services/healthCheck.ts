import axios from 'axios';

export type HealthStatus = 'healthy' | 'unhealthy';

const API_URL = 'http://localhost:3001';
const CHECK_INTERVAL = 20000; // 20 seconds

export const checkHealth = async (): Promise<HealthStatus> => {
  try {
    const { status } = await axios.get(`${API_URL}/health`);
    return status === 200 ? 'healthy' : 'unhealthy';
  } catch {
    return 'unhealthy';
  }
};

export const startHealthMonitoring = (onStatusChange: (status: HealthStatus) => void) => {
  const check = () => checkHealth().then(onStatusChange);
  check();
  const intervalId = setInterval(check, CHECK_INTERVAL);
  return () => clearInterval(intervalId);
}; 