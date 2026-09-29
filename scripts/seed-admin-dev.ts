import { connect } from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/la-tavola";
const ADMIN_EMAIL = "admin@la-tavola.local";
const ADMIN_PASSWORD = "password";
const ADMIN_FULL_NAME = "Admin";

async function main(): Promise<void> {
  try {
    await connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const Admin = (await import("@/DB/models/Admin")).default;

    // Clear existing admins before re-inserting
    const cleared = await Admin.deleteMany({});
    console.log(`Cleared ${cleared.deletedCount} admin record(s)`);

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const admin = await Admin.create({
      fullName: ADMIN_FULL_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
    });

    console.log("Admin created successfully:", { id: (admin as any).id, email: admin.email });
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
