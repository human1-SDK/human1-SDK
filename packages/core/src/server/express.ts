import { Express, Request, Response } from 'express';
import { RouteDefinition } from './routes';
import { RequestData } from './controllers/queryController';

/**
 * Extends the Express application with a method to mount SDK routes
 */
declare global {
  namespace Express {
    interface Application {
      /**
       * Mount SDK routes to the Express application
       * @param path Base path for all SDK routes
       * @param routes SDK route definitions
       */
      useSdk(path: string, routes: RouteDefinition[]): void;
    }
  }
}

/**
 * Adds the useSdk method to Express applications
 * 
 * @param app Express application instance
 */
export function extendExpressWithSdk(app: Express): void {
  // Skip if app is null or undefined
  if (!app) {
    console.log('Warning: Cannot extend null/undefined Express app');
    return;
  }
  
  // Skip if already extended
  if (typeof app.useSdk === 'function') {
    return; // Already extended
  }
  
  app.useSdk = function(path: string, routes: RouteDefinition[]): void {
    console.log(`Mounting SDK routes at ${path}:`);
    
    // Normalize the path to ensure it has a leading slash but no trailing slash
    const basePath = path === '/' ? '' : path.endsWith('/') ? path.slice(0, -1) : path;
    
    routes.forEach(route => {
      const fullPath = `${basePath}${route.path}`;
      console.log(`- ${route.method} ${fullPath}: ${route.description}`);
      
      switch(route.method) {
        case 'GET':
          app.get(fullPath, (req: Request, res: Response) => {
            const result = route.handler();
            res.status(result.status).json(result.data);
          });
          break;
        case 'POST':
          app.post(fullPath, async (req: Request, res: Response) => {
            const requestData: RequestData = { 
              ...req.body,
              ...req.query
            };
            const result = await route.handler(requestData);
            res.status(result.status).json(result.data);
          });
          break;
        // Add other methods as needed
      }
    });
  };
}

/**
 * Mount SDK routes to an Express application
 * 
 * @param app Express application instance
 * @param routes SDK route definitions 
 * @param path Base path for the routes (default: '/api')
 */
export function mountSdkRoutes(app: Express, routes: RouteDefinition[], path: string = '/api'): void {
  extendExpressWithSdk(app);
  app.useSdk(path, routes);
} 