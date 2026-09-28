const express = require('express');
const { listPlaces, getPlaceById, getPlaceReviews } = require('../controllers/placeController');

const router = express.Router();

// GET /api/places                  — list all with optional ?city=&category=&budget=
// GET /api/places/:id              — single place by slug id
// GET /api/places/:id/reviews      — all reviews for a place

router.get('/', listPlaces);
router.get('/:id/reviews', getPlaceReviews);
router.get('/:id', getPlaceById);

module.exports = router;
