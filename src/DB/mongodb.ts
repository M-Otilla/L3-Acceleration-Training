import mongoose from "mongoose";

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Add it to .env.local before connecting to MongoDB.");
  }

  if (!globalWithMongoose.mongooseCache) {
    globalWithMongoose.mongooseCache = { conn: null, promise: null };
  }

  if (globalWithMongoose.mongooseCache.conn) {
    return globalWithMongoose.mongooseCache.conn;
  }

  if (!globalWithMongoose.mongooseCache.promise) {
    globalWithMongoose.mongooseCache.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 5000 })
      .then((mongooseInstance) => mongooseInstance)
      .catch((error: unknown) => {
        globalWithMongoose.mongooseCache = { conn: null, promise: null };
        throw new Error(`MongoDB connection failed: ${error instanceof Error ? error.message : "unknown error"}`);
      });
  }

  globalWithMongoose.mongooseCache.conn = await globalWithMongoose.mongooseCache.promise;

  return globalWithMongoose.mongooseCache.conn;
}