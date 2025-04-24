import { RequestHandler } from 'express';
import { ServerError } from '../types';
import OpenAI from "openai/index.mjs";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new OpenAI({apiKey: process.env.OPEN_AI_KEY});

export const queryOpenAI: RequestHandler = async (_req, res, next) => {
  const { naturalLanguageQuery } = res.locals;
  if (!naturalLanguageQuery) {
    const error: ServerError = {
      log: 'OpenAI query middleware did not receive a query',
      status: 500,
      message: { err: 'An error occurred before querying OpenAI' },
    };
    return next(error);
  }

  // const response = await client.chat.completions.create({
  //   model: "gpt-4o",
  //   messages: [{ role: "system", content: "You're a backend database software engineer that needs to take a human language prompt and generate a SQL query. You will be querying a postgreSQL databse containaing data about star wars. " }, { role: "user", content: "Write a one-sentence bedtime story about a unicorn." }],
  //   max_tokens: 50,
  // });

const schemaContent = `
  CREATE TABLE public.people (
    "_id" serial NOT NULL,
    "name" varchar NOT NULL,
    "mass" varchar,
    "hair_color" varchar,
    "skin_color" varchar,
    "eye_color" varchar,
    "birth_year" varchar,
    "gender" varchar,
    "species_id" bigint,
    "homeworld_id" bigint,
    "height" integer,
    CONSTRAINT "people_pk" PRIMARY KEY ("_id")
  ) WITH (
    OIDS=FALSE
  );



  CREATE TABLE  public.films (
    "_id" serial NOT NULL,
    "title" varchar NOT NULL,
    "episode_id" integer NOT NULL,
    "opening_crawl" varchar NOT NULL,
    "director" varchar NOT NULL,
    "producer" varchar NOT NULL,
    "release_date" DATE NOT NULL,
    CONSTRAINT "films_pk" PRIMARY KEY ("_id")
  ) WITH (
    OIDS=FALSE
  );



  CREATE TABLE  public.people_in_films (
    "_id" serial NOT NULL,
    "person_id" bigint NOT NULL,
    "film_id" bigint NOT NULL,
    CONSTRAINT "people_in_films_pk" PRIMARY KEY ("_id")
  ) WITH (
    OIDS=FALSE
  );



  CREATE TABLE  public.planets (
    "_id" serial NOT NULL,
    "name" varchar,
    "rotation_period" integer,
    "orbital_period" integer,
    "diameter" integer,
    "climate" varchar,
    "gravity" varchar,
    "terrain" varchar,
    "surface_water" varchar,
    "population" bigint,
    CONSTRAINT "planets_pk" PRIMARY KEY ("_id")
  ) WITH (
    OIDS=FALSE
  );



  CREATE TABLE  public.species (
    "_id" serial NOT NULL,
    "name" varchar NOT NULL,
    "classification" varchar,
    "average_height" varchar,
    "average_lifespan" varchar,
    "hair_colors" varchar,
    "skin_colors" varchar,
    "eye_colors" varchar,
    "language" varchar,
    "homeworld_id" bigint,
    CONSTRAINT "species_pk" PRIMARY KEY ("_id")
  ) WITH (
    OIDS=FALSE
  );



  CREATE TABLE  public.vessels (
    "_id" serial NOT NULL,
    "name" varchar NOT NULL,
    "manufacturer" varchar,
    "model" varchar,
    "vessel_type" varchar NOT NULL,
    "vessel_class" varchar NOT NULL,
    "cost_in_credits" bigint,
    "length" varchar,
    "max_atmosphering_speed" varchar,
    "crew" integer,
    "passengers" integer,
    "cargo_capacity" varchar,
    "consumables" varchar,
    CONSTRAINT "vessels_pk" PRIMARY KEY ("_id")
  ) WITH (
    OIDS=FALSE
  );



  CREATE TABLE  public.species_in_films (
    "_id" serial NOT NULL,
    "film_id" bigint NOT NULL,
    "species_id" bigint NOT NULL,
    CONSTRAINT "species_in_films_pk" PRIMARY KEY ("_id")
  ) WITH (
    OIDS=FALSE
  );



  CREATE TABLE  public.planets_in_films (
    "_id" serial NOT NULL,
    "film_id" bigint NOT NULL,
    "planet_id" bigint NOT NULL,
    CONSTRAINT "planets_in_films_pk" PRIMARY KEY ("_id")
  ) WITH (
    OIDS=FALSE
  );



  CREATE TABLE  public.pilots (
    "_id" serial NOT NULL,
    "person_id" bigint NOT NULL,
    "vessel_id" bigint NOT NULL,
    CONSTRAINT "pilots_pk" PRIMARY KEY ("_id")
  ) WITH (
    OIDS=FALSE
  );



  CREATE TABLE  public.vessels_in_films (
    "_id" serial NOT NULL,
    "vessel_id" bigint NOT NULL,
    "film_id" bigint NOT NULL,
    CONSTRAINT "vessels_in_films_pk" PRIMARY KEY ("_id")
  ) WITH (
    OIDS=FALSE
  );



  CREATE TABLE  public.starship_specs (
    "_id" serial NOT NULL,
    "hyperdrive_rating" varchar,
    "MGLT" varchar,
    "vessel_id" bigint NOT NULL,
    CONSTRAINT "starship_specs_pk" PRIMARY KEY ("_id")
  ) WITH (
    OIDS=FALSE
  );



  ALTER TABLE public.people ADD CONSTRAINT "people_fk0" FOREIGN KEY ("species_id") REFERENCES  public.species("_id");
  ALTER TABLE public.people ADD CONSTRAINT "people_fk1" FOREIGN KEY ("homeworld_id") REFERENCES  public.planets("_id");


  ALTER TABLE  public.people_in_films ADD CONSTRAINT "people_in_films_fk0" FOREIGN KEY ("person_id") REFERENCES public.people("_id");
  ALTER TABLE  public.people_in_films ADD CONSTRAINT "people_in_films_fk1" FOREIGN KEY ("film_id") REFERENCES  public.films("_id");


  ALTER TABLE  public.species ADD CONSTRAINT "species_fk0" FOREIGN KEY ("homeworld_id") REFERENCES  public.planets("_id");


  ALTER TABLE  public.species_in_films ADD CONSTRAINT "species_in_films_fk0" FOREIGN KEY ("film_id") REFERENCES  public.films("_id");
  ALTER TABLE  public.species_in_films ADD CONSTRAINT "species_in_films_fk1" FOREIGN KEY ("species_id") REFERENCES  public.species("_id");

  ALTER TABLE  public.planets_in_films ADD CONSTRAINT "planets_in_films_fk0" FOREIGN KEY ("film_id") REFERENCES  public.films("_id");
  ALTER TABLE  public.planets_in_films ADD CONSTRAINT "planets_in_films_fk1" FOREIGN KEY ("planet_id") REFERENCES  public.planets("_id");

  ALTER TABLE  public.pilots ADD CONSTRAINT "pilots_fk0" FOREIGN KEY ("person_id") REFERENCES public.people("_id");
  ALTER TABLE  public.pilots ADD CONSTRAINT "pilots_fk1" FOREIGN KEY ("vessel_id") REFERENCES  public.vessels("_id");

  ALTER TABLE  public.vessels_in_films ADD CONSTRAINT "vessels_in_films_fk0" FOREIGN KEY ("vessel_id") REFERENCES  public.vessels("_id");
  ALTER TABLE  public.vessels_in_films ADD CONSTRAINT "vessels_in_films_fk1" FOREIGN KEY ("film_id") REFERENCES  public.films("_id");

  ALTER TABLE  public.starship_specs ADD CONSTRAINT "starship_specs_fk0" FOREIGN KEY ("vessel_id") REFERENCES  public.vessels("_id");
  `

// const systemInsightPrompt = `You're a backend database software engineer that needs to take a human language prompt and generate a SQL query using only the provided schema. 
//         You will be querying a PostgreSQL database containing data about Star Wars. 
//         For every request, first break the query into logical steps or subtasks. Think through:

//           1. What data needs to be selected and what entity or entities in the database schema the user is asking for in the return value (For example, ask yourself is the user asking for a person's name, or a planet, or a species, etc.).
//           2. Which tables are involved.
//           3. How the tables are related (JOINs).
//           4. What filters or conditions apply.
//           5. How the data should be grouped or ordered.
//           6. Any derived values, subqueries, or aggregations needed.
//           7. Do not make any assumptions based on your previous star wars related knowledge.

//         Once you've planned out the logic in your head, in 6 sentences, describe your thought process and the logical steps you took to reach your answer. Explain how and why you dereived each piece of the SQl query. Write the final SQL query at the end of your explanation.
//         Here is the database schema: `
const systemContent = 
        `You're a backend database software engineer that needs to take a human language prompt and generate a SQL query using only the provided schema. 
        You will be querying a PostgreSQL database containing data about Star Wars. 
        For every request, first break the query into logical steps or subtasks. Think through:

          1. What data needs to be selected and what entity or entities in the database schema the user is asking for in the return value (For example, ask yourself is the user asking for a person's name, or a planet, or a species, etc.).
          2. Which tables are involved.
          3. How the tables are related (JOINs).
          4. What filters or conditions apply.
          5. How the data should be grouped or ordered.
          6. Any derived values, subqueries, or aggregations needed.
          7. Do not make any assumptions based on your previous star wars related knowledge.

        Once you've planned out the logic in your head, write only the final SQL query. Do not include the planning in the output — just use it to improve accuracy.

        Here are some examples for reference as you break down the steps:

        These three prompts should have generated the same response.
        The first did not generate a correctly formed SQL response:
        
        PROMPT1: "What is the name of the droid with red eyes from the planet of the women with black hair and brown eyes"
        generated this incorrect response:
        "SELECT p1.name 
        FROM people p1 
        JOIN people p2 ON p1.homeworld_id = p2.homeworld_id 
        JOIN species s1 ON p1.species_id = s1._id 
        JOIN species s2 ON p2.species_id = s2._id 
        WHERE s1.name = 'Droid' 
        AND p1.eye_color = 'red' 
        AND p2.hair_color = 'black' 
        AND p2.eye_color = 'brown';"


        This wording did generate a correct response:
        PROMPT2: "What is the name of the droid with red eyes from the same planet as the woman with black hair and brown eyes"
        generated this correct response:
        "SELECT p.name 
        FROM people p 
        JOIN species s ON p.species_id = s._id 
        WHERE p.eye_color = 'red' 
        AND s.name = 'Droid' 
        AND p.homeworld_id =      
        (SELECT p2.homeworld_id      
        FROM people p2      
        WHERE p2.hair_color = 'black' 
        AND p2.eye_color = 'brown' A
        ND p2.gender = 'female')"

        This wording did generate a correct response:
        PROMPT3: "there is a women with black hair and brown eyes, find her planet then tell me what is the name of the droid with red eyes from her planet"
        Generated this correct response:
        "SELECT droids.name 
        FROM people AS women 
        JOIN planets ON women.homeworld_id = planets._id 
        JOIN people AS droids ON droids.homeworld_id = planets._id 
        JOIN species ON droids.species_id = species._id 
        WHERE women.gender = 'female'    
        AND women.hair_color = 'black'    
        AND women.eye_color = 'brown'    
        AND species.name = 'Droid'    
        AND droids.eye_color = 'red';"


        Here is the database schema:
        `;

 //  Path to the queries.json file
 const queriesFilePath = path.join(__dirname, '../pastPrompts/queries.json');

 // Read and update the queries.json file
 let queriesData: Record<string, Array<{systemContent: string, returnedQuery: string; correctResponse: boolean | null}>> = {};
 if (fs.existsSync(queriesFilePath)) {
   const fileContent = fs.readFileSync(queriesFilePath, 'utf-8');
   queriesData = fileContent ? JSON.parse(fileContent) : {};
 }


  try {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: systemContent + schemaContent
      },
      { role: "user", content: naturalLanguageQuery },
    ],
    max_completion_tokens: 500,
  });
  console.log("response message", response.choices[0].message.content);
  console.log("cleaned response message", markdownToPlainString(response.choices[0].message.content || ''));


  
  const returnedQuery = response.choices[0].message.content
  ? markdownToPlainString(response.choices[0].message.content) : null;


  if (!returnedQuery) {
    const error: ServerError = {
      log: 'OpenAI did not return a valid SQL query',
      status: 500,
      message: { err: 'An error occurred while querying OpenAI' },
    };
    return next(error);
  }
 
     // Update the queries object
     if (!queriesData[naturalLanguageQuery]) {
       queriesData[naturalLanguageQuery] = [];
     }
     queriesData[naturalLanguageQuery].push({ systemContent, returnedQuery, correctResponse: null });
 
     // Write the updated object back to the file
     fs.writeFileSync(queriesFilePath, JSON.stringify(queriesData, null, 2), 'utf-8');

  res.locals.databaseQuery = returnedQuery; // Store the generated SQL query in res.locals
  return next();
}
  catch (err) {
    const error: ServerError = {
      log: `OpenAI query failed: ${(err as Error).message}`,
      status: 500,
      message: { err: 'An error occurred while querying OpenAI' },
    };
    return next(error);
  }
};

