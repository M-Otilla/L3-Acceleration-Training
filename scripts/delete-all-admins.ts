import { connect } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/la-tavola";

async function main(): Promise<void> {
  try {
    await connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const Admin = (await import("@/DB/models/Admin")).default;

    const result = await Admin.deleteMany({});
    console.log(`Deleted ${result.deletedCount} admin record(s)`);
    process.exit(0);
  } catch (error) {
    console.error("Delete failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
