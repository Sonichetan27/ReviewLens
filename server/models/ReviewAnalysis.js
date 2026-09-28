const mongoose = require('mongoose');

/**
 * ReviewAnalysis Schema — per ARCHITECTURE.md §4.3
 * Stores output from aiService (Gemini or mock) + trustService heuristics.
 */
const ReviewAnalysisSchema = new mongoose.Schema(
  {
    reviewId: {
      type: String,
      ref: 'Review',
      required: true,
      unique: true,
      index: true,
    },
    placeId: {
      type: String,
      ref: 'Place',
      required: true,
      index: true,
    },
    // ── AI extraction output (Gemini or deterministic mock) ──────────────────
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      required: true,
    },
    sentimentScore: {
      type: Number,
      min: 0.0,
      max: 1.0,
      required: true,
    },
    // The 8 canonical aspects — null if not mentioned in the review text
    aspectScores: {
      quality:       { type: Number, min: 0, max: 100, default: null },
      cleanliness:   { type: Number, min: 0, max: 100, default: null },
      service:       { type: Number, min: 0, max: 100, default: null },
      price:         { type: Number, min: 0, max: 100, default: null },
      crowd:         { type: Number, min: 0, max: 100, default: null },
      safety:        { type: Number, min: 0, max: 100, default: null },
      accessibility: { type: Number, min: 0, max: 100, default: null },
      facilities:    { type: Number, min: 0, max: 100, default: null },
    },
    mentionedAspects: [{ type: String }],
    positiveEvidence: [{ type: String }],
    negativeEvidence: [{ type: String }],
    summary: {
      type: String,
      maxlength: 300,
      trim: true,
    },
    confidence: {
      type: Number,
      min: 0.0,
      max: 1.0,
      required: true,
    },
    // ── Deterministic trustService output ────────────────────────────────────
    trustSignal: {
      trustScore: { type: Number, min: 0, max: 100, required: true },
      level: {
        type: String,
        enum: ['higher-trust', 'medium', 'high-risk'],
        required: true,
      },
      reasons: [{ type: String }],
    },
    aiModel: {
      type: String,
      default: 'mock',
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ReviewAnalysisSchema.index({ placeId: 1, 'trustSignal.trustScore': -1 });

module.exports = mongoose.model('ReviewAnalysis', ReviewAnalysisSchema);
