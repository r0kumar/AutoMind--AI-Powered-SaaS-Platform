import { desc, count } from "drizzle-orm";
import { db } from "../index";
import {
  appointmentsTable,
  customersTable,
  vehiclesTable,
  serviceJobsTable,
  jobCardsTable,
  sparePartsTable,
  serviceHistoryTable,
  billingTable,
  branchesTable,
  type ModuleTable,
  type ModuleRow,
  type NewModuleRow,
} from "../schema";

export const tableMap: Record<string, ModuleTable> = {
  appointments: appointmentsTable,
  customers: customersTable,
  vehicles: vehiclesTable,
  "service-jobs": serviceJobsTable,
  "job-cards": jobCardsTable,
  "spare-parts": sparePartsTable,
  "service-history": serviceHistoryTable,
  billing: billingTable,
  branches: branchesTable,
};

export const validModules = Object.keys(tableMap) as (keyof typeof tableMap)[];

export function getTableForModule(moduleName: string): ModuleTable | undefined {
  return tableMap[moduleName];
}

export async function findModuleRows(
  moduleName: string,
  options?: { limit?: number; offset?: number },
): Promise<ModuleRow[]> {
  const table = getTableForModule(moduleName);
  if (!table) {
    throw new Error(`Module '${moduleName}' not found`);
  }

  let query = db.select().from(table).orderBy(desc(table.createdAt)).$dynamic();

  if (options?.limit && options.limit > 0) {
    query = query.limit(options.limit);
  }
  if (options?.offset && options.offset > 0) {
    query = query.offset(options.offset);
  }

  return await query;
}

export async function insertModuleRow(
  moduleName: string,
  data: NewModuleRow,
): Promise<ModuleRow> {
  const table = getTableForModule(moduleName);
  if (!table) {
    throw new Error(`Module '${moduleName}' not found`);
  }

  const results = (await db.insert(table).values(data).returning()) as ModuleRow[];
  return results[0];
}

export interface KpiCounts {
  appointments: number;
  activeServices: number;
  completedServices: number;
  customers: number;
}

export async function fetchKpiCounts(): Promise<KpiCounts> {
  const [
    [{ value: appointmentsCount }],
    [{ value: activeServicesCount }],
    [{ value: completedCount }],
    [{ value: customersCount }],
  ] = await Promise.all([
    db.select({ value: count() }).from(appointmentsTable),
    db.select({ value: count() }).from(serviceJobsTable),
    db.select({ value: count() }).from(serviceHistoryTable),
    db.select({ value: count() }).from(customersTable),
  ]);

  return {
    appointments: Number(appointmentsCount),
    activeServices: Number(activeServicesCount),
    completedServices: Number(completedCount),
    customers: Number(customersCount),
  };
}
