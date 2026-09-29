import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
  }
});

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }
});

beforeEach(async () => {
  const mongoose = await import("mongoose");
  await mongoose.connection.close();
});

afterEach(async () => {
  const mongoose = await import("mongoose");
  await mongoose.disconnect();
});

export { mongod };
