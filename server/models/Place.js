const mongoose = require('mongoose');

// TODO: implement in Day 1 — Place schema (name, category, location, rating aggregates)

const PlaceSchema = new mongoose.Schema(
  {},
  { timestamps: true }
);

module.exports = mongoose.model('Place', PlaceSchema);
