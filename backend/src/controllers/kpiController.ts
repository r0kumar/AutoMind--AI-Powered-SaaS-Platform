import type { Request, Response } from "express";
import { getDashboardKpis } from "../services/kpiService";

export async function getKpis(_req: Request, res: Response): Promise<void> {
  const kpis = await getDashboardKpis();
  res.json(kpis);
}
