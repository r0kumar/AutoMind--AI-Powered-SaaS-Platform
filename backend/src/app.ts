import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { config } from "./config";
import { logger } from "./lib/logger";
import { securityHeaders } from "./middlewares/security";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";

const app: Express = express();

// Disable ETag generation to ensure dynamic API data is never served with stale 304 responses
app.set("etag", false);

// Security headers
app.use(securityHeaders);

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: config.CORS_ORIGIN ? config.CORS_ORIGIN.split(",").map((s) => s.trim()) : true,
  credentials: true,
};
app.use(cors(corsOptions));

// Request logging with Pino
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Prevent caching on API endpoints
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", router);

// Fallback handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
