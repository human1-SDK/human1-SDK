// src/index.ts
import 'dotenv/config';
import { Pool } from 'pg';
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';

async function langchainSQL(userQuery: string): Promise<any> {
  const promptTemplate =
    'Translate this sentence to a SQL query. dont show more than 1000 records. avoid sql keywords and Use ONLY these tables:\n\n{table_info}\n\nQuestion: {input}';

  const queryOutputSchema = z.object({
    query: z.string().describe('Syntactically valid SQL query.'),
  });

  const structuredLLM = llm.withStructuredOutput(queryOutputSchema);

  const table_info = await getTableInfo();

  const input = {
    table_info,
    input: userQuery,
  };

  const prompt = promptTemplate
    .replace('{table_info}', input.table_info)
    .replace('{input}', input.input);

  // console.log('prompt', prompt);

  const result = await structuredLLM.invoke(prompt);
  // console.log('Structured SQL:', result.query);

  //Excute the query
  const queryResult = await executeQuery(result.query);

  //Summarize the results
  const summaryPromptTemplate =
    'summarize the data in the {table} in two lines';
  const dataSnippet = JSON.stringify(queryResult, null, 2).slice(0, 1000);
  const summaryPrompt = summaryPromptTemplate.replace('{table}', dataSnippet);
  const resultSummary = await llm.invoke(summaryPrompt);

  const langChainResponse = {
    summary: resultSummary.content,
    table: queryResult,
  };
  console.log(langChainResponse);
  return langChainResponse;
}

const pgpool = new Pool({
  user: process.env.PG_USER,
  host: '13.216.46.170', // or wherever your DB is hosted
  database: 'postgres',
  password: process.env.PG_PW,
  port: 5432, // default PostgreSQL port
});

const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0.5,
  apiKey: process.env.OPENAI_API_KEY,
});

function formatResults(rows: any[]): string {
  return rows
    .map(
      (row) =>
        `Table: ${row.table_name}, Column: ${row.column_name}, Type: ${row.data_type}`
    )
    .join('\n');
}

async function getTableInfo(): Promise<string> {
  const result = await pgpool.query(`
 SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
  `);

  // Group by table name and format as a readable string
  return formatResults(result.rows);
}

async function executeQuery(query: string) {
  try {
    // Execute the query using pgpool.query() method
    const res = await pgpool.query(query);
    // console.log('Query Result:', res.rows); // Print the rows from the query result
    return res.rows; // Return rows if needed
  } catch (err) {
    console.error('Error executing query:', err);
  }
}

langchainSQL(
  'whats the total amount of money spent on a campaign and what the campaign name ordered by amount and name only show those with 4000 or more , hint: there is multiple ads in a single campaign '
);
