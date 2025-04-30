import { DataSource } from "typeorm";
import { ChatOpenAI } from "@langchain/openai";
import { SqlToolkit } from "langchain/agents/toolkits/sql";
import { SqlDatabase } from "langchain/sql_db";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";

// Export SDK module's exports
export * from './sdk';
import sdk from './sdk';
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
        response_format: "json_object",
      },
    });
  }

  async langchainSQL(userQuery: string, responseFormat?: "table" | "paragraph"): Promise<any> {
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
    // console.log('langchain stuff here ->>', res.output);
    // console.log('res  here ->>', res);

    const langChainResponse = {
      // summary: resultSummary.content,
      table: res.output,
    };

    console.log(langChainResponse.table);

    return langChainResponse;
  }
}

// Export other components as needed
export * from "./types";
export * from "./server";
export * from "./utils";
