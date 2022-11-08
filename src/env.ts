import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

import { z } from "zod";

const envSchema = z.object({
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_SCHEMA_NAME: z.string(),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  DEV_PORT: z.string().transform(Number),
  APP_PORT: z.string().transform(Number),
  SECRET_KEY: z.string().min(20),
  LOGGING_DIR: z.string(),
  LOGGING_LEVEL: z.enum(["combined", "common", "dev", "short", "tiny"]),
  APP_HOST: z.string().url(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "❌ Invalid environment variables: ",
    JSON.stringify(result.error.format(), null, 4)
  );
  process.exit(1);
}

const env = result.data;

export { env };
