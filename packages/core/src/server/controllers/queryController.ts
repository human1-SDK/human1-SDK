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
    
    try {
      // Get result from Human1 client
      const result = await human1Client.langchainSQL(query, responseFormat);
      console.log('langchainSQL result', result);

      // Handle the result appropriately based on its format
      if (responseFormat === 'paragraph') {
        // For paragraph format, the result should already have the text property
        // from the improved langchainSQL function
        if (result && typeof result.text === 'string') {
          const formattedResult = {
            text: result.text
          };
          
          // Store in history
          queryHistory.push({
            query,
            result: formattedResult,
            timestamp: new Date(),
          });
          
          return {
            status: 200,
            data: formattedResult
          };
        }
      }
      
      // No special formatting needed for table format or if the paragraph
      // formatting was already handled in langchainSQL
      
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
      console.error('Error executing langchainSQL:', error);
      
      // Create appropriate error response based on format
      if (responseFormat === 'paragraph') {
        return {
          status: 500,
          data: {
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }
        };
      } else {
        return {
          status: 500,
          data: {
            columns: ['Error'],
            rows: [[`${error instanceof Error ? error.message : String(error)}`]]
          }
        };
      }
    }
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
