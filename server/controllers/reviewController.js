// TODO: implement in Day 2 — list reviews for a place and submit review handlers

const listReviews = async (_req, res) => {
  res.json({ data: [] });
};

const createReview = async (_req, res) => {
  res.status(201).json({ data: null });
};

module.exports = {
  listReviews,
  createReview,
};
