const express = require('express');

const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

// GET /api/reviews - Récupérer tous les avis
router.get('/', reviewsController.getAllReviews);

// POST /api/reviews - Créer un nouvel avis
router.post('/', reviewsController.createReview);

module.exports = router;
