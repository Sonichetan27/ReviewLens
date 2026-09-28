/**
 * reviewController.js — HTTP boundary for review-related endpoints.
 *
 * Zero business logic here — delegates to reviewService per ARCHITECTURE.md §3.1.
 */

const { listReviewsForPlace, getPlaceIntelligence } = require('../services/reviewService');

/**
 * GET /api/reviews?placeId=:id
 */
const listReviews = async (req, res, next) => {
  try {
    const { placeId } = req.query;
    if (!placeId) {
      return res.status(400).json({ error: '"placeId" query parameter is required.' });
    }
    const result = await listReviewsForPlace(placeId, req.query);
    res.json({
      data: result.reviews,
      meta: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/reviews
 * Stub — Day 2 implementation will orchestrate aiService + trustService.
 */
const createReview = async (_req, res) => {
  // TODO Day 2: implement review submission, aiService analysis, trustService scoring, and place aggregate recomputation
  res.status(501).json({ error: 'Review submission not yet implemented (planned for Day 2).' });
};

/**
 * GET /api/reviews/intelligence/:placeId
 */
const getIntelligence = async (req, res, next) => {
  try {
    const intelligence = await getPlaceIntelligence(req.params.placeId);
    if (!intelligence) {
      return res.status(404).json({ error: `Place not found: ${req.params.placeId}` });
    }
    res.json({ data: intelligence });
  } catch (err) {
    next(err);
  }
};

module.exports = { listReviews, createReview, getIntelligence };
