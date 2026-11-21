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

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", router);

// Fallback handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
