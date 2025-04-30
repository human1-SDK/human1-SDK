import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { routes } from './routes';
import { executeQuery } from './controllers/queryController';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// app.post('/api/query', (req, res, next) => {
//   console.log("middleware here")
//   console.log('Received query:', req.body.query);
//   return next();
// }, 
// // (req, res, next) => {
// //   res.send('Query received!');
// // },)
// executeQuery);

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 