function markdownToPlainString(markdown: string): string {
  // Remove Markdown syntax using regex
  return markdown
    .replace(/```/g, '') // Remove triple backticks
    .replace(/\bsql\b/gi, '') // Remove SQL language specifier
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // Remove links but keep text
    .replace(/[#>~`]/g, '') // Remove Markdown special characters
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim(); // Trim leading/trailing spaces
}

// {
//   id: 'chatcmpl-BKa7V8VSrifA4LWi29bEBq4KPd8Cu',
//   object: 'chat.completion',
//   created: 1744245105,
//   object: 'chat.completion',
//   created: 1744245105,
//   created: 1744245105,
//   model: 'gpt-4o-2024-08-06',
//   model: 'gpt-4o-2024-08-06',
//   choices: [
//     {
//       index: 0,
//       message: [Object],
//       logprobs: null,
//       finish_reason: 'stop'
//     }
//   ],
//   usage: {
//     prompt_tokens: 749,
//     completion_tokens: 16,
//     total_tokens: 765,
//     prompt_tokens_details: { cached_tokens: 0, audio_tokens: 0 },
//     completion_tokens_details: {
//       reasoning_tokens: 0,
//       audio_tokens: 0,
//       accepted_prediction_tokens: 0,
//       rejected_prediction_tokens: 0
//     }
//   },
//   service_tier: 'default',
//   system_fingerprint: 'fp_432e014d75'
// }



