const express = require('express');
const { listReviews, createReview, getIntelligence } = require('../controllers/reviewController');
const { sanitizeReviewBody } = require('../middleware/validateRequest');

const router = express.Router();

// GET /api/reviews?placeId=:id   — list reviews for a place
// POST /api/reviews               — submit a new review (Day 2)

router.get('/intelligence/:placeId', getIntelligence);
router.get('/', listReviews);
router.post('/', sanitizeReviewBody, createReview);

module.exports = router;
