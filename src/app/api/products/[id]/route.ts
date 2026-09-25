import { type NextRequest } from "next/server";

import {
  createApiError,
  createApiResponse,
  ensureValidObjectId,
  getErrorMessage,
  isDuplicateKeyError,
  isMongoUnavailableError,
  parseJsonBody,
  serializeProduct,
  validateProductInput,
} from "@/API/helpers";
import Product from "@/DB/models/Product";
import { connectToDatabase } from "@/DB/mongodb";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await Promise.resolve(context.params);

  try {
    await connectToDatabase();
    ensureValidObjectId(id);

    const product = await Product.findById(id).lean();

    if (!product) {
      return createApiError(404, "Product not found.");
    }

    return createApiResponse(serializeProduct(product as Record<string, unknown>));
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    if (message === "Invalid ObjectId.") {
      return createApiError(400, "Invalid product id.");
    }

    return createApiError(500, "Failed to fetch product.", { cause: message });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await Promise.resolve(context.params);

  try {
    await connectToDatabase();
    ensureValidObjectId(id);

    const payload = await parseJsonBody(request);
    const updates = validateProductInput(payload, true);
    const product = await Product.findById(id);

    if (!product) {
      return createApiError(404, "Product not found.");
    }

    Object.assign(product, updates);
    await product.save();

    return createApiResponse(serializeProduct(product.toObject() as Record<string, unknown>));
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    if (message === "Invalid ObjectId.") {
      return createApiError(400, "Invalid product id.");
    }

    if (isDuplicateKeyError(error)) {
      return createApiError(409, "A product with the same slug or product code already exists.");
    }

    return createApiError(400, message);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await Promise.resolve(context.params);

  try {
    await connectToDatabase();
    ensureValidObjectId(id);

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return createApiError(404, "Product not found.");
    }

    return createApiResponse({ deleted: true, id }, 200);
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    if (message === "Invalid ObjectId.") {
      return createApiError(400, "Invalid product id.");
    }

    return createApiError(500, "Failed to delete product.", { cause: message });
  }
}