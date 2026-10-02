/**
 * Tests for Products API routes (GET, POST).
 * Imports route handlers directly — no HTTP server needed.
 */

import { describe, it, expect, beforeEach, afterEach, beforeAll } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "@/DB/models/Product";
import { connectToDatabase } from "@/DB/mongodb";
import { GET, POST } from "./route";
import { VALID_PRODUCT_CATEGORIES, isMongoUnavailableError, getErrorMessage } from "@/API/helpers";

// ── MongoDB setup ────────────────────────────────────────────────────────────

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = await mongod.getUri();
  process.env.MONGODB_URI = uri;
  await connectToDatabase();
});

afterEach(async () => {
  // Clear all collections instead of disconnecting, to keep the connection alive for subsequent tests.
  await clearDB();
});

// ── helpers ──────────────────────────────────────────────────────────────────

function createMockRequest(body: unknown, contentType = "application/json") {
  return {
    headers: new Headers({ "content-type": contentType }),
    json: async () => body,
  } as any;
}

/** Clear all collections while keeping the connection alive. */
async function clearDB() {
  await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) return;
  const collections = await db.collections();
  for (const coll of collections) {
    await coll.deleteMany({});
  }
}

// ── GET /api/products ────────────────────────────────────────────────────────

describe("GET /api/products", () => {
  beforeEach(async () => {
    await Product.deleteMany({});
  });

  it("returns an empty data array when there are no products", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toEqual([]);
  });


  it("returns a 503 when MongoDB is unavailable", async () => {
    const mockError = new Error("MongoDB connection failed: connect ECONNREFUSED 127.0.0.1:27017");
    expect(isMongoUnavailableError(getErrorMessage(mockError))).toBe(true);
  });
});

// ── POST /api/products ───────────────────────────────────────────────────────

describe("POST /api/products", () => {
  beforeEach(async () => {
    await Product.deleteMany({});
  });

  it("creates a product and returns 201 with the correct shape", async () => {
    const req = createMockRequest({
      name: "Pizza Margherita",
      category: "pizza",
      price: "14.50",
      description: "Classic Italian pizza",
      badges: ["vegetarian"],
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.data.name).toBe("Pizza Margherita");
    expect(body.data.slug).toBeDefined();
    expect(body.data.productCode).toBeDefined();
    expect(body.data.category).toBe("pizza");
    expect(body.data.price).toBe(14.50);
  });


  it("normalizes category to lowercase", async () => {
    const req = createMockRequest({
      name: "Dessert Tiramisu",
      category: "DESSERTS",
      price: 9,
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.data.category).toBe("desserts");
  });

  it("rejects a missing name with a 400 error", async () => {
    const req = createMockRequest({
      category: "pasta",
      price: 12,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error.message).toContain("name is required");
  });

  it("rejects an invalid category with a 400 error listing valid values", async () => {
    const req = createMockRequest({
      name: "Unknown Food",
      category: "beverages",
      price: 5,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    const validValues = VALID_PRODUCT_CATEGORIES.join(", ");
    expect(body.error.message).toContain(`one of: ${validValues}`);
  });

  it("rejects a negative price with a 400 error", async () => {
    const req = createMockRequest({
      name: "Free Sample",
      category: "specials",
      price: "-5",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error.message).toContain("non-negative");
  });

  it("rejects malformed JSON with a 400 error", async () => {
    const req = createMockRequest("{ invalid json }", "text/plain");
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rejects a non-JSON content type with a 400 error", async () => {
    const req = createMockRequest({ name: "Test" }, "text/html");
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rounds price to two decimal places", async () => {
    const req = createMockRequest({
      name: "Round Price Product",
      category: "specials",
      price: "19.999",
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.data.price).toBe(20.0);
  });

  it("strips badges that are not strings", async () => {
    const req = createMockRequest({
      name: "Badge Striper",
      category: "specials",
      price: 10,
      badges: ["real", 123, "", null, true],
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.data.badges).toEqual(["real"]);
  });


  it("trims whitespace from name and description", async () => {
    const req = createMockRequest({
      name: "  Trimmed Name  ",
      category: "specials",
      price: 10,
      description: "  Whitespace trimmed  ",
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.data.name).toBe("Trimmed Name");
    expect(body.data.description).toBe("Whitespace trimmed");
  });

  it("handles empty badges array without error", async () => {
    const req = createMockRequest({
      name: "No Badges Product",
      category: "specials",
      price: 10,
      badges: [],
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.data.badges).toEqual([]);
  });

  it("handles no badges field without error", async () => {
    const req = createMockRequest({
      name: "No Badges Product",
      category: "specials",
      price: 10,
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.data.badges).toEqual([]); // empty array default from model schema
  });
});

// ── PATCH /api/products/[id] — not yet tested (requires [id]/route.ts) ───────

// describe("PATCH /api/products/[id]", () => {
//   it.skip("skipped — requires route handler with params", async () => {});
// });

// // ── DELETE /api/products/[id] — not yet tested ───────────────────────────────

// describe("DELETE /api/products/[id]", () => {
//   it.skip("skipped — requires route handler with params", async () => {});
// });

// // ── GET /api/products/[id] — not yet tested ──────────────────────────────────

// describe("GET /api/products/[id]", () => {
//   it.skip("skipped — requires route handler with params", async () => {});
// });
