const mongoose = require('mongoose');

// TODO: implement in Day 1 — connect to MongoDB, handle retries, and export connection state

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI is empty; skipping database connection (scaffold).');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.warn('MongoDB connection skipped during scaffold:', error.message);
  }
};

module.exports = connectDB;
