/**
 * validateRequest.js — Request validation middleware.
 *
 * Validates and sanitizes recommendation POST body.
 * Review text is clamped to 2000 chars and stripped of control characters
 * per ARCHITECTURE.md §8.2 (Payload Validation & Clamping).
 */

/**
 * Validate POST /api/recommendations body.
 * Required: { destination, placeType, budget, priorities }
 */
const validateRecommendationBody = (req, res, next) => {
  const { destination, placeType, budget, priorities } = req.body || {};
  const validBudgets    = ['low', 'medium', 'high'];
  const validPlaceTypes = ['hotel', 'restaurant', 'cafe', 'attraction'];

  if (!destination || typeof destination !== 'string' || destination.trim().length === 0) {
    return res.status(400).json({ error: '"destination" is required and must be a non-empty string.' });
  }
  if (placeType && !validPlaceTypes.includes(placeType.toLowerCase())) {
    return res.status(400).json({ error: `"placeType" must be one of: ${validPlaceTypes.join(', ')}.` });
  }
  if (budget && !validBudgets.includes(budget.toLowerCase())) {
    return res.status(400).json({ error: `"budget" must be one of: ${validBudgets.join(', ')}.` });
  }
  if (priorities && typeof priorities !== 'object') {
    return res.status(400).json({ error: '"priorities" must be an object of aspect weights.' });
  }
  next();
};

/**
 * Sanitize review text — strip control characters, clamp to 2000 chars.
 */
const sanitizeReviewBody = (req, _res, next) => {
  if (req.body && req.body.text) {
    // Strip control characters (potential prompt injection)
    req.body.text = req.body.text.replace(/[\x00-\x1F\x7F]/g, ' ').slice(0, 2000).trim();
  }
  next();
};

module.exports = { validateRecommendationBody, sanitizeReviewBody };
