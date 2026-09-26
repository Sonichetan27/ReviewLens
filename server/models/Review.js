const mongoose = require('mongoose');

// TODO: implement in Day 1 — Review schema (place, text, rating, author, source)

const ReviewSchema = new mongoose.Schema(
  {},
  { timestamps: true }
);

module.exports = mongoose.model('Review', ReviewSchema);
