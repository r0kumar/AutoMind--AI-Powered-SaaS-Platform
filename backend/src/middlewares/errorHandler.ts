import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";
import { config } from "../config";

export class AppError extends Error {
  readonly statusCode: number;
  readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

export function errorHandler(
  err: Error | AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
  } else if ("statusCode" in err && typeof (err as { statusCode: unknown }).statusCode === "number") {
    statusCode = (err as { statusCode: number }).statusCode;
    message = err.message || message;
  }

  if (statusCode >= 500) {
    logger.error({ err, statusCode }, "Unhandled server error");
  } else {
    logger.warn({ err: err.message, statusCode }, "Client error");
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: config.NODE_ENV === "production" && statusCode === 500 ? "Internal Server Error" : message,
    error: message,
  });
}
