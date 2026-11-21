# AutoMind AI

> **Enterprise Vehicle Service Management & Workshop Intelligence Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61dafb.svg?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-24%2B-green.svg?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791.svg?logo=postgresql)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-c5f74f.svg)](https://orm.drizzle.team/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AutoMind AI is a modern PERN-stack (PostgreSQL, Express, React, Node.js) platform built inside a high-performance **pnpm monorepo**. It centralizes the entire automotive workshop workflow—from customer appointment scheduling and digital repair cards to workshop bay Kanban queues, spare parts inventory tracking, and multi-branch network analytics.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Status](#project-status)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Provisioning & Seeding](#database-provisioning--seeding)
  - [Running Locally](#running-locally)
- [Scripts](#scripts)
- [Testing](#testing)
- [Security & Production Notes](#security--production-notes)
- [Roadmap](#roadmap)
- [Screenshots](#screenshots)
- [Contributing & License](#contributing--license)
- [Author](#author)

---

## Overview

### The Problem
Automotive dealerships, multi-brand service centers, and commercial fleet garages face persistent operational bottlenecks:
- **Paper-based, disconnected inspection sheets**: Communication breakdowns between technicians in the bays, service advisors at front desks, and vehicle owners.
- **Siloed multi-branch operations**: Regional executives lack unified, real-time visibility into bay utilization, technician productivity, and spare part inventory shortages across branches.
- **Delayed customer approvals**: Estimates shared over phone calls lead to delayed approvals, bay congestion, and lower vehicle turnaround speed.

### How AutoMind AI Solves It
AutoMind AI establishes a unified operational cockpit:
1. **Digital Intake & Booking**: Real-time appointment scheduling with intake notes, customer records, and vehicle assignment.
2. **Visual Workshop Floor Control**: Live service job status tracking across technician bays from inspection through delivery.
3. **Transparent Digital Job Cards**: Standardized inspection checklists and digital cost estimation.
4. **Multi-Branch Benchmarking**: Aggregated intelligence comparing service bay utilization, revenue, and customer retention across garage locations.

---

## Features

AutoMind AI features 11 dedicated functional views:

1. **Executive Dashboard (`/dashboard`)**: The operational pulse of the garage network—KPI summary metrics (Appointments, Active Services, Completed Services, Revenue, Total Customers), revenue velocity charts, and active service queue previews.
2. **Appointments Scheduling (`/appointments`)**: Dynamic bay scheduling with timeline and agenda views, search filtering, branch assignment, and direct booking modal.
3. **Customer Directory / CRM (`/customers`)**: Comprehensive vehicle owner profiles, contact details, retention watchlist (churn risk intervals), and quick-action communication triggers.
4. **Vehicle Registry (`/vehicles`)**: License plate and VIN tracking, model year index, and preventive service interval health indicators (`Due soon`, `In service`, `Healthy`, `Overdue`).
5. **Service Jobs Kanban (`/service-jobs`)**: Stage-based workshop floor queue (`Pending`, `In Progress`, `Quality Check`, `Ready for Delivery`) with bay number and technician assignment.
6. **Digital Job Cards (`/job-cards`)**: Technician diagnostic cards with repair orders, labor cost estimates, and real-time approval status badges.
7. **Spare Parts Inventory (`/spare-parts`)**: SKU tracking, supplier cataloging, stock depletion warnings (`Healthy`, `Low stock`, `Critical`), and replenishment monitoring.
8. **Service History (`/service-history`)**: Permanent electronic health records for every vehicle serviced across the network, including technician notes and historic invoices.
9. **Billing & Invoicing (`/billing`)**: Invoice creation, payment tracking across channels (UPI, Card, Cash), and financial status flags (`Paid`, `Pending`, `Overdue`).
10. **Multi-Branch Network (`/branches`)**: Executive multi-site performance dashboard tracking bay utilization rates, revenue output, and productivity ranking across 12 branch locations.
11. **Intelligence & Management Suite**:
    - **Analytics (`/analytics`)**: Turnaround time distribution, technician efficiency, and revenue trend visualizations.
    - **AI Insights (`/ai-insights`)**: Automated alerts for impending parts shortages, customer churn risk, and bay bottlenecks.
    - **Reports (`/reports`)**: Tax reports, revenue statements, and parts consumption log generation.
    - **Settings (`/settings`)**: Workshop preferences, operational hours, branch settings, and account management.

---

## Project Status

> [!NOTE]
> AutoMind AI is currently an active prototype/demo. The backend database and API layer support all 9 core workshop entities, while the frontend is progressively transitioning from mock fallbacks to live API data.

| View / Module | Route | Backend Table Exists | Seeded in DB | Frontend Data Source | Status |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Appointments** | `/appointments` | Yes (`appointments`) | Yes | Live API (`GET/POST /api/data/appointments`) | **Fully Connected** |
| **Customers** | `/customers` | Yes (`customers`) | Yes | Live API (`GET/POST /api/data/customers`) | **Fully Connected** |
| **Overview Dashboard** | `/dashboard` | Aggregated | Yes | Static Mock KPIs (Pending wire to `/api/kpis`) | Mock Data |
| **Vehicles** | `/vehicles` | Yes (`vehicles`) | Yes | `mockData.ts` (API wiring pending) | Mock Data |
| **Service Jobs** | `/service-jobs` | Yes (`service_jobs`) | Yes | `mockData.ts` (API wiring pending) | Mock Data |
| **Digital Job Cards** | `/job-cards` | Yes (`job_cards`) | Yes | `mockData.ts` (API wiring pending) | Mock Data |
| **Spare Parts** | `/spare-parts` | Yes (`spare_parts`) | Yes | `mockData.ts` (API wiring pending) | Mock Data |
| **Billing** | `/billing` | Yes (`billing`) | Yes | `mockData.ts` (API wiring pending) | Mock Data |
| **Service History** | `/service-history` | Yes (`service_history`) | Yes | `mockData.ts` (API wiring pending) | Mock Data |
| **Branches** | `/branches` | Yes (`branches`) | Yes | `mockData.ts` (API wiring pending) | Mock Data |
| **Analytics / AI / Reports** | `/analytics`, etc. | Aggregated | N/A | Static Mock UI Charts | Mock Data |

---

## Tech Stack

All versions are extracted directly from `pnpm-workspace.yaml`, `backend/package.json`, and `fronted/package.json`:

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `19.1.0` | Declarative component UI |
| **Frontend Build Tool** | Vite | `^7.3.2` | Fast HMR dev server & client bundler |
| **Styling** | Tailwind CSS | `^4.1.14` | Modern CSS-first utility styling |
| **Server State** | TanStack React Query | `^5.90.21` | Client-side query caching & async mutations |
| **Client Routing** | Wouter | `^3.3.5` | Minimalist routing engine (~1.5KB) |
| **Icons & UI Primitives** | Lucide React / Radix UI | `^0.545.0` / `^1.2` | Accessible toasts, tooltips, and iconography |
| **Charts & Motion** | Recharts / Framer Motion | `^2.15.2` / `^12.23` | Operational charts and micro-interactions |
| **Backend Runtime** | Node.js | `>= 20.0.0` (ESM) | Server execution environment |
| **HTTP Framework** | Express | `^5.2.1` | REST API routing and middleware pipeline |
| **Database ORM** | Drizzle ORM | `^0.45.2` | Type-safe SQL query builder |
| **Database Migrations** | Drizzle Kit | `^0.31.10` | Database schema migrations and Drizzle Studio |
| **Database Driver** | node-postgres (`pg`) | `^8.22.0` | Connection pool manager for PostgreSQL |
| **Schema Validation** | Zod | `^3.25.76` | Runtime request body, param, and query validation |
| **Logging** | Pino & Pino-HTTP | `^9.14.0` / `^10.5` | Fast, low-overhead structured JSON logging |
| **Bundler & Compiler** | esbuild / tsx | `0.27.3` / `^4.21` | Production backend bundler & test executor |
| **Monorepo Manager** | pnpm | `12.9.1` (catalog) | Workspace package dependency manager |
| **Database** | PostgreSQL | `18` (compatible 14+) | Persistent relational data store |

---

## System Architecture

The backend implements a clean, layered architecture ensuring separation of concerns:

```
[ Client Request (Browser / API Client) ]
                   │
                   ▼
       [ Express Middleware Stack ]
       ├── Security Headers (nosniff, frameguard, STS)
       ├── CORS Protection
       ├── Pino Request Logging (Correlation IDs)
       └── Cache-Control: no-store (Disabled ETags for API)
                   │
                   ▼
         [ Express 5 Routers ]
         ├── Input Validation (Zod Middleware)
         └── Async Handler (Promise Rejection Safety)
                   │
                   ▼
         [ Controllers (HTTP Layer) ]
         └── Request Parsing & HTTP Status Codes (200, 201, 400, 404)
                   │
                   ▼
         [ Services (Business Layer) ]
         └── Business Logic, Default Generation & Module Routing
                   │
                   ▼
       [ Repositories (Data Access Layer) ]
       └── Type-Safe Drizzle ORM Queries & SQL Execution
                   │
                   ▼
         [ PostgreSQL Connection Pool ]
         └── Single shared pg.Pool instance (max 20 connections)
```

### `app.ts` vs `index.ts` Separation
- **`backend/src/app.ts`**: Configures Express, middleware, CORS, body parsers, routes, and centralized error handlers without binding to a port. This enables the integration test suite (`test/api.test.ts`) to import and boot the app on ephemeral ports (`listen(0)`) without port collision.
- **`backend/src/index.ts`**: The operational bootstrap file. Reads the environment port, starts the listener, triggers the automatic seed verification, and registers `SIGTERM`/`SIGINT` graceful shutdown hooks to drain in-flight requests and cleanly close the database pool.

---

## Folder Structure

> [!IMPORTANT]
> In accordance with the workspace configuration, the frontend folder is named **`fronted`**.

```text
AutoMind-AI/
├── backend/                             # Express 5 & PostgreSQL Backend
│   ├── src/
│   │   ├── config/                      # Validated environment configuration (Zod)
│   │   ├── controllers/                 # HTTP controllers (kpis, modules)
│   │   ├── db/                          # Database connection pool & Drizzle ORM
│   │   │   ├── repositories/            # SQL data access methods (moduleRepository.ts)
│   │   │   ├── schema/                  # PostgreSQL table schemas (index.ts)
│   │   │   └── seed.ts                  # Auto-seeding script with default records
│   │   ├── middlewares/                 # Security, logging, validation & errorHandler
│   │   ├── routes/                      # Route definitions (health, kpis, modules)
│   │   ├── schema/                      # Zod validation schemas (moduleSchema.ts)
│   │   ├── services/                    # Business logic (kpiService, moduleService)
│   │   ├── app.ts                       # Express setup (testable app instance)
│   │   └── index.ts                     # Server bootstrap with graceful shutdown
│   ├── test/                            # Integration test suite (api.test.ts)
│   ├── build.mjs                        # esbuild bundling script for production
│   ├── drizzle.config.ts                # Drizzle Kit migration and Studio configuration
│   ├── package.json                     # Backend scripts and dependencies
│   └── tsconfig.json                    # Backend TypeScript configuration
├── fronted/                             # React 19 + Vite Frontend (named "fronted")
│   ├── public/                          # Static assets (logo.png, favicon.png)
│   ├── src/
│   │   ├── api/                         # HTTP client (custom-fetch.ts)
│   │   ├── components/
│   │   │   ├── layout/                  # Sidebar, Navbar, MobileNav, AppShell
│   │   │   ├── shared/                  # Active shared UI (Button, Modal, Badges, etc.)
│   │   │   └── ui/                      # Base UI wrappers (card, toast, toaster, tooltip)
│   │   ├── data/                        # Static fallback data (mockData.ts)
│   │   ├── hooks/                       # useModuleData, useToast
│   │   ├── pages/                       # All 15 application view components
│   │   ├── App.tsx                      # Wouter routing & QueryClientProvider
│   │   ├── index.css                    # Tailwind CSS v4 stylesheets
│   │   └── main.tsx                     # React DOM root entrypoint
│   ├── package.json                     # Frontend scripts and dependencies
│   ├── tsconfig.json                    # Frontend TypeScript configuration
│   └── vite.config.ts                   # Vite configuration with /api reverse proxy
├── package.json                         # Monorepo root workspace scripts
├── pnpm-lock.yaml                       # Strict locked dependency graph
├── pnpm-workspace.yaml                  # Monorepo workspace & catalog definition
└── tsconfig.base.json                   # Shared TypeScript base configuration
```

---

## Database Schema

AutoMind AI utilizes **PostgreSQL** managed by **Drizzle ORM**. The data model consists of 9 core tables that store operational workshop entities:

1. `appointments` — Customer bay service appointments and schedules.
2. `customers` — Customer directory and CRM profiles.
3. `vehicles` — Registered customer vehicle records.
4. `service_jobs` — Active workshop floor service jobs.
5. `job_cards` — Technician digital job cards and estimates.
6. `spare_parts` — Parts catalog and stock inventory.
7. `service_history` — Historic vehicle maintenance logs.
8. `billing` — Customer invoices and payments.
9. `branches` — Service centers and branch metadata.

### Shared Schema Design
All 9 tables share a consistent, generic record structure designed for rapid module extension:

```sql
CREATE TABLE <module_table> (
  id VARCHAR(64) PRIMARY KEY,
  name TEXT NOT NULL,
  detail TEXT NOT NULL,
  meta TEXT NOT NULL,
  status TEXT NOT NULL,
  amount TEXT NULL,
  secondary TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## API Reference

Base URL in local development: `http://localhost:3001` (or via Vite proxy at `http://localhost:5173`)

### 1. Health Check
Checks backend server liveness and validates security headers.
- **Method**: `GET`
- **Path**: `/api/healthz`
- **Response `200 OK`**:
```json
{
  "status": "ok"
}
```

### 2. High-Level KPIs
Calculates real-time count metrics across all branches for appointments, active jobs, completed jobs, and customer relationships.
- **Method**: `GET`
- **Path**: `/api/kpis`
- **Response `200 OK`**:
```json
{
  "appointments": 5,
  "activeServices": 4,
  "completedServices": 3,
  "revenue": "₹24.8L",
  "customers": 4
}
```

### 3. List Module Records
Returns a paginated list of records from any of the 9 database tables ordered by `created_at DESC`.
- **Method**: `GET`
- **Path**: `/api/data/:module`
- **Route Params**:
  - `module` (string, required): One of `appointments`, `customers`, `vehicles`, `service-jobs`, `job-cards`, `spare-parts`, `service-history`, `billing`, `branches`.
- **Query Params**:
  - `limit` (integer, optional): Maximum records to return (`1` to `1000`).
  - `offset` (integer, optional): Records to skip (`>= 0`).
- **Example Request**:
  `GET /api/data/customers?limit=2&offset=0`
- **Response `200 OK`**:
```json
[
  {
    "id": "cus-001",
    "name": "Ananya Mehta",
    "detail": "ananya.mehta@email.com",
    "meta": "4 vehicles · 12 visits",
    "status": "Active",
    "amount": null,
    "secondary": "+91 98765 42108",
    "createdAt": "2026-10-07T13:16:10.996Z"
  },
  {
    "id": "cus-002",
    "name": "Rohan Kapoor",
    "detail": "rohan.kapoor@email.com",
    "meta": "2 vehicles · 8 visits",
    "status": "Active",
    "amount": null,
    "secondary": "+91 98201 11940",
    "createdAt": "2026-10-07T13:16:10.996Z"
  }
]
```

### 4. Create Module Record
Creates and returns a new record in the specified module table.
- **Method**: `POST`
- **Path**: `/api/data/:module`
- **Route Params**: `module` (same as above)
- **Request Body (JSON)**:
```json
{
  "name": "Rajesh Sharma",
  "detail": "rajesh.sharma@email.com",
  "meta": "1 vehicle · 1 visit",
  "status": "Active",
  "secondary": "Andheri West"
}
```
- **Response `201 Created`**:
```json
{
  "id": "cus-1795251234567",
  "name": "Rajesh Sharma",
  "detail": "rajesh.sharma@email.com",
  "meta": "1 vehicle · 1 visit",
  "status": "Active",
  "amount": null,
  "secondary": "Andheri West",
  "createdAt": "2026-11-21T09:27:03.102Z"
}
```

### Error Responses
All errors return a standardized JSON structure:
- **`400 Bad Request`** (Invalid module name or schema validation failure):
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "[{\"path\":[\"module\"],\"message\":\"Invalid module name\"}]"
}
```
- **`404 Not Found`** (Route or resource does not exist):
```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Cannot GET /api/unknown-endpoint"
}
```
- **`500 Internal Server Error`** (Unexpected server crash, database down):
```json
{
  "status": "error",
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Getting Started

### Prerequisites
Before starting, ensure you have the following installed on your machine:
- **Node.js**: `v20.0.0` or higher (`v24.x` recommended)
- **pnpm**: `v9.0.0` or higher (`v12.x` catalog configured)
- **PostgreSQL**: `v14.0` or higher (`v18.x` verified)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/r0kumar/AutoMind-AI.git
   cd AutoMind-AI
   ```
2. Install workspace dependencies:
   ```bash
   pnpm install
   ```

### Environment Setup
Create environment files from the provided templates:

1. **Backend Configuration**:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Configure the following variables in `backend/.env`:
   - `PORT`: HTTP listener port (defaults to `3001`).
   - `DATABASE_URL`: PostgreSQL connection URL (e.g., `postgresql://postgres:password@127.0.0.1:5432/automind`).
   - `NODE_ENV`: Runtime mode (`development`, `production`, or `test`).
   - `LOG_LEVEL`: Pino logger verbosity (`info`, `debug`, `warn`, `error`).
   - `CORS_ORIGIN`: Allowed origins for cross-origin requests (e.g., `http://localhost:5173`).

2. **Frontend Configuration**:
   ```bash
   cp fronted/.env.example fronted/.env
   ```
   Configure the following variables in `fronted/.env`:
   - `PORT`: Vite development server port (defaults to `5173`).
   - `BASE_PATH`: Client asset deployment base path (`/`).
   - `VITE_API_URL`: Target backend proxy destination (`http://localhost:3001`).

### Database Provisioning & Seeding
1. Ensure your PostgreSQL server is running and create the `automind` database:
   ```sql
   CREATE DATABASE automind;
   ```
2. Push the Drizzle schema to PostgreSQL:
   ```bash
   pnpm --filter backend run db:push
   ```
3. **Automatic Seeding**:
   Seeding is handled automatically. When the backend boots, `seedDatabase()` in `backend/src/db/seed.ts` checks if `appointmentsTable` has rows. If empty, it automatically inserts initial seed data for all 9 tables.

### Running Locally
Run both frontend and backend concurrently from the monorepo root:
```bash
pnpm run dev
```

Alternatively, run each service independently:
- **Backend only**:
  ```bash
  pnpm run dev:backend
  ```
  API runs on `http://localhost:3001`
- **Frontend only**:
  ```bash
  pnpm run dev:fronted
  ```
  UI runs on `http://localhost:5173`

---

## Scripts

Useful scripts available in the workspace:

| Command | Working Directory | Description |
| :--- | :--- | :--- |
| `pnpm run dev` | Root | Concurrently runs backend (`:3001`) and frontend (`:5173`) in watch mode |
| `pnpm run dev:backend` | Root | Starts the backend development server |
| `pnpm run dev:fronted` | Root | Starts the Vite frontend development server |
| `pnpm run build` | Root | Typechecks workspace and builds both backend (esbuild) and frontend (Vite) |
| `pnpm run typecheck` | Root | Runs `tsc --noEmit` across all workspace packages |
| `pnpm run test` | Root | Runs the test suites across all packages |
| `pnpm --filter backend run test` | `backend/` | Runs native integration tests with Node test runner |
| `pnpm --filter backend run db:push` | `backend/` | Pushes Drizzle schema directly to PostgreSQL |
| `pnpm --filter backend run db:push-force` | `backend/` | Force-pushes schema changes bypassing interactive prompts |
| `pnpm --filter backend exec drizzle-kit studio` | `backend/` | Launches Drizzle Studio database GUI on `http://127.0.0.1:4983` |

---

## Testing

The backend includes an integration test suite built with the native Node.js test runner (`node:test` and `node:assert` via `tsx`).

Run backend integration tests:
```bash
pnpm --filter backend test
```

### What the Test Suite Covers:
- `GET /api/healthz`: Verifies HTTP 200 and security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`).
- `GET /api/kpis`: Verifies KPI metrics structure and numeric types.
- `GET /api/data/:module`: Verifies array responses for valid module tables.
- `GET /api/data/:module` (invalid): Verifies schema validation throws `400 Bad Request`.
- `POST /api/data/:module`: Verifies creation, database insertion, and `201 Created` payload.
- `GET /nonexistent`: Verifies centralized fallback handler outputs standardized `404 Not Found`.
- **Database Teardown**: Ensures the PostgreSQL connection pool closes cleanly after test suites complete.

---

## Security & Production Notes

### What Exists
- **Input Validation**: Strict Zod schemas guard route parameters (`moduleParamSchema`), query pagination (`limit <= 1000`, `offset >= 0`), and body payloads.
- **SQL Injection Prevention**: All queries execute through Drizzle ORM's parameterized SQL builder; no string concatenation is used.
- **Security Headers**: Custom middleware applies `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, and `Strict-Transport-Security`.
- **Cache Invalidation**: Explicit `Cache-Control: no-store` prevents caching dynamic data as `304 Not Modified`.
- **Error Sanitization**: Central error handler shields database internal errors and stack traces from reaching clients.
- **Structured Logging**: Pino structured logger with production log levels and request duration tracking.

### Known Gaps & Prototype Status
> [!WARNING]
> AutoMind AI is currently an evaluation prototype and **is not production-ready as-is**. The following gaps must be addressed prior to commercial deployment:
> 1. **No Authentication**: Routes have no JWT or session verification. Any client can read or write to `/api/data/*`.
> 2. **No Role-Based Access Control (RBAC)**: No role distinction exists between Workshop Managers, Technicians, Receptionists, and Customers.
> 3. **No Multi-Tenant Isolation**: Records are not isolated by `branch_id` or `tenant_id`. Any user can view all branches' records.
> 4. **Unencrypted PII**: Customer contact numbers and email addresses are stored as plain text without encryption at rest or masking.

---

## Roadmap

- [ ] **Wire Remaining Views**: Connect Vehicles, Service Jobs, Job Cards, Spare Parts, Billing, Service History, and Branches to live `/api/data/:module` endpoints.
- [ ] **Dynamic Dashboard KPIs**: Wire the overview dashboard metrics and chart series directly to `/api/kpis`.
- [ ] **Authentication & RBAC**: Implement secure session or JWT authentication with role authorization (`Admin`, `Manager`, `Technician`, `Advisor`).
- [ ] **Multi-Tenant Branch Isolation**: Enforce `branch_id` scoping across all database queries and repository operations.
- [ ] **Schema Normalization**: Replace generic text columns with typed columns, foreign keys (`customer_id`, `vehicle_id`, `branch_id`), and constraints.
- [ ] **Database Indexing**: Add database indexes on `created_at`, `status`, and foreign key columns for high-scale query performance.
- [ ] **Live WebSockets**: Enable real-time Kanban board updates when technicians transition job cards between service bays.

---

## Screenshots

<!-- Add screenshots to docs/screenshots/ -->

| Overview Dashboard | Service Jobs Kanban |
| :---: | :---: |
| *Dashboard Screenshot Placeholder* | *Kanban Screenshot Placeholder* |

| Digital Job Cards | Customer CRM Directory |
| :---: | :---: |
| *Job Cards Screenshot Placeholder* | *CRM Directory Screenshot Placeholder* |

---

## Contributing & License

Contributions are welcome! Please follow these guidelines:
1. Fork the repository and create a feature branch (`git checkout -b feat/my-feature`).
2. Run `pnpm run typecheck` and `pnpm run test` before committing.
3. Commit your changes with clear semantic messages (`git commit -m "feat: add vehicle lookup by VIN"`).
4. Push to your branch and submit a Pull Request.

### License
This project is licensed under the **MIT License** — see the root [package.json](file:///package.json) for details.  
*(TODO: Update license terms if a proprietary or custom commercial license is selected).*

---

## Author

- **Rohit Kumar**
  - GitHub: [@r0kumar](https://github.com/r0kumar)
  - Project: [AutoMind AI](https://github.com/r0kumar/AutoMind-AI)