// What is the name of the droid with red eyes from the planet of the women with black hair and brown eyes  - BAD SQL response
// "SELECT p1.name 
// FROM people p1 
// JOIN people p2 ON p1.homeworld_id = p2.homeworld_id 
// JOIN species s1 ON p1.species_id = s1._id 
// JOIN species s2 ON p2.species_id = s2._id 
// WHERE s1.name = 'Droid' 
// AND p1.eye_color = 'red' 
// AND p2.hair_color = 'black' 
// AND p2.eye_color = 'brown';"

//What is the name of the droid with red eyes from the same planet as the woman with black hair and brown eyes - Good SQL response
//SELECT p.name 
// FROM people p 
// JOIN species s ON p.species_id = s._id 
// WHERE p.eye_color = 'red' 
// AND s.name = 'Droid' 
// AND p.homeworld_id =      
// (SELECT p2.homeworld_id      
// FROM people p2      
// WHERE p2.hair_color = 'black' 
// AND p2.eye_color = 'brown' A
// ND p2.gender = 'female')


//there is a women with black hair and brown eyes, find her planet then tell me what is the name of the droid with red eyes from her planet - Good SQL response

 //"SELECT droids.name 
 // FROM people AS women 
 // JOIN planets ON women.homeworld_id = planets._id 
 // JOIN people AS droids ON droids.homeworld_id = planets._id 
 // JOIN species ON droids.species_id = species._id 
 // WHERE women.gender = 'female'    
 // AND women.hair_color = 'black'    
 // AND women.eye_color = 'brown'    
 // AND species.name = 'Droid'    
 // AND droids.eye_color = 'red';"




 // "give the pilot of the ship with a hyper-drive that is six times faster than the millennium falcon's"  - BAD SQL response

