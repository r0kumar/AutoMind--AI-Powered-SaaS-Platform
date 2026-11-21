import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { config } from "../config";
import { logger } from "../lib/logger";
import * as schema from "./schema";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
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
