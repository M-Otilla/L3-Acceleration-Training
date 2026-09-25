import bcrypt from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server";

export const VALID_PRODUCT_CATEGORIES = ["antipasti", "pasta", "pizza", "desserts", "drinks", "specials"] as const;
export type ProductCategory = (typeof VALID_PRODUCT_CATEGORIES)[number];

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function createApiError(status: number, message: string, details?: Record<string, unknown>) {
  return NextResponse.json(
    {
      error: {
        message,
        ...(details && Object.keys(details).length > 0 ? { details } : {}),
      },
    },
    { status },
  );
}

export function createApiResponse(data: unknown, status = 200) {
  return NextResponse.json({ data }, { status });
}

export async function parseJsonBody<T>(request: NextRequest): Promise<T> {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error("Request body must be JSON.");
  }

  try {
    const body = await request.json();

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      throw new Error("Request body must be a JSON object.");
    }

    return body as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Malformed JSON body.");
    }

    throw error;
  }
}

export function isMongoObjectId(value: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

export function ensureValidObjectId(value: string): void {
  if (!isMongoObjectId(value)) {
    throw new Error("Invalid ObjectId.");
  }
}

export function sanitizePlainObject<T extends Record<string, unknown>>(value: T): Record<string, unknown> {
  if (!value || typeof value !== "object") {
    return {};
  }

  const plain = { ...value } as Record<string, unknown>;

  if (typeof plain._id !== "undefined") {
    plain.id = String(plain._id);
    delete plain._id;
  }

  if (typeof plain.__v !== "undefined") {
    delete plain.__v;
  }

  delete plain.password;
  delete plain.passwordHash;
  delete plain.hash;

  return plain;
}

export function serializeUser(value: Record<string, unknown>) {
  const plain = sanitizePlainObject(value);

  if (typeof plain.email === "string") {
    plain.email = normalizeEmail(plain.email);
  }

  return plain;
}

export function serializeProduct(value: Record<string, unknown>) {
  return sanitizePlainObject(value);
}

export function validateUserInput(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Request body must be a JSON object.");
  }

  const { fullName, mobileNumber, email, password } = payload as Record<string, unknown>;

  if (typeof fullName !== "string" || !fullName.trim()) {
    throw new Error("fullName is required.");
  }

  if (typeof mobileNumber !== "string" || !mobileNumber.trim()) {
    throw new Error("mobileNumber is required.");
  }

  if (typeof email !== "string" || !email.trim()) {
    throw new Error("email is required.");
  }

  if (typeof password !== "string" || !password.trim()) {
    throw new Error("password is required.");
  }

  const normalizedEmail = normalizeEmail(email);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("email must be a valid email address.");
  }

  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new Error("password must be at least 8 characters with at least one letter and one number.");
  }

  return {
    fullName: fullName.trim(),
    mobileNumber: mobileNumber.trim(),
    email: normalizedEmail,
    password,
  };
}

export function validateUserUpdateInput(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Request body must be a JSON object.");
  }

  const updates: Record<string, string> = {};
  const { fullName, mobileNumber, email, password } = payload as Record<string, unknown>;

  if (typeof fullName !== "undefined") {
    if (typeof fullName !== "string" || !fullName.trim()) {
      throw new Error("fullName is required.");
    }

    updates.fullName = fullName.trim();
  }

  if (typeof mobileNumber !== "undefined") {
    if (typeof mobileNumber !== "string" || !mobileNumber.trim()) {
      throw new Error("mobileNumber is required.");
    }

    updates.mobileNumber = mobileNumber.trim();
  }

  if (typeof email !== "undefined") {
    if (typeof email !== "string" || !email.trim()) {
      throw new Error("email is required.");
    }

    const normalizedEmail = normalizeEmail(email);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error("email must be a valid email address.");
    }

    updates.email = normalizedEmail;
  }

  if (typeof password !== "undefined") {
    if (typeof password !== "string" || !password.trim()) {
      throw new Error("password is required.");
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      throw new Error("password must be at least 8 characters with at least one letter and one number.");
    }

    updates.password = password;
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("At least one valid user field must be provided.");
  }

  return updates;
}

export function validateProductInput(payload: unknown, partial = false) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Request body must be a JSON object.");
  }

  const { name, category, price, description, badges } = payload as Record<string, unknown>;
  const nextPayload: Record<string, unknown> = {};

  if (!partial || typeof name !== "undefined") {
    if (typeof name !== "string" || !name.trim()) {
      throw new Error("name is required.");
    }

    const safeName = name.trim();
    const safeSlug = slugify(safeName);

    if (!safeSlug) {
      throw new Error("name must produce a valid slug.");
    }

    nextPayload.name = safeName;
    nextPayload.slug = safeSlug;
    nextPayload.productCode = safeSlug.toUpperCase().replace(/-/g, "").slice(0, 24);
  }

  if (!partial || typeof category !== "undefined") {
    const normalizedCategory = typeof category === "string" ? category.trim().toLowerCase() : "";

    if (!VALID_PRODUCT_CATEGORIES.includes(normalizedCategory as ProductCategory)) {
      throw new Error(`category must be one of: ${VALID_PRODUCT_CATEGORIES.join(", ")}.`);
    }

    nextPayload.category = normalizedCategory as ProductCategory;
  }

  if (!partial || typeof price !== "undefined") {
    const numericPrice = typeof price === "string" ? Number(price) : typeof price === "number" ? price : Number.NaN;

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      throw new Error("price must be a non-negative number.");
    }

    nextPayload.price = Number(numericPrice.toFixed(2));
  }

  if (!partial || typeof description !== "undefined") {
    if (typeof description !== "string") {
      throw new Error("description must be a string.");
    }

    nextPayload.description = description.trim();
  }

  if (!partial || typeof badges !== "undefined") {
    if (!Array.isArray(badges)) {
      throw new Error("badges must be an array of strings.");
    }

    nextPayload.badges = badges
      .map((badge) => (typeof badge === "string" ? badge.trim() : ""))
      .filter((badge) => badge.length > 0);
  }

  if (Object.keys(nextPayload).length === 0) {
    throw new Error("At least one valid product field must be provided.");
  }

  return nextPayload;
}

export function validateProductUpdateInput(payload: unknown) {
  return validateProductInput(payload, true);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function isDuplicateKeyError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  return "code" in error && error.code === 11000;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error.";
}

export function isMongoUnavailableError(message: string): boolean {
  return (
    message.startsWith("MongoDB") ||
    message.includes("MONGODB_URI") ||
    message.includes("MongoDB connection failed") ||
    message.includes("ECONNREFUSED") ||
    message.includes("connect ECONNREFUSED")
  );
}