import express, { Request, Response, NextFunction } from 'express';
import { executeQuery, getQueryHistory } from '../controllers/queryController';

const router = express.Router();


// Query endpoints
router.post('/query', executeQuery);


router.get('/query/history', getQueryHistory);


// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  // Get the environment and SDK info from app locals
  const sdkInfo = req.app.locals.sdk || { 
    envPath: 'Unknown', 
    serverInfo: { status: 'unknown' } 
  };
  
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    demo_app: true,
    sdk_info: {
      env_path: sdkInfo.envPath,
      server_status: sdkInfo.serverInfo.status
    }
  });
});

export { router as routes }; 