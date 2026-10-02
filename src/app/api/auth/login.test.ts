/**
 * Tests for the Login and Auth APIs.
 * Covers: POST /api/auth/login,  POST /api/auth/register,  POST /api/auth/logout.
 * Uses MongoMemoryServer so no external MongoDB is required.
 */

import { describe, it, expect } from "vitest";
import bcrypt from "bcryptjs";
import User from "@/DB/models/User";
import Admin from "@/DB/models/Admin";
import { connectToDatabase } from "@/DB/mongodb";

// Import route handlers directly — no HTTP server needed.
import { POST as loginPost } from "@/app/api/auth/login/route";
import { POST as registerPost } from "@/app/api/auth/register/route";
import { POST as logoutPost } from "@/app/api/auth/logout/route";

// ── helpers ──────────────────────────────────────────────────────────────────

async function createUser(payload: Record<string, unknown>) {
  await connectToDatabase();
  const doc = await User.create(payload);
  return doc.toObject() as Record<string, unknown>;
}

async function createAdmin(payload: Record<string, unknown>) {
  await connectToDatabase();
  const doc = await Admin.create(payload);
  return doc.toObject() as Record<string, unknown>;
}

function getSetCookieHeader(res: Response): string | null {
  // NextResponse sets `set-cookie` as an array when cookies are involved.
  const raw = res.headers.get("set-cookie");
  return raw ? Array.isArray(raw) ? raw[0] : raw : null;
}

/**
 * Parse the session cookie value back to its payload.
 * The route serializes it as base64url(JSON(user)).
 */
function parseSessionCookie(cookieValue: string): Record<string, unknown> {
  const decoded = Buffer.from(cookieValue, "base64url").toString("utf-8");
  return JSON.parse(decoded);
}

/** Build a mock NextRequest from an object. */
function mockNextReq(body: Record<string, unknown>, contentType = "application/json") {
  return {
    headers: new Headers({ "content-type": contentType }),
    json: async () => body,
  } as any;
}

// ── POST /api/auth/login (valid credentials) ────────────────────────────────

describe("POST /api/auth/login — valid credentials", () => {
  it("logs in a registered User successfully", async () => {
    await createUser({
      fullName: "Alice Pasta",
      mobileNumber: "1234567890",
      email: "alice@example.com",
      passwordHash: await bcrypt.hash("SecurePass1", 10),
    });

    const res = await loginPost(mockNextReq({
      email: "alice@example.com",
      password: "SecurePass1",
    }));

    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.data.user.email).toBe("alice@example.com");
    expect(body.data.data.user.fullName).toBe("Alice Pasta");
    expect(body.data.data.user.type).toBe("user");
  });

  it("logs in a registered Admin successfully", async () => {
    await createAdmin({
      fullName: "Admin User",
      email: "admin@la-tavola.local",
      passwordHash: await bcrypt.hash("admin12345", 10),
    });

    const res = await loginPost(mockNextReq({
      email: "admin@la-tavola.local",
      password: "admin12345",
    }));

    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.data.user.email).toBe("admin@la-tavola.local");
    expect(body.data.data.user.type).toBe("admin");
  });

  it("sets a session cookie on successful login", async () => {
    await createUser({
      fullName: "Cookie User",
      mobileNumber: "1234567890",
      email: "cookie@example.com",
      passwordHash: await bcrypt.hash("SecurePass1", 10),
    });

    const res = await loginPost(mockNextReq({
      email: "cookie@example.com",
      password: "SecurePass1",
    }));

    const cookie = getSetCookieHeader(res);
    expect(cookie).not.toBeNull();
    expect(cookie!).toContain("latavola-session");

    const parsed = parseSessionCookie(cookie!.split("=")[1].split(";")[0]);
    expect(parsed.email).toBe("cookie@example.com");
  });

  it("normalizes email to lowercase before login", async () => {
    await createUser({
      fullName: "Lower User",
      mobileNumber: "1234567890",
      email: "LOWERCASE@EXAMPLE.COM", // stored as lower.
      passwordHash: await bcrypt.hash("SecurePass1", 10),
    });

    const res = await loginPost(mockNextReq({
      email: "LOWERCASE@EXAMPLE.COM", // all caps at request time.
      password: "SecurePass1",
    }));

    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.data.user.email).toBe("lowercase@example.com");
  });

  it("returns user fields (no password hash) on successful login", async () => {
    await createUser({
      fullName: "Secret User",
      mobileNumber: "1234567890",
      email: "secret@example.com",
      passwordHash: await bcrypt.hash("SecurePass1", 10),
    });

    const res = await loginPost(mockNextReq({
      email: "secret@example.com",
      password: "SecurePass1",
    }));

    const body = await res.json();
    expect(body.data.data.user.passwordHash).toBeUndefined();
    expect(body.data.data.user.id).toBeDefined();
    expect(body.data.data.user.fullName).toBe("Secret User");
  });
});

// ── POST /api/auth/register ──────────────────────────────────────────────────

