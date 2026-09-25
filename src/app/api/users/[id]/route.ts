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
  serializeUser,
  validateUserUpdateInput,
} from "@/API/helpers";
import User from "@/DB/models/User";
import { connectToDatabase } from "@/DB/mongodb";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await Promise.resolve(context.params);

  try {
    await connectToDatabase();
    ensureValidObjectId(id);

    const user = await User.findById(id).lean();

    if (!user) {
      return createApiError(404, "User not found.");
    }

    return createApiResponse(serializeUser(user as Record<string, unknown>));
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    if (message === "Invalid ObjectId.") {
      return createApiError(400, "Invalid user id.");
    }

    return createApiError(500, "Failed to fetch user.", { cause: message });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await Promise.resolve(context.params);

  try {
    await connectToDatabase();
    ensureValidObjectId(id);

    const payload = await parseJsonBody(request);
    const updates = validateUserUpdateInput(payload);
    const user = await User.findById(id);

    if (!user) {
      return createApiError(404, "User not found.");
    }

    if (typeof updates.fullName !== "undefined") {
      user.fullName = updates.fullName;
    }

    if (typeof updates.mobileNumber !== "undefined") {
      user.mobileNumber = updates.mobileNumber;
    }

    if (typeof updates.email !== "undefined") {
      const duplicateUser = await User.findOne({ email: updates.email, _id: { $ne: user._id } }).lean();

      if (duplicateUser) {
        return createApiError(409, "A user with this email already exists.");
      }

      user.email = updates.email;
    }

    if (typeof updates.password !== "undefined") {
      user.passwordHash = await hashPassword(updates.password);
    }

    await user.save();

    return createApiResponse(serializeUser(user.toObject() as Record<string, unknown>));
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    if (message === "Invalid ObjectId.") {
      return createApiError(400, "Invalid user id.");
    }

    if (isDuplicateKeyError(error)) {
      return createApiError(409, "A user with this email already exists.");
    }

    return createApiError(400, message);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await Promise.resolve(context.params);

  try {
    await connectToDatabase();
    ensureValidObjectId(id);

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return createApiError(404, "User not found.");
    }

    return createApiResponse({ deleted: true, id }, 200);
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    if (message === "Invalid ObjectId.") {
      return createApiError(400, "Invalid user id.");
    }

    return createApiError(500, "Failed to delete user.", { cause: message });
  }
}