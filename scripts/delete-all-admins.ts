import { connect } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/la-tavola";

try {
  await connect(MONGODB_URI);
  const Admin = (await import("@/DB/models/Admin")).default;
  const { deletedCount } = await Admin.deleteMany({});
  console.log(`Deleted ${deletedCount} admin record(s)`);
} catch (error) {
  console.error("Delete failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}