import { createApiResponse, getErrorMessage, isMongoUnavailableError, sanitizePlainObject } from "@/API/helpers";
import User from "@/DB/models/User";
import Admin from "@/DB/models/Admin";
import { connectToDatabase } from "@/DB/mongodb";

const COOKIE_NAME = "latavola-session";

export async function GET() {
  try {
    const cookieStore = await (await import("next/headers")).cookies();
    const raw = cookieStore.get(COOKIE_NAME)?.value;

    if (!raw) {
      return createApiResponse({ data: null });
    }

    let user: Record<string, unknown>;

    try {
      user = JSON.parse(Buffer.from(raw, "base64url").toString("utf-8")) as Record<string, unknown>;
    } catch {
      return createApiResponse({ data: null });
    }

    if (!user || typeof user.email !== "string") {
      return createApiResponse({ data: null });
    }

    await connectToDatabase();

    // Check User first.
    const dbUser = await User.findOne({ email: user.email }).lean();

    if (dbUser) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _, ...userWithoutPassword } = dbUser;
      const sanitized = sanitizePlainObject(userWithoutPassword);
      return createApiResponse({ data: { user: { ...sanitized, type: "user" as const } } });
    }

    // Fall back to Admin.
    const dbAdmin = await Admin.findOne({ email: user.email }).lean();

    if (!dbAdmin) {
      return createApiResponse({ data: null });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...adminWithoutPassword } = dbAdmin;
    const sanitizedAdmin = sanitizePlainObject(adminWithoutPassword);
    return createApiResponse({ data: { user: { ...sanitizedAdmin, type: "admin" as const } } });
  } catch (error) {
    const message = getErrorMessage(error);

    if (isMongoUnavailableError(message)) {
      return createApiResponse({ data: null });
    }

    return createApiResponse({ data: null });
  }
}
