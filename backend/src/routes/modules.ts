import { Router, type IRouter } from "express";
import { db } from "../db";
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
} from "../db/schema";
import { desc, count } from "drizzle-orm";

const router: IRouter = Router();

const tableMap: Record<string, any> = {
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

router.get("/data/:module", async (req, res, next) => {
  try {
    const table = tableMap[req.params.module];
    if (!table) {
      res.status(404).json({ error: `Module '${req.params.module}' not found` });
      return;
    }

    const rows = await db.select().from(table).orderBy(desc(table.createdAt));
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post("/data/:module", async (req, res, next) => {
  try {
    const table = tableMap[req.params.module];
    if (!table) {
      res.status(404).json({ error: `Module '${req.params.module}' not found` });
      return;
    }

    const { id, name, detail, meta, status, amount, secondary } = req.body;
    const generatedId = id || `${req.params.module.slice(0, 3)}-${Date.now()}`;

    const [created] = await db
      .insert(table)
      .values({
        id: generatedId,
        name: name || "Untitled",
        detail: detail || "",
        meta: meta || "Created just now",
        status: status || "Active",
        amount: amount || null,
        secondary: secondary || null,
      })
      .returning();

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

router.get("/kpis", async (_req, res, next) => {
  try {
    const [{ value: appointmentsCount }] = await db.select({ value: count() }).from(appointmentsTable);
    const [{ value: activeServicesCount }] = await db.select({ value: count() }).from(serviceJobsTable);
    const [{ value: completedCount }] = await db.select({ value: count() }).from(serviceHistoryTable);
    const [{ value: customersCount }] = await db.select({ value: count() }).from(customersTable);

    res.json({
      appointments: appointmentsCount,
      activeServices: activeServicesCount,
      completedServices: completedCount,
      revenue: "₹24.8L",
      customers: customersCount,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
