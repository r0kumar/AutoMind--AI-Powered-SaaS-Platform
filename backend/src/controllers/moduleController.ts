import type { Request, Response } from "express";
import { getModuleData, createModuleRecord } from "../services/moduleService";

export async function listRecords(req: Request, res: Response): Promise<void> {
  const module = String(req.params.module);
  const rows = await getModuleData(module, req.query);
  res.json(rows);
}

export async function createRecord(req: Request, res: Response): Promise<void> {
  const module = String(req.params.module);
  const created = await createModuleRecord(module, req.body);
  res.status(201).json(created);
}
