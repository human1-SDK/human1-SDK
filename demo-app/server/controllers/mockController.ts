import { RequestHandler } from 'express';
import { ServerError } from '../types';

export const mockHandler: RequestHandler = (req, res, next) => {
  const { query, type } = req.body;

  try {
    // Handle different response types
    if (type === 'paragraph') {
      // Example paragraph response
      res.locals.databaseQuery = `SELECT paragraph FROM content WHERE topic LIKE '%${query}%'`;
      res.locals.databaseQueryResult = `Here is a sample paragraph response about "${query}". This would typically contain information extracted from your database based on the natural language query. The response can include detailed explanations, summaries, or analysis depending on what was requested.`
    } 
    else if (type === 'table') {
      // Example table response matching TableData interface
      res.locals.databaseQuery = `SELECT * FROM data WHERE category LIKE '%${query}%'`;
      res.locals.databaseQueryResult = {
        columns: ['ID', 'Name', 'Category', 'Value', 'Date'],
        rows: [
          [1, 'Product A', 'Electronics', 299.99, '2023-01-15'],
          [2, 'Product B', 'Clothing', 59.99, '2023-02-20'],
          [3, 'Product C', 'Electronics', 149.99, '2023-03-10'],
          [4, 'Product D', 'Home', 89.99, '2023-04-05']
        ]
      };
    }
    else if (type === 'CSV') {
      // Example CSV response
      res.locals.databaseQuery = `SELECT * FROM data WHERE category LIKE '%${query}%' FORMAT CSV`;
      res.locals.databaseQueryResult = 'ID,Name,Category,Value,Date\n1,Product A,Electronics,299.99,2023-01-15\n2,Product B,Clothing,59.99,2023-02-20\n3,Product C,Electronics,149.99,2023-03-10\n4,Product D,Home,89.99,2023-04-05';
    }
    else {
      // Throw error for invalid type
      const error: ServerError = {
        log: 'Natural language query is not a string',
        status: 400,
        message: { err: `Invalid response type: ${type}. Type must be 'paragraph', 'table', or 'CSV'.` },
      };
      return next(error);
    }
    res.locals.responseType = type;
    next();
  } catch (error) {
      return next(error ? error :  {
        log: 'Natural language query is not a string',
        status: 400,
        message: { err: 'Error in mock handler' },
      });
  }
};


