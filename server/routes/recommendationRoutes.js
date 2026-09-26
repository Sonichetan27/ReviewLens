const express = require('express');
const { getRecommendations } = require('../controllers/recommendationController');

const router = express.Router();

// TODO: implement in Day 4 — GET /recommendations

router.get('/', getRecommendations);

module.exports = router;
