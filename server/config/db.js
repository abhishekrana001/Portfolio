import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ No MONGO_URI or MONGODB_URI specified in environment. MongoDB features will run in offline mode.');
    return false;
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed (server running in fallback/offline mode):', err.message);
    return false;
  }
};