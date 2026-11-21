import type { Request, Response } from "express";
import { HealthCheckResponse } from "../schema";

export function getHealth(_req: Request, res: Response): void {
  const response = HealthCheckResponse.parse({ status: "ok" });
  res.json(response);
}
