import { RequestHandler } from 'express';
import { ServerError } from '../types';
import pkg from 'pg';
const { Pool } = pkg;

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.SUPABASE_URI, // Your database URI from .env
});

export const queryStarWarsDatabase: RequestHandler = async (
  _req,
  res,
  next
) => {
  const { databaseQuery } = res.locals;
  if (!databaseQuery) {
    const error: ServerError = {
      log: 'Database query middleware did not receive a query',
      status: 500,
      message: { err: 'An error occurred before querying the database' },
    };
    return next(error);
  }

  try {
    // Execute the query using the pool
    const result = await pool.query(databaseQuery);
    res.locals.databaseQueryResult = result.rows; // Store the query result in res.locals
    return next();
  } catch (err) {
    const error: ServerError = {
      log: `Database query failed: ${(err as Error).message}`,
      status: 500,
      message: { err: 'An error occurred while querying the database' },
    };
    return next(error);
  }
};





 