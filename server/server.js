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

// ── Startup ───────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB(); // crashes loudly on failure — never starts silently
  app.listen(PORT, () => {
    console.log(`🚀  ReviewLens API listening on port ${PORT}`);
    console.log(`    AI mode: ${process.env.AI_MODE || 'mock'}`);
    console.log(`    CORS origin: ${process.env.CLIENT_URL || '*'}`);
  });
};

start();
