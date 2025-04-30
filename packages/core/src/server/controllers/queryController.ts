import { Client, logQueryMessage, GREETING_MESSAGE } from '../../index';
import * as dotenv from 'dotenv';

dotenv.config();

// Generic request and response interfaces to replace Express dependencies
export interface RequestData {
  query?: string;
  responseFormat?: "table" | "paragraph";
  [key: string]: any;
}

export interface ResponseData {
  status: number;
  data: any;
}

// Handler type without Express dependency
export type QueryHandler = (requestData: RequestData) => Promise<ResponseData>;

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
export const executeQuery: QueryHandler = async (requestData) => {
  try {
    const { query, responseFormat } = requestData;
    console.log('Request data:', requestData);
    
    if (!query) {
      return {
        status: 400,
        data: { error: 'Query is required' }
      };
    }
    
    // Use our new logQueryMessage function from the core package
    console.log('\n----- PROCESSING QUERY -----');
    const logMessage = logQueryMessage(query);
    console.log('--------------------------\n');
    
    // Use Human1 SDK to process the query
    // Note: Implement actual query processing using the SDK's methods
    // This is a placeholder implementation
    // const result = { 
    //   message: 'Query processed successfully',
    //   data: `Result for: ${query}`,
    //   logMessage,
    //   // In a real implementation, you'd call human1Client methods here
    // };
    
    const result = await human1Client.langchainSQL(query, responseFormat);
    console.log('langchainSQL result', result);

    // Store in history
    queryHistory.push({
      query,
      result,
      timestamp: new Date(),
    });

    return {
      status: 200,
      data: result
    };
  } catch (error) {
    console.error('Error executing query:', error);
    return {
      status: 500,
      data: {
        error: 'Failed to process query',
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    };
  }
};

// Get query history
export const getQueryHistory = (): ResponseData => {
  try {
    return {
      status: 200,
      data: queryHistory
    };
  } catch (error) {
    console.error('Error retrieving query history:', error);
    return {
      status: 500,
      data: {
        error: 'Failed to retrieve query history',
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    };
  }
};
