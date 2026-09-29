require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const placeRoutes = require('./routes/placeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(express.json({ limit: '50kb' }));

// ── Root route ─────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to ReviewLens API',
    version: '0.0.1',
    endpoints: {
      health: '/api/health',
      places: '/api/places',
      reviews: '/api/reviews',
      recommendations: '/api/recommendations'
    },
    frontend: process.env.CLIENT_URL || 'http://localhost:5173'
  });
});

// ── Health check (canonical: GET /api/health) ─────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ReviewLens API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    aiMode: process.env.AI_MODE || 'mock',
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/places', placeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recommendations', recommendationRoutes);

// ── 404 catch-all ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Centralized error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

// ── Database connection ───────────────────────────────────────────────────────
const dbConnection = connectDB();

// ── Start listening when run directly (local dev / Render), but not when this
//    file is merely required as a serverless handler (Vercel imports the export).
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀  ReviewLens API listening on port ${PORT}`);
  });
}

// Export Express app for Vercel
module.exports = app;