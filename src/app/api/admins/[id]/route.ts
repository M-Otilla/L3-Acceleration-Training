import { type NextRequest } from "next/server";

import {
  createApiError,
  createApiResponse,
  ensureValidObjectId,
  getErrorMessage,
  hashPassword,
  isDuplicateKeyError,
  isMongoUnavailableError,
  parseJsonBody,
  serializeAdmin,
  validateAdminUpdateInput,
} from "@/API/helpers";
import Admin from "@/DB/models/Admin";
import { connectToDatabase } from "@/DB/mongodb";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await Promise.resolve(context.params);

  try {
    await connectToDatabase();
    ensureValidObjectId(id);

    const admin = await Admin.findById(id).lean();

    if (!admin) {
      return createApiError(404, "Admin not found.");
    }

    return createApiResponse(serializeAdmin(admin as Record<string, unknown>));
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    if (message === "Invalid ObjectId.") {
      return createApiError(400, "Invalid admin id.");
    }

    return createApiError(500, "Failed to fetch admin.", { cause: message });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await Promise.resolve(context.params);

  try {
    await connectToDatabase();
    ensureValidObjectId(id);

    const payload = await parseJsonBody(request);
    const updates = validateAdminUpdateInput(payload);
    const admin = await Admin.findById(id);

    if (!admin) {
      return createApiError(404, "Admin not found.");
    }

    if (typeof updates.fullName !== "undefined") {
      admin.fullName = updates.fullName;
    }

    if (typeof updates.email !== "undefined") {
      const duplicateAdmin = await Admin.findOne({ email: updates.email, _id: { $ne: admin._id } }).lean();

      if (duplicateAdmin) {
        return createApiError(409, "An admin with this email already exists.");
      }

      admin.email = updates.email;
    }

    if (typeof updates.password !== "undefined") {
      admin.passwordHash = await hashPassword(updates.password);
    }

    await admin.save();

    return createApiResponse(serializeAdmin(admin.toObject() as Record<string, unknown>));
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    if (message === "Invalid ObjectId.") {
      return createApiError(400, "Invalid admin id.");
    }

    if (isDuplicateKeyError(error)) {
      return createApiError(409, "An admin with this email already exists.");
    }

    return createApiError(400, message);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await Promise.resolve(context.params);

  try {
    await connectToDatabase();
    ensureValidObjectId(id);

    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return createApiError(404, "Admin not found.");
    }

    return createApiResponse({ deleted: true, id }, 200);
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    if (message === "Invalid ObjectId.") {
      return createApiError(400, "Invalid admin id.");
    }

    return createApiError(500, "Failed to delete admin.", { cause: message });
  }
}
