const connectDB = require('../config/db');

// Middleware to ensure database connection before each request (serverless)
const ensureDbConnection = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    res.status(503).json({ 
      error: 'Database connection failed',
      message: 'Unable to connect to database. Please try again later.' 
    });
  }
};

module.exports = ensureDbConnection;