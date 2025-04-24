import { Request, RequestHandler } from 'express';
import { ServerError } from '../types';

export const parseNaturalLanguageQuery: RequestHandler = async (
  req: Request<unknown, unknown, Record<string, unknown>>,
  res,
  next
) => {
  if (!req.body.naturalLanguageQuery) {
    const error: ServerError = {
      log: 'Natural language query not provided',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    };
    return next(error);
  }

  const { naturalLanguageQuery } = req.body;

  if (typeof naturalLanguageQuery !== 'string') {
    const error: ServerError = {
      log: 'Natural language query is not a string',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    };
    return next(error);
  }

  res.locals.naturalLanguageQuery = naturalLanguageQuery;
  return next();
};
