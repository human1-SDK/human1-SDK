import { RequestHandler, Request } from 'express';
import { Client } from '@human1-sdk/core';
// import 'dotenv/config';
import * as dotenv from 'dotenv';
dotenv.config();
// Store query history in memory (in a real app, you'd use a database)
const queryHistory: Array<{ query: string; result: any; timestamp: Date }> = [];
console.log('env', process.env.PG_PW);
console.log('env', process.env.PG_USER);

// Initialize Human1 client
const human1Client = new Client({
  openAiKey: process.env.OPENAI_API_KEY as string,
  db: {
    type: 'postgres',
    host: process.env.DB_HOST as string,
    port: 5432, // defaults to 5432 for PostgreSQL
    username: process.env.PG_USER as string,
    password: process.env.PG_PW as string,
    database: process.env.DB_NAME as string,
    ssl: {
      rejectUnauthorized: false, // if you're using Supabase or SSL-enabled DB
    },
  },
});

// Execute a natural language query
export const executeQuery: RequestHandler = async (
  req: Request<any, any, { query: string }>,
  res
) => {
  try {
    const { query } = req.body;
    console.log("body", req.body);
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
    }
    const result = await human1Client.langchainSQL(query);

    // Store in history
    queryHistory.push({
      query,
      result,
      timestamp: new Date(),
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({
      error: 'Failed to process query',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get query history
export const getQueryHistory = (req: any, res: any) => {
  try {
    return res.status(200).json(queryHistory);
  } catch (error) {
    console.error('Error retrieving query history:', error);
    return res.status(500).json({
      error: 'Failed to retrieve query history',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
