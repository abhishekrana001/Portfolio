import mongoose from 'mongoose';

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('⚠️ No MONGO_URI specified in environment. MongoDB features will run in offline mode.');
    return false;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed (server running in fallback/offline mode):', err.message);
    return false;
  }
};