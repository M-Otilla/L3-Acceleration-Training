import { type NextRequest, type NextResponse } from "next/server";

import {
  createApiError,
  createApiResponse,
  getErrorMessage,
  hashPassword,
  isDuplicateKeyError,
  isMongoUnavailableError,
  parseJsonBody,
  sanitizePlainObject,
  validateUserInput,
} from "@/API/helpers";
import User from "@/DB/models/User";
import { connectToDatabase } from "@/DB/mongodb";

const COOKIE_NAME = "latavola-session";
const COOKIE_EXPIRY_DAYS = 7;

function serializeCookie(user: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(user)).toString("base64url");
}

// setSessionCookie duplicated from login route for same cookie flow.
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
    await connectToDatabase();
    const payload = await parseJsonBody(request);
    const validUser = validateUserInput(payload);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = validUser;
    const existingUser = await User.findOne({ email: validUser.email }).lean();

    if (existingUser) {
      return createApiError(409, "A user with this email already exists.");
    }

    const createdUser = await User.create({
      fullName: validUser.fullName,
      mobileNumber: validUser.mobileNumber,
      email: validUser.email,
      passwordHash: await hashPassword(validUser.password),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = createdUser.toObject() as Record<string, unknown>;
    const serializedUser = sanitizePlainObject(userWithoutPassword);
    const res = createApiResponse({ data: { user: serializedUser } }, 201);

    setSessionCookie(res, serializedUser);
    return res;
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    if (isDuplicateKeyError(error)) {
      return createApiError(409, "A user with this email already exists.");
    }

    const clientMessages = [
      "Request body must be JSON.",
      "Request body must be a JSON object.",
      "Malformed JSON body.",
      "fullName is required.",
      "mobileNumber is required.",
      "email is required.",
      "password is required.",
      "email must be a valid email address.",
      "password must be at least 8 characters with at least one letter and one number.",
    ];

    if (clientMessages.includes(message)) {
      return createApiError(400, message);
    }

    return createApiError(500, "Failed to create account. Please try again later.");
  }
}