describe("POST /api/auth/register", () => {
  it("creates a new user and returns 201", async () => {
    const res = await registerPost(mockNextReq({
      fullName: "New User",
      mobileNumber: "0987654321",
      email: "newuser@example.com",
      password: "SecurePass1",
    }));

    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.data.data.user.email).toBe("newuser@example.com");
    expect(body.data.data.user.fullName).toBe("New User");
    expect(body.data.data.user.id).toBeDefined();
  });

  it("hashes the password before storing", async () => {
    await registerPost(mockNextReq({
      fullName: "Hash Test User",
      mobileNumber: "1111111111",
      email: "hashtest@example.com",
      password: "SecurePass1",
    }));

    // Verify the stored hash is bcrypt (starts with $2b$) and does not match plaintext.
    const dbUser = await User.findOne({ email: "hashtest@example.com" }).select("+passwordHash").lean();
    expect(dbUser!.passwordHash).toBeDefined();
    expect(dbUser!.passwordHash.startsWith("$2")).toBe(true);

    // The plain password should NOT match the stored hash.
    const valid = await bcrypt.compare("SecurePass1", dbUser!.passwordHash);
    expect(valid).toBe(true); // it IS correct — just not stored in plaintext.
  });

  it("rejects a duplicate email with 409", async () => {
    await createUser({
      fullName: "Existing User",
      mobileNumber: "1234567890",
      email: "existing@example.com",
      passwordHash: await bcrypt.hash("SecurePass1", 10),
    });

    const res = await registerPost(mockNextReq({
      fullName: "Duplicate User",
      mobileNumber: "2222222222",
      email: "existing@example.com",
      password: "AnotherPass1",
    }));

    expect(res.status).toBe(409);

    const body = await res.json();
    expect(body.error.message).toContain("already exists");
  });

  it("rejects a weak password (< 8 characters)", async () => {
    const res = await registerPost(mockNextReq({
      fullName: "Weak Password User",
      mobileNumber: "3333333333",
      email: "weak@example.com",
      password: "Short1", // only 6 chars.
    }));

    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error.message).toContain("at least 8 characters");
  });

  it("rejects a password without a letter", async () => {
    const res = await registerPost(mockNextReq({
      fullName: "No Letter Password User",
      mobileNumber: "4444444444",
      email: "noltr@example.com",
      password: "12345678", // digits only.
    }));

    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error.message).toContain("one letter");
  });

  it("rejects a password without a number", async () => {
    const res = await registerPost(mockNextReq({
      fullName: "No Number Password User",
      mobileNumber: "5555555555",
      email: "nonum@example.com",
      password: "abcdefgh", // letters only.
    }));

    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error.message).toContain("one number");
  });

  it("rejects a malformed JSON body with 400", async () => {
    const res = await registerPost(mockNextReq("{ invalid json }" as any, "text/plain"));

    expect(res.status).toBe(400);

    const body = await res.json();
    
    expect(body.error.message).toBe("Request body must be JSON.");
  });

  it("rejects a missing fullName with 400", async () => {
    const res = await registerPost(mockNextReq({
      mobileNumber: "6666666666",
      email: "noltr@example.com",
      password: "abcdefgh1",
    }));

    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error.message).toBe("fullName is required.");
  });

  it("rejects a missing mobileNumber with 400", async () => {
    const res = await registerPost(mockNextReq({
      fullName: "No Mobile User",
      email: "nomobile@example.com",
      password: "abcdefgh1",
    }));

    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error.message).toBe("mobileNumber is required.");
  });

  it("rejects an invalid email address with 400", async () => {
    const res = await registerPost(mockNextReq({
      fullName: "Bad Email User",
      mobileNumber: "7777777777",
      email: "not-an-email",
      password: "abcdefgh1",
    }));

    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error.message).toBe("email must be a valid email address.");
  });

  it("sets a session cookie on successful registration", async () => {
    const res = await registerPost(mockNextReq({
      fullName: "Register Cookie User",
      mobileNumber: "8888888888",
      email: "regcookie@example.com",
      password: "SecurePass1",
    }));

    const cookie = getSetCookieHeader(res);
    expect(cookie).not.toBeNull();
    expect(cookie!).toContain("latavola-session");
  });
});

// ── POST /api/auth/logout ────────────────────────────────────────────────────

describe("POST /api/auth/logout", () => {
  it("clears the session cookie with max-age=0", async () => {
    const res = await logoutPost();

    expect(res.status).toBe(200);

    const body = await res.json();
    // createApiResponse({ data: null }) → { "data": { "data": null } }
    expect(body.data.data).toBeNull();

    const cookie = getSetCookieHeader(res);
    expect(cookie).not.toBeNull();
    // The cookie should be cleared (maxAge=0), so it should contain "max-age=0".
    expect(cookie!).toContain("Max-Age=0");
  });

  it("is idempotent — calling twice does not throw", async () => {
    const res1 = await logoutPost();
    const res2 = await logoutPost();

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
  });
});
