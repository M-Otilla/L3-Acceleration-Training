import { connect } from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/LaTavola";
const ADMIN_EMAIL = "admin@latavola.com";
const ADMIN_PASSWORD = "Password";
const ADMIN_FULL_NAME = "Admin";

async function main(): Promise<void> {
  try {
    await connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const Admin = (await import("@/DB/models/Admin")).default;

    const existing = await Admin.findOne({ email: ADMIN_EMAIL }).lean();

    if (existing) {
      console.log(`Admin with email "${ADMIN_EMAIL}" already exists. Skipping.`);
      return;
    }

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
