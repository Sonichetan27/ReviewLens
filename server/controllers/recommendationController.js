/**
 * recommendationController.js — HTTP boundary for the recommendation endpoint.
 *
 * Delegates entirely to recommendationService which orchestrates
 * scoringService (40/20/15/15/10 formula) per ARCHITECTURE.md §3.1.
 */

const mongoose = require('mongoose');
const { getRecommendations } = require('../services/recommendationService');

/**
 * POST /api/recommendations
 * Body: { destination, placeType, budget, priorities: { quality, cleanliness, ... } }
 */
const postRecommendations = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Database not connected. Please ensure MongoDB is running and configured.',
        data: [],
        count: 0,
        preferences: req.body
      });
    }

    const preferences = req.body;
    const results = await getRecommendations(preferences);

    res.json({
      data: results.map(r => ({
        place: r.place,
        finalScore: r.finalScore,
        breakdown: r.breakdown,
        whyBullets: r.whyBullets,
      })),
      count: results.length,
      preferences,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { postRecommendations };
