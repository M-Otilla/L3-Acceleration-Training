import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
  }

  // The Next.js route handlers read process.env.MONGODB_URI to connect.
  // Point it at the in-memory server so MongoDB operations work during tests.
  const uri = mongod.getUri() ?? "mongodb://127.0.0.1:27017/memogood";
  process.env.MONGODB_URI = uri;
});

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }
});

// Connection is managed per-test-file via each file's own beforeAll / afterEach.

export { mongod };
