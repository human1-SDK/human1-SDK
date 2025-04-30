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

    // Handle columns and rows directly in the result
    if (result.columns && result.rows && Array.isArray(result.columns) && Array.isArray(result.rows)) {
      return {
        type: 'table',
        data: {
          columns: result.columns,
          rows: result.rows
        } as TableData
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

    // Check if the result or result.data contains a JSON string with columns and rows
    if (typeof result === 'string' || (result.data && typeof result.data.text === 'string')) {
      const jsonString = typeof result === 'string' ? result : result.data.text;
      try {
        const parsedData = JSON.parse(jsonString);
        if (parsedData.columns && parsedData.rows && 
            Array.isArray(parsedData.columns) && Array.isArray(parsedData.rows)) {
          return {
            type: 'table',
            data: {
              columns: parsedData.columns,
              rows: parsedData.rows
            } as TableData
          };
        }
      } catch (e) {
        // Not valid JSON or doesn't have the expected structure, continue to other checks
      }
    }

    // Handle paragraphs/text
    if (typeof result.text === 'string') {
      // Try to parse the text as JSON to check if it's a table structure
      try {
        const parsedData = JSON.parse(result.text);
        if (parsedData.columns && parsedData.rows && 
            Array.isArray(parsedData.columns) && Array.isArray(parsedData.rows)) {
          return {
            type: 'table',
            data: {
              columns: parsedData.columns,
              rows: parsedData.rows
            } as TableData
          };
        }
      } catch (e) {
        // Not valid JSON, treat as plain text
        return {
          type: 'paragraph',
          data: {
            text: result.text
          } as ParagraphData
        };
      }

      return {
        type: 'paragraph',
        data: {
          text: result.text
        } as ParagraphData
      };
    }

    // If the structure doesn't match expected formats, try to intelligently handle it
    if (result.data) {
      // Check if data is a string that might be a JSON representation of a table
      if (typeof result.data === 'string') {
        try {
          const parsed = JSON.parse(result.data);
          if (parsed.columns && parsed.rows && 
              Array.isArray(parsed.columns) && Array.isArray(parsed.rows)) {
            return {
              type: 'table',
              data: {
                columns: parsed.columns,
                rows: parsed.rows
              } as TableData
            };
          }
        } catch (e) {
          // Not valid JSON, continue to other checks
        }
      }

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
          : `${JSON.stringify(result, null, 2)}`
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