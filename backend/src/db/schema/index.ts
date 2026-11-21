import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const appointmentsTable = pgTable("appointments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  detail: text("detail").notNull(),
  meta: text("meta").notNull(),
  status: text("status").notNull(),
  amount: text("amount"),
  secondary: text("secondary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customersTable = pgTable("customers", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  detail: text("detail").notNull(),
  meta: text("meta").notNull(),
  status: text("status").notNull(),
  amount: text("amount"),
  secondary: text("secondary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vehiclesTable = pgTable("vehicles", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  detail: text("detail").notNull(),
  meta: text("meta").notNull(),
  status: text("status").notNull(),
  amount: text("amount"),
  secondary: text("secondary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const serviceJobsTable = pgTable("service_jobs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  detail: text("detail").notNull(),
  meta: text("meta").notNull(),
  status: text("status").notNull(),
  amount: text("amount"),
  secondary: text("secondary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobCardsTable = pgTable("job_cards", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  detail: text("detail").notNull(),
  meta: text("meta").notNull(),
  status: text("status").notNull(),
  amount: text("amount"),
  secondary: text("secondary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sparePartsTable = pgTable("spare_parts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  detail: text("detail").notNull(),
  meta: text("meta").notNull(),
  status: text("status").notNull(),
  amount: text("amount"),
  secondary: text("secondary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const serviceHistoryTable = pgTable("service_history", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  detail: text("detail").notNull(),
  meta: text("meta").notNull(),
  status: text("status").notNull(),
  amount: text("amount"),
  secondary: text("secondary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const billingTable = pgTable("billing", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  detail: text("detail").notNull(),
  meta: text("meta").notNull(),
  status: text("status").notNull(),
  amount: text("amount"),
  secondary: text("secondary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const branchesTable = pgTable("branches", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  detail: text("detail").notNull(),
  meta: text("meta").notNull(),
  status: text("status").notNull(),
  amount: text("amount"),
  secondary: text("secondary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});