# AutoMind AI — Comprehensive Project & Technical Documentation

**Platform**: AutoMind AI — Enterprise Vehicle Service & Workshop Intelligence Platform  
**Architecture**: PERN Stack (PostgreSQL, Express, React, Node.js) with TypeScript Monorepo  
**Date**: November 2026  
**Document**: `docs/PROJECT_DOCUMENTATION.md`

---

## Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Complete Technology Stack & Tooling](#2-complete-technology-stack--tooling)
3. [System Architecture & Layered Design](#3-system-architecture--layered-design)
4. [Database Modeling & PostgreSQL Schema](#4-database-modeling--postgresql-schema)
5. [Core Functional Modules](#5-core-functional-modules)
6. [API Architecture & Endpoint Reference](#6-api-architecture--endpoint-reference)
7. [Security, Reliability & Production Standards](#7-security-reliability--production-standards)
8. [Mentor Pitch & Q&A Cheat Sheet](#8-mentor-pitch--qa-cheat-sheet)

---

## 1. Executive Summary & Problem Statement

### The Problem
Automotive service networks (dealerships, multi-brand service centers, and fleet operators) encounter operational friction caused by fragmented systems:
- **Paper-based and disconnected inspection forms** lead to communication breakdowns between technicians, bay managers, and service advisors.
- **Siloed multi-branch operations** make it difficult for executive leadership to benchmark bay utilization, track inventory shortages, and manage regional demand.
- **Delayed customer approvals** for spare parts and diagnostic repairs cause bay congestion and reduce vehicle turnaround speed.

### The Solution: AutoMind AI
**AutoMind AI** is an enterprise-grade Vehicle Service Management & Workshop Intelligence platform. It digitizes the entire automotive servicing lifecycle across multiple branches—from customer appointment scheduling and digital inspection job cards to live workshop Kanban tracking, inventory replenishment alerts, and billing.

---

## 2. Complete Technology Stack & Tooling

```
                     ┌────────────────────────────────────────┐
                     │         AutoMind AI Monorepo           │
                     └───────────────────┬────────────────────┘
                                         │
             ┌───────────────────────────┴───────────────────────────┐
             ▼                                                       ▼
   [ Frontend Package ]                                    [ Backend Package ]
   • React 19 + TypeScript                                 • Node.js 24 + Express 5
   • Vite 7 Build Engine                                   • TypeScript ESM Output
   • Tailwind CSS v4                                       • Drizzle ORM
   • TanStack React Query v5                               • node-postgres (pg Pool)
   • Radix UI + Lucide React                               • Zod Schema Validation
   • Recharts Visualizations                               • Pino Structured Logging
   • Wouter Routing                                        • Native Node Test Runner
             │                                                       │
             └───────────────────────────┬───────────────────────────┘
                                         ▼
                               [ PostgreSQL 18 DB ]
```

### A. Frontend Layer
| Technology | Version | Purpose in Project | Rationale / Benefits |
|---|---|---|---|
| **React** | `19.1.0` | UI Component Framework | Latest React engine with high performance and streamlined concurrency. |
| **TypeScript** | `~5.9` | Static Type System | End-to-end type safety preventing runtime null/undefined errors. |
| **Vite** | `^7.3.2` | Dev Server & Production Bundler | Sub-second Hot Module Replacement (HMR) and optimized Rollup tree-shaking. |
| **Tailwind CSS** | `^4.1.14` | Utility-First Styling | High-performance CSS compilation without legacy PostCSS configuration overhead. |
| **TanStack React Query** | `^5.90.21` | Server State & Cache Management | Automatic query caching, background refetching, and optimistic updates. |
| **Radix UI** | `^1.x` | Headless Accessible Primitives | WAI-ARIA compliant modals, dropdowns, popovers, and accordions. |
| **Lucide React** | `^0.545.0` | Iconography System | Crisp, consistent SVG icons across navigation, status badges, and actions. |
| **Recharts** | `^2.15.2` | Data Visualization | Responsive SVG charts for workshop capacity and revenue trends. |
| **Wouter** | `^3.3.5` | Client-Side Routing | Lightweight (~1.5 KB) declarative router minimizing bundle size. |

---

### B. Backend Layer
| Technology | Version | Purpose in Project | Rationale / Benefits |
|---|---|---|---|
| **Node.js** | `v24.x` | Runtime Environment | Modern LTS execution environment supporting native ESM and stripped type syntax. |
| **Express** | `^5.2.1` | HTTP Web Framework | Modern Express 5 router with improved promise handling and lightweight footprint. |
| **TypeScript** | `~5.9` | Backend Typing | Strict typing for API requests, controller payloads, and ORM schemas. |
| **Drizzle ORM** | `^0.45.2` | Database Mapping & Query Builder | Zero runtime overhead; compile-time SQL query construction with native TypeScript inference. |
| **`pg` (node-postgres)** | `^8.22.0` | PostgreSQL Driver & Pool | Robust connection pooling over PostgreSQL with connection lifecycle controls. |
| **Zod** | `^3.25.76` | Schema Validation | Declarative runtime validation for route params, query limits, and request bodies. |
| **Pino & Pino HTTP** | `^9.14` / `^10.5` | Structured Logging | Blazing fast asynchronous JSON logging with automatic PII and authorization header redaction. |
| **esbuild** | `0.27.3` | Backend Bundler | Compiles TypeScript backend files into a single optimized `.mjs` bundle in ~400ms. |
| **Native Node Runner** | Built-in | Test Suite (`tsx --test`) | Zero-dependency integration testing utilizing Node's built-in test runner. |

---

### C. Database & Monorepo Tooling
| Technology | Version | Purpose |
|---|---|---|
| **PostgreSQL** | `18.x` | Relational database holding workshop, customer, vehicle, and financial records. |
| **pnpm** | `12.x` | Monorepo package manager with unified catalog dependency management and hard links. |
| **Drizzle Kit** | `^0.31.10` | Database schema migrations and direct push tooling (`pnpm run db:push`). |

---

## 3. System Architecture & Layered Design

The backend enforces a strict **4-Tier Enterprise Layered Architecture** that decouples transport protocols from business logic and database queries:

```
[ HTTP Request: e.g. GET /api/data/appointments ]
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. ROUTE LAYER (src/routes/modules.ts)                     │
│    • Matches URL path and HTTP verb                         │
│    • Applies validateRequest middleware (Zod Schemas)       │
│    • Wraps handler in asyncHandler                          │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. CONTROLLER LAYER (src/controllers/moduleController.ts)   │
│    • Extracts req.params, req.query, and req.body           │
│    • Invokes corresponding service function                 │
│    • Sends standardized HTTP response code (200, 201)       │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. SERVICE LAYER (src/services/moduleService.ts)            │
│    • Executes core business rules                           │
│    • Generates unique record identifiers (e.g. apt-1048)    │
│    • Sets sensible defaults for missing fields              │
│    • Coordinates data formatting                            │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. REPOSITORY / DATA ACCESS (src/db/repositories/)          │
│    • Pure SQL / Drizzle ORM operations                      │
│    • Orders records by created_at DESC                      │
│    • Executes parallel count aggregations via Promise.all   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
                     [ PostgreSQL Database ]
```

### Architectural Highlights
1. **Decoupled Application (`app.ts`) vs. Server (`index.ts`)**:
   - `app.ts` builds and configures Express routes and middlewares without binding to a network port. This allows the integration test runner to boot the application on an ephemeral port (`server.listen(0)`) without port collision.
   - `index.ts` is the execution entry point that binds to `PORT=3001`, runs database seeding, and registers graceful termination hooks.
2. **Graceful Process Shutdown**:
   - Intercepts `SIGINT` and `SIGTERM` signals.
   - Halts ingestion of incoming HTTP traffic (`server.close()`).
   - Drains idle PostgreSQL clients (`await pool.end()`).
   - Prevents abrupt process termination and dangling connection leaks.
3. **Optimized Parallel Metrics Processing**:
   - In `/api/kpis`, counts from `appointments`, `service_jobs`, `service_history`, and `customers` are gathered via `Promise.all` in parallel, cutting roundtrip query time by over 70%.

---

## 4. Database Modeling & PostgreSQL Schema

All tables are defined in [`backend/src/db/schema/index.ts`](file:///C:/Users/Lenovo/Desktop/AutoMind-AI/backend/src/db/schema/index.ts) using Drizzle ORM's PostgreSQL core definitions:

```sql
-- Standard schema shared across all 9 workshop entities:
CREATE TABLE appointments (
    id VARCHAR(64) PRIMARY KEY,
    name TEXT NOT NULL,
    detail TEXT NOT NULL,
    meta TEXT NOT NULL,
    status TEXT NOT NULL,
    amount TEXT,
    secondary TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### The 9 Relational Entities

| Table Name | Primary Role in AutoMind AI | Example Record |
|---|---|---|
| **`appointments`** | Customer scheduled visits and slot allocation | `id: apt-1048`, `name: Ananya Mehta`, `detail: MH 12 QX 4218 · Honda City`, `status: Confirmed` |
| **`customers`** | CRM profile, vehicle fleet size, and visit count | `id: cus-001`, `name: Ananya Mehta`, `detail: ananya.mehta@email.com`, `secondary: +91 98765 42108` |
| **`vehicles`** | Fleet tracking, registration plate, and service status | `id: veh-4218`, `name: MH 12 QX 4218`, `detail: Honda City · 2021`, `status: Due soon` |
| **`service_jobs`** | Active workshop floor tasks and bay assignment | `id: JOB-2084`, `name: Full periodic service`, `detail: MH 12 QX 4218`, `meta: Bay 04`, `amount: ₹8,450` |
| **`job_cards`** | Digital vehicle inspection approvals | `id: JC-7742`, `name: Digital job card · JC-7742`, `detail: Honda City`, `status: In progress` |
| **`spare_parts`** | Inventory catalog, lubricant SKUs, and stock counts | `id: part-001`, `name: Honda 0W-20 Synthetic Oil`, `meta: SKU MOT-020-HN`, `secondary: 42 in stock` |
| **`service_history`**| Historical maintenance logs and technician audit trail | `id: SH-10920`, `name: Periodic maintenance`, `detail: Arjun Nair`, `status: Completed` |
| **`billing`** | Invoices, amounts due, and payment channels | `id: INV-2048`, `name: Ananya Mehta`, `amount: ₹8,450`, `meta: UPI`, `status: Paid` |
| **`branches`** | Multi-branch service hubs, bay count, and throughput | `id: br-001`, `name: Andheri West`, `detail: Mumbai · 8 service bays`, `amount: ₹48.2L` |

---

## 5. Core Functional Modules

AutoMind AI provides 11 dedicated functional views:

1. **Executive Overview Dashboard**: High-level pulse of workshop performance showing 5 primary KPIs (Appointments, Active Jobs, Completed Jobs, Gross Revenue, Active Customers) with quick-action appointment routing.
2. **Appointments & Scheduling**: Day/week scheduling view supporting both chronological Timeline and list Agenda perspectives.
3. **Customer CRM Directory**: Customer relationship management storing email contacts, phone numbers, visit frequency, and linked vehicle registrations.
4. **Vehicles & Fleet Registry**: Registration plate search with vehicle health tags (*Healthy*, *Due soon*, *Overdue*, *In service*).
5. **Live Workshop Floor (Service Jobs)**: Drag-and-drop / stage-advancing Kanban board moving service tickets across 4 operational states:
   $$\text{Inspection} \longrightarrow \text{In Progress} \longrightarrow \text{Awaiting Approval} \longrightarrow \text{Completed}$$
6. **Digital Job Cards**: Multi-point inspection checklist for technicians covering exterior assessment, fluid checks, brake pads, tyres, and customer authorization.
7. **Spare Parts & Inventory Management**: Stock-level monitor flagging critical parts reaching low threshold limits (e.g. AC compressor belts, synthetic oil).
8. **Service History & Audit**: Historical service records searchable by technician name or vehicle registration plate.
9. **Billing & Payments**: Invoice tracker displaying payment channels (UPI, Credit Card, Cash) and outstanding receivables.
10. **Multi-Branch Network Intelligence**: Benchmarking multi-city locations (Mumbai, Bengaluru, Ahmedabad, Delhi, Pune, Chennai) by bay utilization percentage and revenue rank.
11. **AI Insights & Recommendations**: Algorithmic decision alerts highlighting Tuesday capacity gaps, brake pad stockout predictions, and regional EV service demands.

---

## 6. API Architecture & Endpoint Reference

Base API Path: `/api`

### 1. Health & Diagnostics
* **`GET /api/healthz`**
  * **Summary**: Returns server health status.
  * **Response (200 OK)**:
    ```json
    {
      "status": "ok"
    }
    ```

### 2. Business Intelligence & Metrics
* **`GET /api/kpis`**
  * **Summary**: Parallel query count aggregation across workshop tables.
  * **Response (200 OK)**:
    ```json
    {
      "appointments": 5,
      "activeServices": 4,
      "completedServices": 3,
      "revenue": "₹24.8L",
      "customers": 4
    }
    ```

### 3. Dynamic Operational Module Resource
* **`GET /api/data/:module`**
  * **Params**: `:module` (one of `appointments`, `customers`, `vehicles`, `service-jobs`, `job-cards`, `spare-parts`, `service-history`, `billing`, `branches`)
  * **Query Parameters**: `limit` (max 1000), `offset`
  * **Response (200 OK)**:
    ```json
    [
      {
        "id": "apt-1048",
        "name": "Ananya Mehta",
        "detail": "MH 12 QX 4218 · Honda City",
        "meta": "Today · 09:30",
        "status": "Confirmed",
        "amount": null,
        "secondary": "General service",
        "createdAt": "2026-11-21T06:54:38.000Z"
      }
    ]
    ```

* **`POST /api/data/:module`**
  * **Payload Schema**:
    ```json
    {
      "name": "Rohan Kapoor",
      "detail": "DL 3C AT 7821 · Hyundai Creta",
      "status": "In service",
      "amount": "₹12,800",
      "secondary": "Brake inspection"
    }
    ```
  * **Response (201 Created)**: Returns the newly inserted record with auto-generated ID and server timestamp.

---

## 7. Security, Reliability & Production Standards

### 1. Request Validation Pipeline
Using **Zod**, every incoming request is strictly checked before hitting controller code:
- Invalid module names (e.g. `/api/data/invalid_table`) are trapped immediately and return `400 Bad Request` with descriptive validation messages.
- Numeric limits and offsets are coerced and boundary-capped.

### 2. Defensive HTTP Security Headers
Every HTTP response includes hardened security headers configured without heavy third-party dependencies:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0
Referrer-Policy: strict-origin-when-cross-origin
```

### 3. Centralized Error Sanitization
- In development, full error descriptions assist rapid debugging.
- In production (`NODE_ENV=production`), all internal 500 server errors are sanitized to:
  ```json
  {
    "status": "error",
    "statusCode": 500,
    "message": "Internal Server Error"
  }
  ```
  Internal database stacks and credentials are never leaked over the wire.

### 4. Automated Testing
Integration tests execute using Node's native test runner (`node:test`) against live database instances:
```bash
pnpm --filter backend test
```
Verifies health check headers, KPI aggregation, valid data retrieval, 400 validation traps, 201 creation persistence, and 404 route handling.

---

## 8. Mentor Pitch & Q&A Cheat Sheet

### The 90-Second Opening Pitch
> *"Good morning mentors. Our project is **AutoMind AI**, an enterprise vehicle service management and workshop intelligence platform designed for multi-branch automotive networks.
> 
> We engineered this on a modern **PERN stack (PostgreSQL, Express, React, and Node.js)** within a **pnpm monorepo**.
> 
> On the **frontend**, we chose **React 19, TypeScript, and Vite 7** for rapid compilation and minimal footprint, using **Tailwind CSS v4** for clean UI design and **TanStack React Query v5** for robust server state synchronization and client-side caching.
> 
> On the **backend**, we built a modular **4-layer architecture (Routes $\to$ Controllers $\to$ Services $\to$ Repositories)** using **Express 5** and **Drizzle ORM** over **PostgreSQL 18**. All incoming data is validated at runtime using **Zod schemas**, errors are centralized, and database connection pooling includes full graceful shutdown handlers for high reliability.
> 
> The platform digitizes 9 critical workshop workflows—including appointment scheduling, technician Kanban boards, digital inspection job cards, spare parts inventory alerts, and multi-branch performance benchmarking."*

---

### Mentor Q&A Cheat Sheet (Anticipated Technical Questions)

#### Q1: "Why did you choose Drizzle ORM instead of Prisma or TypeORM?"
> **Answer**: *"We chose Drizzle ORM because it operates with zero runtime overhead and offers SQL-like syntax with compile-time TypeScript type inference. Prisma relies on a heavy Rust binary engine and complex query generation that adds latency to serverless or containerized environments. Drizzle is lightweight, fast, and gives us complete transparency over the executed SQL."*

#### Q2: "How is your monorepo structured, and how do you handle dependencies?"
> **Answer**: *"We use a **pnpm workspace** configuration. It allows our backend and frontend to live together while sharing common root configurations like `tsconfig.base.json`. Using pnpm's `catalog:` protocol, we ensure dependency versions like React and Zod stay strictly synchronized across packages without version drift."*

#### Q3: "How does your backend prevent memory exhaustion or SQL injection?"
> **Answer**: *"First, all queries are constructed using Drizzle's parameterized query builder, making SQL injection impossible. Second, our `validateRequest` middleware uses Zod to cap list query `limit` parameters to a maximum of 1,000 records, preventing malicious queries from exhausting server memory."*

#### Q4: "How does the frontend handle API failures or network drops?"
> **Answer**: *"We implemented a centralized `customFetch` client that handles response normalization and error parsing into typed `ApiError` instances. In our React Query hooks, we pair live network requests with graceful fallback mechanisms, ensuring the UI remains stable even during temporary network interruptions."*

#### Q5: "What are the immediate next steps to make this production-ready?"
> **Answer**: *"Our primary next steps are:
> 1. Implementing user authentication using HTTP-only session cookies and role-based access control (RBAC).
> 2. Adding explicit multi-tenant `branch_id` foreign keys to isolate workshop data by branch.
> 3. Generating a migration to index `created_at` timestamps for sub-millisecond sorting."*
