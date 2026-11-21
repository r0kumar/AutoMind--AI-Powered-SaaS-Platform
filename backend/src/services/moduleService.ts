import {
  findModuleRows,
  insertModuleRow,
  getTableForModule,
} from "../db/repositories/moduleRepository";
import { NotFoundError } from "../middlewares/errorHandler";
import type { ModuleRow, NewModuleRow } from "../db/schema";
import type { CreateModuleRecordInput, ModuleQueryParams } from "../schema/moduleSchema";

export async function getModuleData(
  moduleName: string,
  options?: ModuleQueryParams,
): Promise<ModuleRow[]> {
  const table = getTableForModule(moduleName);
  if (!table) {
    throw new NotFoundError(`Module '${moduleName}' not found`);
  }

  return await findModuleRows(moduleName, options);
}

export async function createModuleRecord(
  moduleName: string,
  input: CreateModuleRecordInput,
): Promise<ModuleRow> {
  const table = getTableForModule(moduleName);
  if (!table) {
    throw new NotFoundError(`Module '${moduleName}' not found`);
  }

  const generatedId = input.id || `${moduleName.slice(0, 3)}-${Date.now()}`;

  const rowData: NewModuleRow = {
    id: generatedId,
    name: input.name || "Untitled",
    detail: input.detail || "",
    meta: input.meta || "Created just now",
    status: input.status || "Active",
    amount: input.amount ?? null,
    secondary: input.secondary ?? null,
  };

  return await insertModuleRow(moduleName, rowData);
}
