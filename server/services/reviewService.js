/**
 * reviewService.js — Review CRUD operations and place aggregate recomputation.
 *
 * Responsibilities per ARCHITECTURE.md §3.2:
 * - List reviews for a place
 * - Orchestrate AI analysis caching (delegates to aiService)
 * - Recompute place-level aggregate scores after new reviews
 */

const Review = require('../models/Review');
const Place = require('../models/Place');

const ASPECTS = ['quality', 'cleanliness', 'service', 'price', 'crowd', 'safety', 'accessibility', 'facilities'];

/**
 * Retrieve paginated reviews for a given placeId.
 *
 * @param {string} placeId
 * @param {object} opts - { page, limit }
 * @returns {Promise<object[]>}
 */
const listReviewsForPlace = async (placeId, opts = {}) => {
  const page  = Math.max(1, parseInt(opts.page)  || 1);
  const limit = Math.min(50, Math.max(1, parseInt(opts.limit) || 20));
  const skip  = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ placeId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Review.countDocuments({ placeId }),
  ]);

  return { reviews, total, page, limit };
};

module.exports = { listReviewsForPlace };
