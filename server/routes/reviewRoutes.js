const express = require('express');
const { listReviews, createReview } = require('../controllers/reviewController');

const router = express.Router();

// TODO: implement in Day 2 — GET /reviews, POST /reviews

router.get('/', listReviews);
router.post('/', createReview);

module.exports = router;
