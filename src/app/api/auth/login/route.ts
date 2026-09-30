import bcrypt from "bcryptjs";
import { type NextRequest, type NextResponse } from "next/server";

import {
  createApiError,
  createApiResponse,
  getErrorMessage,
  isMongoUnavailableError,
  parseJsonBody,
  serializeUser,
} from "@/API/helpers";
import User from "@/DB/models/User";
import Admin from "@/DB/models/Admin";
import { connectToDatabase } from "@/DB/mongodb";

const COOKIE_NAME = "latavola-session";
const COOKIE_EXPIRY_DAYS = 7;

function serializeCookie(user: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(user)).toString("base64url");
}

// setSessionCookie is used by this route and duplicated in register.
// Kept as local helper for clarity.
function setSessionCookie(res: NextResponse, user: Record<string, unknown>) {
  const expires = new Date(Date.now() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  res.cookies.set(COOKIE_NAME, serializeCookie(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await parseJsonBody(request);
    const { email, password } = payload as Record<string, unknown>;

    if (typeof email !== "string" || !email.trim()) {
      return createApiError(400, "Email is required.");
    }

    if (typeof password !== "string" || !password) {
      return createApiError(400, "Password is required.");
    }

    await connectToDatabase();

    // 1 — Try User first.
    const user = await User.findOne({ email: email.trim().toLowerCase() })
      .select("+passwordHash")
      .lean();

    if (user) {
      const validPassword = await bcrypt.compare(password, String(user.passwordHash));

      if (!validPassword) {
        return createApiError(401, "Invalid email or password.");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _, ...userWithoutPassword } = user;
      const serializedUser = serializeUser(userWithoutPassword);
      const res = createApiResponse({ data: { user: { ...serializedUser, type: "user" as const } } });
      setSessionCookie(res, serializedUser);
      return res;
    }

    // 2 — Fall back to Admin collection.
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() })
      .select("+passwordHash")
      .lean();

    if (!admin) {
      return createApiError(401, "Invalid email or password.");
    }

    const validPassword = await bcrypt.compare(password, String(admin.passwordHash));

    if (!validPassword) {
      return createApiError(401, "Invalid email or password.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...adminWithoutPassword } = admin;
    const serializedAdmin = serializeUser(adminWithoutPassword);
    const res = createApiResponse({ data: { user: { ...serializedAdmin, type: "admin" as const } } });

    setSessionCookie(res, serializedAdmin);
    return res;
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    return createApiError(500, "Failed to log in. Please try again later.");
  }
}
