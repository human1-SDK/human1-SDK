import { ResponseData, TableData, ParagraphData, ErrorData } from '../types';

/**
 * Formats raw query results into the appropriate ResponseData format
 * @param result - The raw result data from the API
 * @returns Formatted ResponseData object
 */
export const formatQueryResponse = (result: any): ResponseData => {
  try {
    // Handle error responses
    if (result.error) {
      return {
        type: 'error',
        data: {
          message: result.error.message || 'An error occurred with your query',
          query: result.error.query,
          suggestions: result.error.suggestions || [],
        } as ErrorData
      };
    }

    // Handle table data
    if (result.data && Array.isArray(result.columns) && Array.isArray(result.rows)) {
      return {
        type: 'table',
        data: {
          columns: result.columns,
          rows: result.rows
        } as TableData
      };
    }

    // Handle paragraphs/text
    if (typeof result.text === 'string') {
      return {
        type: 'paragraph',
        data: {
          text: result.text
        } as ParagraphData
      };
    }

    // If the structure doesn't match expected formats, try to intelligently handle it
    if (result.data) {
      // If data is an object with keys, convert to a table
      if (typeof result.data === 'object' && !Array.isArray(result.data)) {
        const columns = Object.keys(result.data);
        const rows = [columns.map(key => result.data[key])];
        return {
          type: 'table',
          data: { columns, rows } as TableData
        };
      }

      // If data is an array of objects, convert to a table
      if (Array.isArray(result.data) && result.data.length > 0 && typeof result.data[0] === 'object') {
        const columns = Object.keys(result.data[0]);
        const rows = result.data.map((item: Record<string, any>) => columns.map(key => item[key]));
        return {
          type: 'table',
          data: { columns, rows } as TableData
        };
      }
    }

    // Fallback to displaying as text
    return {
      type: 'paragraph',
      data: {
        text: typeof result === 'string' 
          ? result 
          : `Query completed successfully. ${JSON.stringify(result, null, 2)}`
      } as ParagraphData
    };
  } catch (error) {
    // When all else fails, return an error
    return {
      type: 'error',
      data: {
        message: 'Failed to parse query results',
        suggestions: ['Try simplifying your query', 'Contact support if this issue persists']
      } as ErrorData
    };
  }
}; 