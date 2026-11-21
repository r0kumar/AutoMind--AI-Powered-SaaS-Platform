import test, { describe, before, after } from "node:test";
import assert from "node:assert";
import type { Server } from "node:http";
import app from "../src/app";
import { closeDb } from "../src/db";

let server: Server;
let baseUrl: string;

before(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address();
      if (address && typeof address === "object") {
        baseUrl = `http://127.0.0.1:${address.port}`;
      }
      resolve();
    });
  });
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
  await closeDb();
});

describe("Backend API Integration Tests", () => {
  test("GET /api/healthz returns 200 and security headers", async () => {
    const res = await fetch(`${baseUrl}/api/healthz`);
    assert.strictEqual(res.status, 200);

    // Verify security headers
    assert.strictEqual(res.headers.get("x-content-type-options"), "nosniff");
    assert.strictEqual(res.headers.get("x-frame-options"), "DENY");

    const body = (await res.json()) as { status: string };
    assert.strictEqual(body.status, "ok");
  });

  test("GET /api/kpis returns 200 with valid KPI metrics", async () => {
    const res = await fetch(`${baseUrl}/api/kpis`);
    assert.strictEqual(res.status, 200);

    const body = (await res.json()) as {
      appointments: number;
      activeServices: number;
      completedServices: number;
      revenue: string;
      customers: number;
    };

    assert.strictEqual(typeof body.appointments, "number");
    assert.strictEqual(typeof body.activeServices, "number");
    assert.strictEqual(typeof body.completedServices, "number");
    assert.strictEqual(typeof body.customers, "number");
    assert.strictEqual(typeof body.revenue, "string");
  });

  test("GET /api/data/:module returns 200 array for a valid module", async () => {
    const res = await fetch(`${baseUrl}/api/data/appointments`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.ok(Array.isArray(body), "Expected body to be an array of records");
  });

  test("GET /api/data/:module with invalid module returns 400 Bad Request", async () => {
    const res = await fetch(`${baseUrl}/api/data/unknown-module-xyz`);
    assert.strictEqual(res.status, 400);

    const body = (await res.json()) as {
      status: string;
      statusCode: number;
      message: string;
    };
    assert.strictEqual(body.status, "error");
    assert.strictEqual(body.statusCode, 400);
    assert.ok(body.message.includes("Invalid module name"));
  });

  test("POST /api/data/:module creates and returns 201 created record", async () => {
    const payload = {
      name: "Test Customer Record",
      detail: "test@example.com",
      status: "Active",
    };

    const res = await fetch(`${baseUrl}/api/data/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    assert.strictEqual(res.status, 201);
    const body = (await res.json()) as {
      id: string;
      name: string;
      detail: string;
      status: string;
    };

    assert.ok(body.id, "Expected generated record id");
    assert.strictEqual(body.name, "Test Customer Record");
    assert.strictEqual(body.detail, "test@example.com");
    assert.strictEqual(body.status, "Active");
  });

  test("GET unknown route returns standardized 404 error", async () => {
    const res = await fetch(`${baseUrl}/nonexistent-path`);
    assert.strictEqual(res.status, 404);

    const body = (await res.json()) as {
      status: string;
      statusCode: number;
      message: string;
    };
    assert.strictEqual(body.status, "error");
    assert.strictEqual(body.statusCode, 404);
    assert.ok(body.message.includes("Route not found"));
  });
});
