import { type NextRequest } from "next/server";

import {
  createApiError,
  createApiResponse,
  getErrorMessage,
  isDuplicateKeyError,
  isMongoUnavailableError,
  parseJsonBody,
  serializeProduct,
  validateProductInput,
} from "@/API/helpers";
import Product from "@/DB/models/Product";
import { connectToDatabase } from "@/DB/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    return createApiResponse(products.map((product) => serializeProduct(product as Record<string, unknown>)));
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    return createApiError(500, "Failed to fetch products.", { cause: message });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const payload = await parseJsonBody(request);
    const productData = validateProductInput(payload);
    const createdProduct = await Product.create(productData);

    return createApiResponse(serializeProduct(createdProduct.toObject() as Record<string, unknown>), 201);
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiError(503, "MongoDB is unavailable.", { cause: message });
    }

    if (isDuplicateKeyError(error)) {
      return createApiError(409, "A product with the same slug or product code already exists.");
    }

    if (["Request body must be JSON.", "Request body must be a JSON object.", "Malformed JSON body."].includes(message)) {
      return createApiError(400, message);
    }

    return createApiError(400, message);
  }
}