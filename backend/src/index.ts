try {
  process.loadEnvFile();
} catch {
  // Ignore if .env is missing or already loaded
}

import app from "./app";
import { logger } from "./lib/logger";
import { seedDatabase } from "./db/seed";

const rawPort = process.env["PORT"] || "3001";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, async (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  await seedDatabase();
});
