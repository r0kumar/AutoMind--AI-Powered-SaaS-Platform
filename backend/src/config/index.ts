import path from "node:path";
import { fileURLToPath } from "node:url";
import * as zod from "zod";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

// Attempt loading .env from backend directory, then fall back to process.cwd()
try {
  process.loadEnvFile(path.resolve(currentDir, "../../.env"));
} catch {
  try {
    process.loadEnvFile();
  } catch {
    // Ignore if .env is missing or already loaded in the environment
  }
}

const envSchema = zod.object({
  PORT: zod.coerce.number().int().positive().default(3001),
  DATABASE_URL: zod.string().min(1, "DATABASE_URL must be set. Ensure PostgreSQL is configured."),
  NODE_ENV: zod.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: zod.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  CORS_ORIGIN: zod.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.format());
  throw new Error("Invalid environment configuration. Check your .env file.");
}

export const config = parsed.data;
export type Config = typeof config;
