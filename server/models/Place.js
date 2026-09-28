const mongoose = require('mongoose');

/**
 * Place Schema — canonical data model per ARCHITECTURE.md §4.1
 * _id is a string slug (e.g. 'p101') matching the seed data.
 */
const PlaceSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // slug: 'p101', 'p102', …
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['hotel', 'restaurant', 'cafe', 'attraction'],
      index: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    priceLevel: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    overallRating: {
      type: Number,
      required: true,
      min: 1.0,
      max: 5.0,
      default: 3.0,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    // Precomputed Aggregates — cached from ReviewAnalysis documents (populated by seed / reviewService)
    aggregateScores: {
      aspects: {
        quality:       { avgScore: { type: Number, default: null }, mentionCount: { type: Number, default: 0 } },
        cleanliness:   { avgScore: { type: Number, default: null }, mentionCount: { type: Number, default: 0 } },
        service:       { avgScore: { type: Number, default: null }, mentionCount: { type: Number, default: 0 } },
        price:         { avgScore: { type: Number, default: null }, mentionCount: { type: Number, default: 0 } },
        crowd:         { avgScore: { type: Number, default: null }, mentionCount: { type: Number, default: 0 } },
        safety:        { avgScore: { type: Number, default: null }, mentionCount: { type: Number, default: 0 } },
        accessibility: { avgScore: { type: Number, default: null }, mentionCount: { type: Number, default: 0 } },
        facilities:    { avgScore: { type: Number, default: null }, mentionCount: { type: Number, default: 0 } },
      },
      trustScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 100,
      },
      sentimentAverage: {
        type: Number, // 0.0 – 1.0
        default: 0.5,
      },
      sentimentSummary: {
        positiveCount: { type: Number, default: 0 },
        neutralCount:  { type: Number, default: 0 },
        negativeCount: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true }
);

PlaceSchema.index({ city: 1, category: 1 });

module.exports = mongoose.model('Place', PlaceSchema);
