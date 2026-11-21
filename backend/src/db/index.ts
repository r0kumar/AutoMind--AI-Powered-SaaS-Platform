import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { config } from "../config";
import { logger } from "../lib/logger";
import * as schema from "./schema";

const { Pool } = pg;

const isProduction = config.NODE_ENV === "production";
const isLocal =
  config.DATABASE_URL.includes("localhost") ||
  config.DATABASE_URL.includes("127.0.0.1");

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl:
    config.DATABASE_URL.includes("sslmode=require") || (isProduction && !isLocal)
      ? { rejectUnauthorized: false }
      : undefined,
});

pool.on("error", (err) => {
  logger.error({ err }, "Unexpected error on idle database client");
});

export const db = drizzle(pool, { schema });

export async function closeDb(): Promise<void> {
  logger.info("Closing PostgreSQL connection pool");
  await pool.end();
}

export * from "./schema";
