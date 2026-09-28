const express = require('express');
const { postRecommendations } = require('../controllers/recommendationController');
const { validateRecommendationBody } = require('../middleware/validateRequest');

const router = express.Router();

// POST /api/recommendations — compute ranked recommendations from user preferences

router.post('/', validateRecommendationBody, postRecommendations);

module.exports = router;
