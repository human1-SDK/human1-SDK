import { DataSource } from "typeorm";
import { ChatOpenAI } from "@langchain/openai";
import { SqlToolkit } from "langchain/agents/toolkits/sql";
import { SqlDatabase } from "langchain/sql_db";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";

/**
 * @human1-sdk/core
 */

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
        response_format: {type: "json_object"},
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

    const parsed = JSON.parse(langChainResponse.table);

    // Get the first array of objects from the parsed object
    const firstKey = Object.keys(parsed)[0];
    const records = parsed[firstKey];

    // Validate it's an array of objects
    if (!Array.isArray(records) || records.length === 0 || typeof records[0] !== 'object') {
      throw new Error("Unexpected format: expected an array of objects.");
    }

    // Dynamically extract columns and rows
    const columns = Object.keys(records[0]);
    const rows = records.map(record => columns.map(col => record[col]));

    const returnData =  {
      columns,
      rows,
    };

    return returnData;
  }
}

// Export other components as needed
export * from "./types";

// const myClient = new Client({connectionString: process.env.HUMAN1_API_KEY || '', openAiApiKey: process.env.OPENAI_API_KEY ||});

// app.post('/api/ask', async (req, res) => {
//   const { question } = req.body;

//   try {
//     const response = await myClient.someMethod(question);
//     res.json(response);
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred' });
//   }
// })

// const datasource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST, // e.g., 'localhost' or remote IP
//   port: 5432, // default PostgreSQL port
//   username: process.env.PG_USER, // e.g., 'postgres'
//   password: process.env.PG_PW, // your password
//   database: process.env.DB_NAME, // e.g., 'mydatabase'
//   ssl: {
//     rejectUnauthorized: false, // if you're using Supabase or SSL-enabled DB
//   },
// });
