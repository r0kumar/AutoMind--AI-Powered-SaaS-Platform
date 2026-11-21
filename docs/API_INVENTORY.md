# API Inventory & Route Audit Report

**Project**: AutoMind AI (PERN Stack Prototype / Demo)  
**Date**: November 21, 2026  
**Status**: Read-Only Audit & Classification  
**Output Document**: `docs/API_INVENTORY.md`

---

## Executive Summary

AutoMind AI is designed as a multi-branch vehicle service management platform. A comprehensive code audit of both the Express/Node.js backend and the React frontend revealed that:
1. **The Backend exposes 4 Express endpoints** across 2 mounted routers under `/api`. Two of these endpoints (`GET /api/data/:module` and `POST /api/data/:module`) act as dynamic multiplexers handling 9 distinct database tables.
2. **Frontend integration is only partially complete**:
   - Only 2 out of 11 functional workspace screens (`AppointmentsPage` and `CustomersPage`) actually call the backend API.
   - The remaining 9 pages (`Dashboard`, `VehiclesPage`, `ServiceJobsPage`, `JobCardsPage`, `SparePartsPage`, `BillingPage`, `ServiceHistoryPage`, `BranchesPage`, `Analytics`, `Reports`, `Settings`, `AIInsights`) rely entirely on hardcoded in-memory mock data (`mockData.ts`), ignoring the backend endpoints.
   - The `/api/kpis` endpoint is fully implemented in the backend, but is never queried by the frontend `Dashboard`.
3. **Multi-Tenancy & Security Blind Spots**:
   - **Zero Authentication**: No JWT, session, API key, or cookie-based authentication exists. Every endpoint is completely public.
   - **Zero Branch/Tenant Isolation**: Although the frontend presents a "Branch context" dropdown (`AppShell.tsx`), backend queries fetch and insert data across the entire database without branch filtering. A client can view or mutate records across all branches by requesting `/api/data/:module`.
   - **Zero Access Control / RBAC**: No technician, service advisor, or admin roles are enforced.

---

## Step 1: Backend Route Inventory

