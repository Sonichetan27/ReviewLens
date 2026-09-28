/**
 * recommendationService.js — End-to-end recommendation orchestration.
 *
 * Responsibilities per ARCHITECTURE.md §3.2:
 * - Filter candidate places by city and category
 * - Delegate scoring to scoringService (40/20/15/15/10 formula)
 * - Sort descending by finalScore
 * - Generate traceable "Why Recommended" bullets per §6.3 rules
 */

const Place = require('../models/Place');
const { scorePlace } = require('./scoringService');

const ASPECTS = ['quality', 'cleanliness', 'service', 'price', 'crowd', 'safety', 'accessibility', 'facilities'];
const ASPECT_LABELS = {
  quality: 'Quality', cleanliness: 'Cleanliness', service: 'Service',
  price: 'Price & Value', crowd: 'Crowd Level', safety: 'Safety',
  accessibility: 'Accessibility', facilities: 'Facilities',
};

/**
 * Build traceable "Why Recommended" bullets per ARCHITECTURE.md §6.3.
 *
 * @param {object} place        - Place document
 * @param {object} preferences  - User preferences
 * @param {object} breakdown    - scorePlace breakdown object
 * @returns {string[]}          - 2-4 human-readable bullet strings
 */
const buildWhyBullets = (place, preferences, breakdown) => {
  const bullets = [];
  const { priorities = {}, budget } = preferences;
  const agg = place.aggregateScores || {};
  const aspects = agg.aspects || {};

  // Bullet 1 — Top aspect alignment (only if user weight ≥4 AND score ≥80)
  for (const asp of ASPECTS) {
    if ((priorities[asp] || 0) >= 4) {
      const score = aspects[asp] && aspects[asp].avgScore != null ? aspects[asp].avgScore : null;
      if (score !== null && score >= 80) {
        const count = aspects[asp].mentionCount || 0;
        bullets.push(
          `${ASPECT_LABELS[asp]} rated ${score}/100 across ${count} review mention${count !== 1 ? 's' : ''}, matching your top preference.`
        );
        break; // One aspect bullet max
      }
    }
  }

  // Bullet 2 — Context compatibility (only if contextMatch ≥80)
  if (breakdown.contextMatch >= 80) {
    bullets.push(
      `Strong budget compatibility — ${place.priceLevel} price tier aligns with your ${budget || 'medium'} budget preference.`
    );
  }

  // Bullet 3 — Trust & authenticity (always shown)
  const trustScore = agg.trustScore != null ? agg.trustScore : 100;
  const trustLevel = trustScore >= 80 ? 'Higher-Trust' : trustScore >= 50 ? 'Medium' : 'High-Risk';
  bullets.push(
    `${Math.round(trustScore)}% Review Trust Signal (${trustLevel}): ${place.reviewCount || 0} customer reviews evaluated.`
  );

  // Bullet 4 — Sentiment signal (if clearly positive)
  if ((agg.sentimentAverage || 0) >= 0.7) {
    const positiveCount = (agg.sentimentSummary || {}).positiveCount || 0;
    bullets.push(
      `${positiveCount} of ${place.reviewCount || 0} reviews express clearly positive sentiment about this venue.`
    );
  }

  return bullets.slice(0, 4); // Maximum 4 bullets
};

/**
 * Get ranked recommendations matching user preferences.
 *
 * @param {object} preferences - { destination, placeType, budget, priorities }
 * @returns {Promise<object[]>} - Ranked list of { place, finalScore, breakdown, whyBullets }
 */
const getRecommendations = async (preferences = {}) => {
  const { destination, placeType, budget = 'medium', priorities = {} } = preferences;

  // Build MongoDB query filter
  const filter = {};
  if (destination) filter.city = { $regex: new RegExp(`^${destination}$`, 'i') };
  if (placeType) filter.category = placeType.toLowerCase();

  const candidates = await Place.find(filter).lean();

  // Score, sort, and annotate each candidate
  const scored = candidates.map(place => {
    const { finalScore, breakdown } = scorePlace(place, { budget, priorities });
    const whyBullets = buildWhyBullets(place, preferences, breakdown);
    return { place, finalScore, breakdown, whyBullets };
  });

  scored.sort((a, b) => b.finalScore - a.finalScore);

  return scored;
};

module.exports = { getRecommendations };
