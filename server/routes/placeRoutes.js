const express = require('express');
const { listPlaces, getPlaceById } = require('../controllers/placeController');

const router = express.Router();

// TODO: implement in Day 2 — GET /places, GET /places/:id

router.get('/', listPlaces);
router.get('/:id', getPlaceById);

module.exports = router;
