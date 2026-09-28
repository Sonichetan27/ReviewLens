const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('FATAL: MONGODB_URI is not defined in environment variables.');
    console.error('Create server/.env with MONGODB_URI=<your-atlas-connection-string>');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 s timeout
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌  MongoDB connection failed:');
    console.error(`    ${error.message}`);
    console.error('    Check MONGODB_URI in server/.env and ensure Atlas IP whitelist includes this machine.');
    process.exit(1); // Do not start silently — crash loudly so the developer knows
  }
};

module.exports = connectDB;
