// Import the SDK controllers directly from the server module
import { executeQuery as sdkExecuteQuery, getQueryHistory as sdkGetQueryHistory, RequestData } from '@human1-sdk/core/dist/server';
import { RequestHandler } from 'express';

// Adapter to convert QueryHandler to Express middleware
export const executeQuery: RequestHandler = async (req, res, next) => {
  try {
    const requestData: RequestData = {
      ...req.body,
      ...req.query
    };
    const result = await sdkExecuteQuery(requestData);
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
};

// Demo-app specific implementation of history
// This could be extended with app-specific features like filtering, pagination, etc.
export const getQueryHistory: RequestHandler = (req, res, next) => {
  try {
    const result = sdkGetQueryHistory();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};