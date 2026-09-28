/**
 * scoringService.js — Exact 40/20/15/15/10 recommendation formula.
 *
 * ARCHITECTURE.md §6.2 invariant — weights are FIXED, do not alter:
 *   Final Score = 0.40×AspectMatch + 0.20×ContextMatch + 0.15×Sentiment
 *               + 0.15×TrustQuality + 0.10×OverallRating
 *
 * All component scores are normalized to [0, 100] before weighting.
 *
 * TODO Day 2: Replace naive keyword-based aspect estimates with real Gemini
 * analysis output from ReviewAnalysis collection once Day 2 pipeline is wired.
 */

const ASPECTS = ['quality', 'cleanliness', 'service', 'price', 'crowd', 'safety', 'accessibility', 'facilities'];

const BUDGET_ORDER = { low: 0, medium: 1, high: 2 };

/**
 * 40% — Aspect Match
 * Weighted dot product of user priorities vs venue aspect scores (0-100 each).
 *
 * @param {object} priorities - { quality: 1-5, cleanliness: 1-5, ... }
 * @param {object} aspectScores - { quality: 0-100|null, ... }
 * @returns {number} 0-100
 */
const computeAspectMatch = (priorities = {}, aspectScores = {}) => {
  const weights = {};
  let totalWeight = 0;
  for (const aspect of ASPECTS) {
    const w = priorities[aspect] || 0;
    weights[aspect] = w;
    totalWeight += w;
  }
  if (totalWeight === 0) return 50; // No preferences → neutral

  let score = 0;
  for (const aspect of ASPECTS) {
    const normWeight = weights[aspect] / totalWeight;
    const aspectVal = aspectScores[aspect] != null ? aspectScores[aspect] : 50; // default 50 when not scored
    score += normWeight * aspectVal;
  }
  return Math.round(Math.min(100, Math.max(0, score)));
};

/**
 * 20% — Context Match
 * Travel party fit (0-50) + Budget compatibility (0-50) → total 0-100.
 *
 * @param {string} budget - User's budget: 'low'|'medium'|'high'
 * @param {string} placePrice - Place's priceLevel: 'low'|'medium'|'high'
 * @returns {number} 0-100
 */
const computeContextMatch = (budget, placePrice) => {
  // Budget compatibility (0-50 pts)
  const userBudgetIdx = BUDGET_ORDER[budget] ?? 1;
  const placePriceIdx = BUDGET_ORDER[placePrice] ?? 1;
  const diff = Math.abs(userBudgetIdx - placePriceIdx);
  const budgetPts = diff === 0 ? 50 : diff === 1 ? 35 : 15;

  // Travel party / context compatibility (0-50 pts)
  // TODO Day 2: derive from real ReviewAnalysis crowd/service aspect patterns.
  // For now, all places get 40/50 as a neutral baseline.
  const contextPts = 40;

  return Math.round(Math.min(100, budgetPts + contextPts));
};

/**
 * 15% — Verified Sentiment
 * sentimentAverage (0.0-1.0) scaled to 0-100.
 *
 * @param {number} sentimentAverage
 * @returns {number} 0-100
 */
const computeSentimentScore = (sentimentAverage) => {
  const s = sentimentAverage != null ? sentimentAverage : 0.5;
  return Math.round(s * 100);
};

/**
 * 15% — Trust-Adjusted Quality
 * quality aspect score × (trustScore / 100)
 *
 * @param {number|null} qualityScore - 0-100 or null
 * @param {number} trustScore - 0-100
 * @returns {number} 0-100
 */
const computeTrustQuality = (qualityScore, trustScore) => {
  const q = qualityScore != null ? qualityScore : 50;
  const t = trustScore != null ? trustScore : 100;
  return Math.round(q * (t / 100));
};

/**
 * 10% — Overall Star Rating
 * Scales 1.0-5.0 to 0-100: (rating - 1.0) × 25
 *
 * @param {number} overallRating - 1.0-5.0
 * @returns {number} 0-100
 */
const computeRatingScore = (overallRating) => {
  const r = overallRating != null ? overallRating : 3.0;
  return Math.round(Math.min(100, Math.max(0, (r - 1.0) * 25)));
};

/**
 * Compute the final composite recommendation score for one place.
 *
 * TODO Day 2: aspectScores should come from ReviewAnalysis aggregate in DB
 * rather than the naive keyword estimates computed during seeding.
 *
 * @param {object} place - Mongoose Place document (with aggregateScores)
 * @param {object} preferences - { budget, priorities: { quality, cleanliness, … } }
 * @returns {{ finalScore: number, breakdown: object }}
 */
const scorePlace = (place, preferences = {}) => {
  const { budget = 'medium', priorities = {} } = preferences;
  const agg = place.aggregateScores || {};
  const aspects = agg.aspects || {};

  // Build a flat aspectScores map for the formula
  const aspectScores = {};
  for (const asp of ASPECTS) {
    aspectScores[asp] = aspects[asp] ? aspects[asp].avgScore : null;
  }

  const aspectMatch   = computeAspectMatch(priorities, aspectScores);
  const contextMatch  = computeContextMatch(budget, place.priceLevel);
  const sentiment     = computeSentimentScore(agg.sentimentAverage);
  const trustQuality  = computeTrustQuality(aspectScores.quality, agg.trustScore);
  const ratingScore   = computeRatingScore(place.overallRating);

  const finalScore = Math.round(
    0.40 * aspectMatch +
    0.20 * contextMatch +
    0.15 * sentiment +
    0.15 * trustQuality +
    0.10 * ratingScore
  );

  return {
    finalScore: Math.min(100, Math.max(0, finalScore)),
    breakdown: {
      aspectMatch,
      contextMatch,
      sentiment,
      trustQuality,
      ratingScore,
    },
  };
};

module.exports = {
  scorePlace,
  computeAspectMatch,
  computeContextMatch,
  computeSentimentScore,
  computeTrustQuality,
  computeRatingScore,
};
