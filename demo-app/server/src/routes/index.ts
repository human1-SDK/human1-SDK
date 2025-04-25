import express from 'express';
import { executeQuery, getQueryHistory } from '../controllers/queryController';

const router = express.Router();

// Example route that returns a message
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// Query endpoints
// @ts-ignore - Express 5 typing issues
router.post('/query', executeQuery);
// @ts-ignore - Express 5 typing issues
router.get('/query/history', getQueryHistory);

export { router as routes }; 