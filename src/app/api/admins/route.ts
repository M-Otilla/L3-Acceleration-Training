import { type NextRequest } from "next/server";

import {
  createApiError,
  createApiResponse,
  getErrorMessage,
  hashPassword,
  isDuplicateKeyError,
  isMongoUnavailableError,
  parseJsonBody,
  serializeAdmin,
  validateAdminInput,
} from "@/API/helpers";
import Admin from "@/DB/models/Admin";
import { connectToDatabase } from "@/DB/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    const admins = await Admin.find({}).sort({ createdAt: -1 }).lean();

    return createApiResponse(admins.map((admin) => serializeAdmin(admin as Record<string, unknown>)));
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    return createApiError(500, "Failed to fetch admins.", { cause: message });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const payload = await parseJsonBody(request);
    const validAdmin = validateAdminInput(payload);
    const existingAdmin = await Admin.findOne({ email: validAdmin.email }).lean();

    if (existingAdmin) {
      return createApiError(409, "An admin with this email already exists.");
    }

    const createdAdmin = await Admin.create({
      fullName: validAdmin.fullName,
      email: validAdmin.email,
      passwordHash: await hashPassword(validAdmin.password),
    });

    return createApiResponse(serializeAdmin(createdAdmin.toObject() as Record<string, unknown>), 201);
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    if (isDuplicateKeyError(error)) {
      return createApiError(409, "An admin with this email already exists.");
    }

    if (["Request body must be JSON.", "Request body must be a JSON object.", "Malformed JSON body."].includes(message)) {
      return createApiError(400, message);
    }

    return createApiError(400, message);
  }
}