Mounted prefix in [`backend/src/app.ts:46`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/app.ts#L46): `app.use("/api", router);`  
Nested routers mounted in [`backend/src/routes/index.ts:7-8`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/routes/index.ts#L7-L8): `router.use(healthRouter);` and `router.use(modulesRouter);`.

| # | Method | Full Path | File:Line | Controller / Handler | Auth Middleware | Roles Allowed | Branch Check (Y/N) | DB Tables Touched | Input Validation (Y/N) |
|---|---|---|---|---|---|---|---|---|---|
| **1** | `GET` | `/api/healthz` | [`backend/src/routes/health.ts:6`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/routes/health.ts#L6) | `getHealth` ([`healthController.ts:4`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/controllers/healthController.ts#L4)) | None | Public (All) | N | None | N (No inputs) |
| **2** | `GET` | `/api/data/:module` | [`backend/src/routes/modules.ts:16`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/routes/modules.ts#L16) | `listRecords` ([`moduleController.ts:4`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/controllers/moduleController.ts#L4)) | None | Public (All) | N | 1 of 9 tables based on `:module` (`appointments`, `customers`, `vehicles`, `service_jobs`, `job_cards`, `spare_parts`, `service_history`, `billing`, `branches`) | Y (`moduleParamSchema` enum, `moduleQuerySchema` limit/offset) |
| **3** | `POST` | `/api/data/:module` | [`backend/src/routes/modules.ts:22`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/routes/modules.ts#L22) | `createRecord` ([`moduleController.ts:10`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/controllers/moduleController.ts#L10)) | None | Public (All) | N | 1 of 9 tables based on `:module` (`appointments`, `customers`, `vehicles`, `service_jobs`, `job_cards`, `spare_parts`, `service_history`, `billing`, `branches`) | Y (`moduleParamSchema` enum, `createModuleRecordSchema` body) |
| **4** | `GET` | `/api/kpis` | [`backend/src/routes/modules.ts:28`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/routes/modules.ts#L28) | `getKpis` ([`kpiController.ts:4`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/controllers/kpiController.ts#L4)) | None | Public (All) | N | `appointments`, `service_jobs`, `service_history`, `customers` (count aggregation) | N (No inputs) |

### Concrete Virtual Resources Handled by `/api/data/:module`

Because `:module` is dynamically routed to PostgreSQL tables, the backend effectively provisions 18 distinct concrete endpoints:

| Sub-Resource Path | Supported Methods | Backing Database Table |
|---|---|---|
| `/api/data/appointments` | `GET`, `POST` | `appointments` |
| `/api/data/customers` | `GET`, `POST` | `customers` |
| `/api/data/vehicles` | `GET`, `POST` | `vehicles` |
| `/api/data/service-jobs` | `GET`, `POST` | `service_jobs` |
| `/api/data/job-cards` | `GET`, `POST` | `job_cards` |
| `/api/data/spare-parts` | `GET`, `POST` | `spare_parts` |
| `/api/data/service-history` | `GET`, `POST` | `service_history` |
| `/api/data/billing` | `GET`, `POST` | `billing` |
| `/api/data/branches` | `GET`, `POST` | `branches` |

---

## Step 2: Frontend API Usage

Search across the entire React client (`fronted/src/`) for `fetch`, `customFetch`, `axios`, and React Query hooks:

| Method | Resolved Backend URL | File:Line | Page / Component That Uses It | Purpose |
|---|---|---|---|---|
| `GET` | `/api/data/appointments` | [`fronted/src/hooks/useModuleData.ts:14`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/hooks/useModuleData.ts#L14) | [`AppointmentsPage.tsx:14`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/AppointmentsPage.tsx#L14) | Fetches appointment records for timeline & agenda views |
| `POST` | `/api/data/appointments` | [`fronted/src/hooks/useModuleData.ts:25`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/hooks/useModuleData.ts#L25) | [`AppointmentsPage.tsx:33`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/AppointmentsPage.tsx#L33) | Persists new appointment created via `RecordDialog` |
| `GET` | `/api/data/customers` | [`fronted/src/hooks/useModuleData.ts:14`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/hooks/useModuleData.ts#L14) | [`CustomersPage.tsx:14`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/CustomersPage.tsx#L14) | Fetches customer list for CRM directory |
| `POST` | `/api/data/customers` | [`fronted/src/hooks/useModuleData.ts:25`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/hooks/useModuleData.ts#L25) | [`CustomersPage.tsx:30`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/CustomersPage.tsx#L30) | Persists new customer profile created via `RecordDialog` |
| `GET` | `/api/healthz` | [`fronted/src/api/generated/api.ts:27`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/api/generated/api.ts#L27) | Generated SDK only (Unused by UI) | Autogenerated health query function from OpenAPI spec |

---

## Step 3: Cross-Reference & Classification

### 1. Classification of Backend Routes

| Route | Classification | Rationale |
|---|---|---|
| `GET /api/healthz` | **USED** | DevOps & Container readiness/liveness probe. Verified by test suite. |
| `GET /api/data/appointments` | **USED** | Directly consumed by `AppointmentsPage` via `useModuleData('appointments')`. |
| `POST /api/data/appointments` | **USED** | Directly consumed by `AppointmentsPage` dialog submit. |
| `GET /api/data/customers` | **USED** | Directly consumed by `CustomersPage` via `useModuleData('customers')`. |
| `POST /api/data/customers` | **USED** | Directly consumed by `CustomersPage` dialog submit. |
| `GET /api/kpis` | **UNUSED** | Endpoint exists and calculates accurate counts from DB, but `Dashboard.tsx` hardcodes static values instead of fetching it. |
| `GET /api/data/vehicles` | **UNUSED** | `VehiclesPage.tsx` imports and displays `initialRows.vehicles` from `mockData.ts`. |
| `POST /api/data/vehicles` | **UNUSED** | Dialog save in `VehiclesPage.tsx` only updates local React state. |
| `GET /api/data/service-jobs` | **UNUSED** | `ServiceJobsPage.tsx` uses `initialRows['service-jobs']`. |
| `POST /api/data/service-jobs` | **UNUSED** | Dialog save in `ServiceJobsPage.tsx` only updates local React state. |
| `GET /api/data/job-cards` | **UNUSED** | `JobCardsPage.tsx` uses `initialRows['job-cards']`. |
| `POST /api/data/job-cards` | **UNUSED** | Dialog save in `JobCardsPage.tsx` only updates local React state. |
| `GET /api/data/spare-parts` | **UNUSED** | `SparePartsPage.tsx` uses `initialRows.spareParts`. |
| `POST /api/data/spare-parts` | **UNUSED** | Dialog save in `SparePartsPage.tsx` only updates local React state. |
| `GET /api/data/service-history` | **UNUSED** | `ServiceHistoryPage.tsx` uses `initialRows.serviceHistory`. |
| `POST /api/data/service-history` | **UNUSED** | No frontend mutation exists. |
| `GET /api/data/billing` | **UNUSED** | `BillingPage.tsx` uses `initialRows.billing`. |
| `POST /api/data/billing` | **UNUSED** | `markPaid` in `BillingPage.tsx` only updates local React state. |
| `GET /api/data/branches` | **UNUSED** | `BranchesPage.tsx` and `AppShell.tsx` read `initialRows.branches`. |
| `POST /api/data/branches` | **UNUSED** | No frontend mutation exists. |

*(Note: There are 0 DUPLICATE, 0 DEBUG/TEST, and 0 ORPHAN routes in the Express router; all declared routes map to valid controllers, services, and PostgreSQL tables).*

---

### 2. Missing Backend Routes (Frontend Calls with No Route)
- **None (0 MISSING)**. All URLs fetched by the React application exist on the backend.

---

### 3. Hardcoded Frontend Screens (Showing Static/Mock Data Instead of API)

| Frontend Page / Component | File Path | Hardcoded Mock Data Used | Should Connect To |
|---|---|---|---|
| **Dashboard** | [`fronted/src/pages/Dashboard.tsx:14-20`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/Dashboard.tsx#L14-L20) | Hardcoded KPIs (`184`, `42`, `638`, `₹24.8L`, `2,486`) and `initialRows.appointments` | `GET /api/kpis` & `GET /api/data/appointments` |
| **Vehicles** | [`fronted/src/pages/VehiclesPage.tsx:12`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/VehiclesPage.tsx#L12) | `initialRows.vehicles` (state mutated in memory only) | `GET /api/data/vehicles` & `POST /api/data/vehicles` |
| **Service Jobs** | [`fronted/src/pages/ServiceJobsPage.tsx:11`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/ServiceJobsPage.tsx#L11) | `initialRows['service-jobs']` (kanban moves in memory only) | `GET /api/data/service-jobs` & `POST /api/data/service-jobs` |
| **Digital Job Cards** | [`fronted/src/pages/JobCardsPage.tsx:12`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/JobCardsPage.tsx#L12) | `initialRows['job-cards']` | `GET /api/data/job-cards` & `POST /api/data/job-cards` |
| **Spare Parts** | [`fronted/src/pages/SparePartsPage.tsx:11`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/SparePartsPage.tsx#L11) | `initialRows.spareParts` | `GET /api/data/spare-parts` & `POST /api/data/spare-parts` |
| **Billing & Payments** | [`fronted/src/pages/BillingPage.tsx:13`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/BillingPage.tsx#L13) | `initialRows.billing` (markPaid updates local state) | `GET /api/data/billing` & `POST /api/data/billing` |
| **Service History** | [`fronted/src/pages/ServiceHistoryPage.tsx:14`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/ServiceHistoryPage.tsx#L14) | `initialRows.serviceHistory` | `GET /api/data/service-history` |
| **Branches** | [`fronted/src/pages/BranchesPage.tsx:11`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/BranchesPage.tsx#L11) | `initialRows.branches` | `GET /api/data/branches` |
| **Analytics** | [`fronted/src/pages/Analytics.tsx:82`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/Analytics.tsx#L82) | Hardcoded SVG graphs and `initialRows.branches` | Future analytics API |
| **AI Insights** | [`fronted/src/pages/AIInsights.tsx:11-40`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/AIInsights.tsx#L11-L40) | 4 static hardcoded insight objects | Future AI / recommendations API |
| **Reports** | [`fronted/src/pages/Reports.tsx:12-18`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/Reports.tsx#L12-L18) | 5 static report titles with client-side mock CSV export | Future report generation API |
| **Settings** | [`fronted/src/pages/Settings.tsx:9`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/Settings.tsx#L9) | Hardcoded notification toggles & business profile | Future settings API |
| **App Shell Header** | [`fronted/src/components/layout/AppShell.tsx:254`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/components/layout/AppShell.tsx#L254) | Branch picker reads `initialRows.branches`; notifications are hardcoded strings; user profile is hardcoded to "Rohit Kumar" | `GET /api/data/branches` & user session API |
| **Login** | [`fronted/src/pages/Login.tsx:42-45`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/pages/Login.tsx#L42-L45) | Demo submit immediately navigates to `/dashboard` without authentication call | Future `/api/auth/login` |

---

## Step 4: Risk Flags

| Route / Resource | Authentication | Role Check | Branch / Tenant Check | Input Validation | String-Built SQL | Sensitive Data Returned | Risk Level |
|---|---|---|---|---|---|---|---|
| `GET /api/healthz` | ❌ None | ❌ None | N/A | N/A | No (None) | None | **LOW** |
| `GET /api/data/:module` | ❌ None | ❌ None | ❌ None (Returns all branches' records) | ✅ Zod Enum + Query | No (Drizzle ORM) | ⚠️ Customer PII (Phone, Email, Reg Plate, Invoices) | **CRITICAL** |
| `POST /api/data/:module` | ❌ None | ❌ None | ❌ None (No branch tenancy verification) | ✅ Zod Schema | No (Drizzle ORM) | Created Record | **CRITICAL** |
| `GET /api/kpis` | ❌ None | ❌ None | ❌ None (Aggregates across all branches) | N/A | No (Drizzle ORM) | Financial Revenue & Operation Counts | **HIGH** |

### Detailed Risk Descriptions

1. **Cross-Branch Data Leakage (Missing Tenancy Check)**:
   - In [`backend/src/db/repositories/moduleRepository.ts:43`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/db/repositories/moduleRepository.ts#L43), queries execute `db.select().from(table).orderBy(desc(table.createdAt))`.
   - The tables do not have a `branch_id` column or foreign key constraint. The branch name is merely embedded inside the freeform `detail` text string (e.g. `"Andheri West · Notes"`).
   - Any user can view all appointments, billing details, and vehicles belonging to every branch in India without restriction.
2. **Unauthenticated Write Access**:
   - `POST /api/data/:module` permits unauthenticated clients to insert records into critical tables such as `customers`, `appointments`, and `billing`.
3. **Unprotected Customer PII & Financial Data**:
   - `GET /api/data/customers` exposes phone numbers and email addresses without authentication.
   - `GET /api/data/billing` exposes customer invoice amounts, payment methods (UPI, Card, Cash), and payment statuses.

---

## Step 5: Third-Party & Database Usage

### 1. Outbound / Third-Party API Usage

| Type | Target / Provider | File:Line | Env Var Name | Actually Called Anywhere? |
|---|---|---|---|---|
| Font Stylesheet | Google Fonts (`fonts.googleapis.com`) | [`fronted/src/index.css:1`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/index.css#L1) | None (Static CSS import) | **YES** (Fetched by browser on client load) |
| Backend Outbound APIs | None | N/A | N/A | **NO** (No outbound HTTP clients, SMS, email, or payment SDKs exist in the backend codebase) |

### 2. Database Tables Usage

All tables are defined in [`backend/src/db/schema/index.ts`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/db/schema/index.ts) and populated by [`backend/src/db/seed.ts`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/db/seed.ts):

| Table Name | Defined in Drizzle Schema? | Populated by Seed? | Backend Route Exists? | Actually Used by Frontend? | Status |
|---|---|---|---|---|---|
| `appointments` | Yes | Yes | `GET/POST /api/data/appointments`, `/api/kpis` | **YES** (`AppointmentsPage.tsx`) | **ACTIVE** |
| `customers` | Yes | Yes | `GET/POST /api/data/customers`, `/api/kpis` | **YES** (`CustomersPage.tsx`) | **ACTIVE** |
| `vehicles` | Yes | Yes | `GET/POST /api/data/vehicles` | **NO** (`VehiclesPage.tsx` uses mock data) | **DORMANT** |
| `service_jobs` | Yes | Yes | `GET/POST /api/data/service-jobs`, `/api/kpis` | **PARTIAL** (Touched by `/api/kpis` count, but `ServiceJobsPage.tsx` uses mock data) | **DORMANT** |
| `job_cards` | Yes | Yes | `GET/POST /api/data/job-cards` | **NO** (`JobCardsPage.tsx` uses mock data) | **DORMANT** |
| `spare_parts` | Yes | Yes | `GET/POST /api/data/spare-parts` | **NO** (`SparePartsPage.tsx` uses mock data) | **DORMANT** |
| `service_history` | Yes | Yes | `GET/POST /api/data/service-history`, `/api/kpis` | **PARTIAL** (Touched by `/api/kpis` count, but `ServiceHistoryPage.tsx` uses mock data) | **DORMANT** |
| `billing` | Yes | Yes | `GET/POST /api/data/billing` | **NO** (`BillingPage.tsx` uses mock data) | **DORMANT** |
| `branches` | Yes | Yes | `GET/POST /api/data/branches` | **NO** (`BranchesPage.tsx` uses mock data) | **DORMANT** |

---

## Step 6: Final Delete & Remediation Plan

### A. SAFE TO DELETE
The following generated client files and functions have no callers and can be safely deleted without affecting application functionality:

1. **Unused Generated Frontend Client Hook**:
   - **File**: [`fronted/src/api/generated/api.ts:68-85`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/fronted/src/api/generated/api.ts#L68-L85)
   - **Functions**: `useHealthCheck`, `getHealthCheckQueryOptions`, `getHealthCheckQueryKey`
   - **Related files**: Can remove `api.ts` and `api.schemas.ts` or regenerate once the OpenAPI specification reflects the actual API.

*(Note: No backend routes or database tables are marked as unconditionally SAFE TO DELETE yet, because the dormant module endpoints correspond to active UI pages in the demo that are simply pending wiring).*

---

### B. NEEDS YOUR REVIEW (Decision Required)

1. **Dormant Resource Routes for 7 Modules**:
   - **Routes**: `GET/POST` for `/api/data/vehicles`, `service-jobs`, `job-cards`, `spare-parts`, `service-history`, `billing`, and `branches`.
   - **Tables**: `vehicles`, `job_cards`, `spare_parts`, `billing`, `branches`.
   - **Why review**: 
     - *Option 1 (Recommended)*: **Keep and wire frontend**: Update `VehiclesPage`, `ServiceJobsPage`, `JobCardsPage`, etc., to use `useModuleData(moduleKey)` instead of `initialRows[moduleKey]`. This turns the static demo into a fully functional database-backed app.
     - *Option 2 (Strip to Minimal)*: **Delete**: If this prototype is only meant to demo Appointments and Customers, delete the 7 unused tables and restrict `validModules` in [`backend/src/db/repositories/moduleRepository.ts`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/db/repositories/moduleRepository.ts#L22) to `['appointments', 'customers']`.
2. **`/api/kpis` Aggregation Endpoint**:
   - **Why review**:
     - *Option 1 (Recommended)*: **Keep and wire**: Connect `fronted/src/pages/Dashboard.tsx` to query `/api/kpis` instead of using the hardcoded array.
     - *Option 2*: **Delete**: If the dashboard will remain a static visual mock, delete `/api/kpis` and [`kpiController.ts`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/controllers/kpiController.ts) / [`kpiService.ts`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/services/kpiService.ts).

---

### C. KEEP BUT FIX (Used Routes with Risk Flags)

| Route | Current Risk Flags | Required Remediation |
|---|---|---|
| `GET /api/data/appointments` | No auth, no branch scoping, customer PII exposed | 1. Add authentication middleware.<br>2. Add `branch_id` query filter and verify user belongs to branch.<br>3. Enforce default pagination limit (e.g. `limit=50`). |
| `POST /api/data/appointments` | No auth, no branch verification | 1. Add authentication middleware.<br>2. Validate user role (e.g., service advisor / admin).<br>3. Automatically bind record to authenticated user's `branch_id`. |
| `GET /api/data/customers` | No auth, unmasked PII (phone & email) | 1. Add authentication middleware.<br>2. Restrict visibility based on branch context.<br>3. Mask phone numbers / emails for non-admin roles. |
| `POST /api/data/customers` | No auth, open writes | 1. Add authentication middleware.<br>2. Add rate limiting on customer creation to prevent spam. |
| `GET /api/healthz` | Public endpoint | 1. Ensure it only returns `{ status: "ok" }` and never leaks database connection credentials or internal system diagnostics. |

---

## Summary Counts

| Metric | Count | Details |
|---|---|---|
| **Total Express Routes** | **4** | `/api/healthz`, `/api/data/:module` (GET), `/api/data/:module` (POST), `/api/kpis` |
| **Total Concrete Endpoints** | **19** | 1 health check + 1 KPI endpoint + (9 GET + 9 POST module resources) |
| **Used Endpoints** | **5** | `/api/healthz`, GET/POST `appointments`, GET/POST `customers` |
| **Unused Endpoints** | **14** | `/api/kpis`, plus GET/POST for 7 dormant modules (`vehicles`, `service-jobs`, `job-cards`, `spare-parts`, `service-history`, `billing`, `branches`) |
| **Duplicate Routes** | **0** | No redundant duplicate routes found |
| **Debug / Test Routes** | **0** | No mock or debug-only routes present in production code |
| **Orphan Routes** | **0** | All handlers and controllers link to valid tables and logic |
| **Risky Routes** | **3 of 4** | All data-access routes lack authentication, RBAC, and branch multi-tenancy checks |
| **Missing Routes** | **0** | No calls from the React app fail due to missing routes |
| **Hardcoded Frontend Screens** | **15** | 12 pages + AppShell header + Login + RecordDialog fallback |
