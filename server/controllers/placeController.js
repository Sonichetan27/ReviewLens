/**
 * placeController.js — HTTP boundary for place-related endpoints.
 *
 * Zero business logic here — only param extraction, delegation to service layer,
 * and standardized JSON response emission per ARCHITECTURE.md §3.1.
 */

const mongoose = require('mongoose');
const Place = require('../models/Place');
const { listReviewsForPlace, getPlaceIntelligence } = require('../services/reviewService');

/**
 * GET /api/places
 * Optional query params: city, category, budget (maps to priceLevel)
 */
const listPlaces = async (req, res, next) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Database not connected. Please ensure MongoDB is running and configured.',
        data: [],
        count: 0
      });
    }

    const { city, category, budget } = req.query;
    const filter = {};

    if (city)     filter.city     = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
    if (category) filter.category = category.toLowerCase();
    if (budget)   filter.priceLevel = budget.toLowerCase();

    const places = await Place.find(filter).sort({ overallRating: -1 }).lean();
    res.json({ data: places, count: places.length });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/places/:id
 */
const getPlaceById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Database not connected. Please ensure MongoDB is running and configured.' 
      });
    }

    const place = await Place.findById(req.params.id).lean();
    if (!place) {
      return res.status(404).json({ error: `Place not found: ${req.params.id}` });
    }
    res.json({ data: place });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/places/:id/reviews
 * Optional query params: page, limit
 */
const getPlaceReviews = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Database not connected. Please ensure MongoDB is running and configured.',
        data: [],
        meta: { total: 0, page: 1, limit: 20 }
      });
    }

    const place = await Place.findById(req.params.id).select('_id name').lean();
    if (!place) {
      return res.status(404).json({ error: `Place not found: ${req.params.id}` });
    }

    const result = await listReviewsForPlace(req.params.id, req.query);
    res.json({
      data: result.reviews,
      meta: { total: result.total, page: result.page, limit: result.limit },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/places/:id/intelligence
 */
const getPlaceIntelligenceById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Database not connected. Please ensure MongoDB is running and configured.' 
      });
    }

    const intelligence = await getPlaceIntelligence(req.params.id);
    if (!intelligence) {
      return res.status(404).json({ error: `Place not found: ${req.params.id}` });
    }
    res.json({ data: intelligence });
  } catch (err) {
    next(err);
  }
};

module.exports = { listPlaces, getPlaceById, getPlaceReviews, getPlaceIntelligenceById };
