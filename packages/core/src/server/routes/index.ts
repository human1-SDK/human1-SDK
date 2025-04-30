import { executeQuery, getQueryHistory } from '../controllers/queryController';

/**
 * Route definition without Express dependencies
 */
export interface RouteDefinition {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  handler: Function;
  description: string;
}

/**
 * Available routes in the Human1 SDK
 */
export const routes: RouteDefinition[] = [
  {
    path: '/hello',
    method: 'GET',
    handler: () => ({ status: 200, data: { message: 'Hello from Human1 SDK!' } }),
    description: 'Example route that returns a greeting message'
  },
  {
    path: '/query',
    method: 'POST',
    handler: executeQuery,
    description: 'Process a natural language query'
  },
  {
    path: '/query/history',
    method: 'GET',
    handler: getQueryHistory,
    description: 'Get the history of queries processed'
  }
];

/**
 * Get route handler by path and method
 */
export function getRouteHandler(path: string, method: string): Function | null {
  const route = routes.find(r => 
    r.path === path && 
    r.method === method.toUpperCase()
  );
  
  return route ? route.handler : null;
} 