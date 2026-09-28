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
const ReviewAnalysis = require('../models/ReviewAnalysis');

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

  const analyses = await ReviewAnalysis.find({
    reviewId: { $in: reviews.map((r) => r._id) },
  }).lean();
  const byReview = Object.fromEntries(analyses.map((a) => [String(a.reviewId), a]));
  const hydrated = reviews.map((review) => ({
    ...review,
    analysis: byReview[String(review._id)] || null,
  }));

  return { reviews: hydrated, total, page, limit };
};

/**
 * Aggregate trust, sentiment, and evidence quotes for a place.
 */
const getPlaceIntelligence = async (placeId) => {
  const place = await Place.findById(placeId).lean();
  if (!place) return null;

  const analyses = await ReviewAnalysis.find({ placeId }).lean();
  const trustDistribution = { higherTrust: 0, medium: 0, highRisk: 0 };

  for (const analysis of analyses) {
    const level = analysis.trustSignal?.level;
    if (level === 'higher-trust') trustDistribution.higherTrust += 1;
    else if (level === 'high-risk') trustDistribution.highRisk += 1;
    else trustDistribution.medium += 1;
  }

  return {
    placeId,
    place,
    trustDistribution,
    sentimentSummary: place.aggregateScores?.sentimentSummary ?? {
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
    },
    positiveEvidence: analyses.flatMap((a) => a.positiveEvidence || []).slice(0, 8),
    negativeEvidence: analyses.flatMap((a) => a.negativeEvidence || []).slice(0, 8),
    trustScore: place.aggregateScores?.trustScore ?? 0,
  };
};

module.exports = { listReviewsForPlace, getPlaceIntelligence };
