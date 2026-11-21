import type { Server } from "node:http";
import app from "./app";
import { config } from "./config";
import { logger } from "./lib/logger";
import { closeDb } from "./db";
import { seedDatabase } from "./db/seed";

const port = config.PORT;

const server: Server = app.listen(port, async () => {
  logger.info({ port }, "Server listening");
  try {
    await seedDatabase();
  } catch (err) {
    logger.error({ err }, "Database seed failed during startup");
  }
});

server.on("error", (err) => {
  logger.error({ err }, "Fatal error on HTTP server");
  process.exit(1);
});

// Graceful shutdown
let isShuttingDown = false;

async function handleShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info({ signal }, "Received shutdown signal, closing server gracefully");

  server.close(async () => {
    logger.info("HTTP server closed to new connections");
    try {
      await closeDb();
      logger.info("Database connections closed cleanly");
      process.exit(0);
    } catch (err) {
      logger.error({ err }, "Error closing database connection pool");
      process.exit(1);
    }
  });

  // Force exit after 10 seconds if shutdown hangs
  setTimeout(() => {
    logger.error("Forcefully terminating after shutdown timeout");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));
