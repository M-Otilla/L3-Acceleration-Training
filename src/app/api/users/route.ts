import { type NextRequest } from "next/server";

import {
  createApiError,
  createApiResponse,
  getErrorMessage,
  hashPassword,
  isDuplicateKeyError,
  isMongoUnavailableError,
  parseJsonBody,
  serializeUser,
  validateUserInput,
} from "@/API/helpers";
import User from "@/DB/models/User";
import { connectToDatabase } from "@/DB/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}).sort({ createdAt: -1 }).lean();

    return createApiResponse(users.map((user) => serializeUser(user as Record<string, unknown>)));
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    return createApiError(500, "Failed to fetch users.", { cause: message });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const payload = await parseJsonBody(request);
    const validUser = validateUserInput(payload);
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

    return createApiResponse(serializeUser(createdUser.toObject() as Record<string, unknown>), 201);
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    if (isDuplicateKeyError(error)) {
      return createApiError(409, "A user with this email already exists.");
    }

    if (["Request body must be JSON.", "Request body must be a JSON object.", "Malformed JSON body."].includes(message)) {
      return createApiError(400, message);
    }

    return createApiError(400, message);
  }
}