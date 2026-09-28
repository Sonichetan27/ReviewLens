/**
 * errorHandler.js — Centralized Express error handler.
 *
 * Strips internal stack traces in production to prevent information leakage.
 * Per ARCHITECTURE.md §8.2 — Error Obfuscation.
 */
const errorHandler = (err, _req, res, _next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const status = err.status || err.statusCode || 500;

  const body = {
    error: err.message || 'Internal server error',
  };

  // Include stack only in development
  if (!isProduction && err.stack) {
    body.stack = err.stack;
  }

  // Log to server console (always)
  console.error(`[${new Date().toISOString()}] ${status} — ${err.message}`);

  res.status(status).json(body);
};

module.exports = errorHandler;
