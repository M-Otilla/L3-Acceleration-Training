import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/la-tavola';

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    return true;
  } catch (error) {
    console.warn('MongoDB connection unavailable, using fallback demo data.', error);
    return false;
  }
}
