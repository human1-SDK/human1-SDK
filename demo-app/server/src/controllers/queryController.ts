import express from 'express';
import { Client } from '@human1-sdk/core';

// Store query history in memory (in a real app, you'd use a database)
const queryHistory: Array<{ query: string, result: any, timestamp: Date }> = [];

// Initialize Human1 client
const human1Client = new Client({
  apiKey: process.env.HUMAN1_API_KEY || '',
});

// Execute a natural language query
export const executeQuery = async (req: any, res: any) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }
    
    // Use Human1 SDK to process the query
    // Note: Implement actual query processing using the SDK's methods
    // This is a placeholder implementation
    const result = { 
      message: 'Query processed successfully',
      data: `Result for: ${query}`,
      // In a real implementation, you'd call human1Client methods here
    };
    
    // Store in history
    queryHistory.push({
      query,
      result,
      timestamp: new Date()
    });
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error executing query:', error);
    return res.status(500).json({ 
      error: 'Failed to process query',
      message: error instanceof Error ? error.message : 'Unknown error'
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
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 