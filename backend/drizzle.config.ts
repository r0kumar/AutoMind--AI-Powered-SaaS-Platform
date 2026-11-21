/// <reference types="node" />
import process from "node:process";
import path from "node:path";
import { defineConfig } from "drizzle-kit";

try {
  process.loadEnvFile(path.resolve(import.meta.dirname, ".env"));
} catch {
  try {
    process.loadEnvFile();
  } catch {}
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