//  "SELECT p.name  
// FROM pilots pi 
// JOIN people p 
// ON pi.person_id = p._id 
// JOIN starship_specs ss 
// ON pi.vessel_id = ss.vessel_id 
// WHERE ss.hyperdrive_rating = '0.5';"


//find the milenium falcon's hypredrive rating, then find the vessel that is six times higher, finally tell me the pilot of the vessel that is six times higher - Good SQL response


// WITH millenium_falcon_hyperdrive 
// AS (    
//  SELECT ss.hyperdrive_rating::numeric AS hyperdrive_rating     
//  FROM vessels v     
//  JOIN starship_specs ss ON v._id = ss.vessel_id     
//  WHERE v.name = 'Millennium Falcon' ), higher_hyperdrive_vessel AS (     
//    SELECT v._id AS vessel_id, v.name AS vessel_name     
//    FROM vessels v     
//    JOIN starship_specs ss ON v._id = ss.vessel_id     
//    WHERE ss.hyperdrive_rating::numeric = (         
//      SELECT hyperdrive_rating * 6 
//      FROM millenium_falcon_hyperdrive     ) ) 
//  SELECT p.name 
//  AS pilot_name, hhv.vessel_name 
// FROM pilots pl 
// JOIN higher_hyperdrive_vessel hhv 
// ON pl.vessel_id = hhv.vessel_id 
// JOIN people p ON pl.person_id = p._id;
