const mongoose = require('mongoose');

// TODO: implement in Day 3 — ReviewAnalysis schema (Gemini output, trust signals, aspect scores)

const ReviewAnalysisSchema = new mongoose.Schema(
  {},
  { timestamps: true }
);

module.exports = mongoose.model('ReviewAnalysis', ReviewAnalysisSchema);
