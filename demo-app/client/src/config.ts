// Configuration variables for the client app
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
 
// Health check configuration
export const HEALTH_CHECK_ENDPOINT = `${API_URL}/health`;
export const HEALTH_CHECK_INTERVAL = 20000; // 20 seconds 