import { DataSource } from "typeorm";
import { ChatOpenAI } from "@langchain/openai";
import { SqlToolkit } from "langchain/agents/toolkits/sql";
import { SqlDatabase } from "langchain/sql_db";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";

// Export SDK module's exports
export * from "./sdk";
import sdk from "./sdk";
export default sdk;

/**
 * @human1-sdk/core
 */

// Configurable message that can be changed to see the effect
export const GREETING_MESSAGE = "Hello from Human1 Core with HMR!!#$$$$#";

/**
 * Outputs a greeting message to the console with the query
 * @param query The user's query
 * @returns The formatted greeting message
 */
export function logQueryMessage(query: string): string {
  const message = `${GREETING_MESSAGE} Processing query: "${query}"`;
  console.log(message);
  return message;
}

export class Client {
  private openAiKey: string;
  private dataSource: DataSource;
  private llm: ChatOpenAI;

  constructor(options: {
    openAiKey: string;
    db: {
      type: "postgres";
      host: string;
      port: number; // defaults to 5432 for PostgreSQL
      username: string;
      password: string;
      database: string;
      ssl?: {
        rejectUnauthorized?: false; // if you're using Supabase or SSL-enabled DB
      };
    };
  }) {
    this.openAiKey = options.openAiKey;

    this.dataSource = new DataSource({
      type: options.db.type,
      host: options.db.host,
      port: options.db.port,
      username: options.db.username,
      password: options.db.password,
      database: options.db.database,
      // ssl:
      //   options.db.ssl && "rejectUnauthorized" in options.db.ssl
      //     ? options.db.ssl
      //     : { rejectUnauthorized: false },
    });

    this.llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.5,
      apiKey: this.openAiKey,
      modelKwargs: {
        response_format: { type: "json_object" }, // NAT CHANGES
      },
    });
  }

  private formatSQLResultForSummary(
    sqlResult: Record<string, any>[],
    maxRows?: number
  ): string {
    const rows = sqlResult.slice(0, maxRows ? maxRows : sqlResult.length);

    return rows
      .map((row) =>
        Object.entries(row)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ")
      )
      .join("\n");
  }

  private buildSummaryChain(isSingleRow: boolean) {
    const prompt = ChatPromptTemplate.fromTemplate(
      isSingleRow
        ? `The user asked: "{userQuery}"\n` +
            `Here is the SQL result:\n{compactResult}\n\n` +
            `Write a short paragraph summarizing the results.`
        : `The user asked: "{userQuery}"\n` +
            `Here are the results:\n{compactResult}\n\n` +
            `Summarize the results, use bullet points if necessary.`
    );

    return RunnableSequence.from([prompt, this.llm]);
  }

  private async summarizeResult(
    userQuery: string,
    sqlOutput: Record<string, any>[]
  ): Promise<string> {
    const isSingleRow = sqlOutput.length === 1;
    const compactResult = this.formatSQLResultForSummary(sqlOutput);

    const summaryChain = this.buildSummaryChain(isSingleRow);
    const resultSummary = await summaryChain.invoke({
      userQuery,
      compactResult,
    });

    return typeof resultSummary.content === "string"
      ? resultSummary.content
      : JSON.stringify(resultSummary.content);
  }

  async langchainSQL(
    userQuery: string,
    responseFormat?: "table" | "paragraph"
  ): Promise<any> {
    // const promptTemplate =
    //   'Translate this sentence to a SQL query. dont show more than 1000 records. avoid sql keywords and Use ONLY these tables:\n\n{table_info}\n\nQuestion: {input}';
    const prompt = await pull<ChatPromptTemplate>(
      "hwchase17/openai-tools-agent"
    );

    const customPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful assistant. Respond only with JSON format only",
      ],
      ...prompt.promptMessages,
    ]);

    //Langchain-SQL Connection <<<
    // Create a LangChain SqlDatabase from TypeORM DataSource
    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: this.dataSource,
    });
    // Create the SQL Toolkit
    const toolkit = new SqlToolkit(db, this.llm);

    // Create the agent using the new method
    const agent = await createOpenAIToolsAgent({
      llm: this.llm,
      tools: toolkit.tools,
      prompt: customPrompt,
    });

    // Create the agent executor
    const executor = new AgentExecutor({
      agent,
      tools: toolkit.tools,
      verbose: false,
    });

    // Use the executor to process an input
    const res = await executor.invoke({
      input: userQuery,
    });
    console.log("langchain stuff here ->>", res.output);
    // console.log('res  here ->>', res);

    const langChainResponse = {
      // summary: resultSummary.content,
      table: res.output,
    };

    let parsed = parseIfJSON(langChainResponse.table);

    parsed = Array.isArray(parsed) ? parsed : [parsed];
    
    if (responseFormat === "table") {
      console.log("in responseFormat table");
      // Get the first array of objects from the parsed object
      const firstKey = Object.keys(parsed)[0];
      const records = parsed[firstKey];

      // Validate it's an array of objects
      if (
        !Array.isArray(records) ||
        records.length === 0 ||
        typeof records[0] !== "object"
      ) {
        throw new Error("Unexpected format: expected an array of objects.");
      }

      // Dynamically extract columns and rows
      const columns = Object.keys(records[0]);
      const rows = records.map((record) => columns.map((col) => record[col]));

      return {
        columns,
        rows,
      };
    } else if (responseFormat === "paragraph") {
      //TODO: Include maxRows????
      console.log("in responseFormat paragraph");
      return await this.summarizeResult(
        userQuery,
        parsed as Record<string, any>[]
      );
    }
  }
}

