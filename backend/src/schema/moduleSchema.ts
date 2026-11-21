import * as zod from "zod";
import { validModules } from "../db/repositories/moduleRepository";

export const moduleParamSchema = zod.object({
  module: zod.enum(validModules as [string, ...string[]], {
    errorMap: () => ({ message: "Invalid module name" }),
  }),
});

export const moduleQuerySchema = zod.object({
  limit: zod.coerce.number().int().positive().max(1000).optional(),
  offset: zod.coerce.number().int().nonnegative().optional(),
});

export const createModuleRecordSchema = zod.object({
  id: zod.string().max(64).optional(),
  name: zod.string().max(255).default("Untitled"),
  detail: zod.string().default(""),
  meta: zod.string().default("Created just now"),
  status: zod.string().default("Active"),
  amount: zod.string().nullable().optional(),
  secondary: zod.string().nullable().optional(),
});

export type CreateModuleRecordInput = zod.infer<typeof createModuleRecordSchema>;
export type ModuleQueryParams = zod.infer<typeof moduleQuerySchema>;
