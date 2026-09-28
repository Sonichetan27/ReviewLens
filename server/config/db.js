const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
  throw new Error('MONGODB_URI is not defined in environment variables.');
}

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 s timeout
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
  console.error('❌ MongoDB connection failed:', error.message);
  throw error;
}
};

module.exports = connectDB;