// Export other components as needed
export * from "./types";
export * from "./server";
export * from "./utils";

const parseIfJSON = (input: any) => {
  try {
    return JSON.parse(input);
  } catch (e) {
    return input;
  }
};

// async langchainSQL(userQuery: string, responseFormat?: "table" | "paragraph"): Promise<any> {
//   try {
//     // const promptTemplate =
//     //   'Translate this sentence to a SQL query. dont show more than 1000 records. avoid sql keywords and Use ONLY these tables:\n\n{table_info}\n\nQuestion: {input}';
//     const prompt = await pull<ChatPromptTemplate>(
//       "hwchase17/openai-tools-agent"
//     );

//     const customPrompt = ChatPromptTemplate.fromMessages([
//       [
//         "system",
//         "You are a helpful assistant. Respond only with JSON format only",
//       ],
//       ...prompt.promptMessages,
//     ]);

//     //Langchain-SQL Connection <<<
//     // Create a LangChain SqlDatabase from TypeORM DataSource
//     const db = await SqlDatabase.fromDataSourceParams({
//       appDataSource: this.dataSource,
//     });
//     // Create the SQL Toolkit
//     const toolkit = new SqlToolkit(db, this.llm);

//     // Create the agent using the new method
//     const agent = await createOpenAIToolsAgent({
//       llm: this.llm,
//       tools: toolkit.tools,
//       prompt: customPrompt,
//     });

//     // Create the agent executor
//     const executor = new AgentExecutor({
//       agent,
//       tools: toolkit.tools,
//       verbose: false,
//     });

//     // Use the executor to process an input
//     const res = await executor.invoke({
//       input: userQuery,
//     });

//     console.log('langChain response:', res.output);

//     const langChainResponse = {
//       table: res.output,
//     };

//     // Try to parse the result as JSON
//     try {
//       const parsed = JSON.parse(langChainResponse.table);

//       // Get the first array of objects from the parsed object
//       const firstKey = Object.keys(parsed)[0];

//       // Check if there's no firstKey or it doesn't exist in the parsed object
//       if (!firstKey || !parsed[firstKey]) {
//         if (responseFormat === "paragraph") {
//           return {
//             text: JSON.stringify(parsed, null, 2)
//           };
//         } else {
//           // For table format, return the full result as columns/rows if possible
//           if (typeof parsed === 'object' && !Array.isArray(parsed)) {
//             const columns = Object.keys(parsed);
//             const rows = [columns.map(col => parsed[col])];
//             return { columns, rows };
//           } else {
//             return {
//               text: JSON.stringify(parsed, null, 2)
//             };
//           }
//         }
//       }

//       const records = parsed[firstKey];

//       // Validate it's an array of objects
//       if (!Array.isArray(records)) {
//         // If not an array but we're in paragraph mode, return as text
//         if (responseFormat === "paragraph") {
//           return {
//             text: JSON.stringify(parsed, null, 2)
//           };
//         }

//         // Try to convert non-array to a table format if possible
//         if (typeof records === 'object') {
//           const columns = Object.keys(records);
//           const rows = [columns.map(col => records[col])];
//           return { columns, rows };
//         }

//         // Fallback to returning as text
//         return {
//           text: JSON.stringify(parsed, null, 2)
//         };
//       }

//       // If array is empty or first item isn't an object
//       if (records.length === 0 || typeof records[0] !== 'object') {
//         if (responseFormat === "paragraph") {
//           return {
//             text: JSON.stringify(parsed, null, 2)
//           };
//         }

//         // If it's an array of primitive values, create a simple table
//         if (records.length > 0) {
//           return {
//             columns: ["Value"],
//             rows: records.map(value => [value])
//           };
//         }

//         // Empty array, return empty table
//         return {
//           columns: [],
//           rows: []
//         };
//       }

//       // Dynamically extract columns and rows
//       const columns = Object.keys(records[0]);
//       const rows = records.map(record => columns.map(col => record[col]));

//       // Format output based on responseFormat
//       if (responseFormat === "paragraph") {
//         return {
//           text: JSON.stringify({ columns, rows }, null, 2)
//         };
//       }

//       return {
//         columns,
//         rows,
//       };
//     } catch (parseError) {
//       console.error("Failed to parse JSON response:", parseError);

//       // If we couldn't parse as JSON, return as text
//       if (responseFormat === "paragraph") {
//         return {
//           text: langChainResponse.table
//         };
//       }

//       // For table format, create a fallback table with the error
//       return {
//         columns: ["Message"],
//         rows: [[`Failed to parse result: ${langChainResponse.table.substring(0, 100)}...`]]
//       };
//     }
//   } catch (error) {
//     console.error("Error in langchainSQL:", error);

//     // Return appropriate error format based on responseFormat
//     if (responseFormat === "paragraph") {
//       return {
//         text: `Error: ${error instanceof Error ? error.message : String(error)}`
//       };
//     }

//     // Return error in table format
//     return {
//       columns: ["Error"],
//       rows: [[`${error instanceof Error ? error.message : String(error)}`]]
//     };
//   }
// }
