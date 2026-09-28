const mongoose = require('mongoose');

/**
 * Review Schema — per ARCHITECTURE.md §4.2
 * _id is a string slug (e.g. 'r1') matching the seed data.
 */
const ReviewSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // slug: 'r1', 'r2', …
      required: true,
    },
    placeId: {
      type: String,
      ref: 'Place',
      required: [true, 'placeId is required'],
      index: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxlength: 2000,
    },
    visitType: {
      type: String,
      enum: ['solo', 'couple', 'family', 'business', 'friends', 'other'],
      default: 'other',
    },
    analyzed: {
      type: Boolean,
      default: false,
      index: true,
    },
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReviewAnalysis',
      default: null,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ placeId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
