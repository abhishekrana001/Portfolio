import mongoose from 'mongoose';

export const connectDB = async () => {
  // Prefer MONGODB_URI (Atlas) over MONGO_URI (may be a localhost URI in .env).
  // On Render, only set the variable that contains your Atlas connection string.
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.warn('⚠️  No MONGODB_URI or MONGO_URI found in environment. MongoDB features will run in offline mode.');
    return false;
  }

  // Log which variable is being used (never log the URI itself — it contains credentials).
  const resolvedVar = process.env.MONGODB_URI ? 'MONGODB_URI' : 'MONGO_URI';
  console.log(`🔌 Connecting to MongoDB via ${resolvedVar}…`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 s — allows for Render/Atlas cold-start latency
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed (server running in fallback/offline mode):', err.message);
    return false;
  }
};