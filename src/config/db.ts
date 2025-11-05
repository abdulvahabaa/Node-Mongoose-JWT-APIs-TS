import mongoose from 'mongoose';

let isConnected = false; // 🔒 Cache the connection state

const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log('⚡ Using existing MongoDB connection');
    return;
  }

  try {
    const mongoUri = process.env.MONGO_URI;
    const dbName = process.env.MONGO_DB_NAME;

    if (!mongoUri) {
      throw new Error('❌ MONGO_URI not defined in .env');
    }

    const conn = await mongoose.connect(mongoUri, { dbName });

    isConnected = true; // ✅ Cache it after success

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Using Database: ${conn.connection.name}`);
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
