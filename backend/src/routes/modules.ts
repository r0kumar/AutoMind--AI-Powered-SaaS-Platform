import { Router, type IRouter } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validateRequest } from "../middlewares/validate";
import {
  moduleParamSchema,
  moduleQuerySchema,
  createModuleRecordSchema,
} from "../schema/moduleSchema";
import { listRecords, createRecord } from "../controllers/moduleController";
import { getKpis } from "../controllers/kpiController";

const router: IRouter = Router();

router.get(
  "/data/:module",
  validateRequest({ params: moduleParamSchema, query: moduleQuerySchema }),
  asyncHandler(listRecords),
);

router.post(
  "/data/:module",
  validateRequest({ params: moduleParamSchema, body: createModuleRecordSchema }),
  asyncHandler(createRecord),
);

router.get("/kpis", asyncHandler(getKpis));

export default router;
