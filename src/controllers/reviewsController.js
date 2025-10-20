const Review = require('../models/review');
const asyncHandler = require('../middleware/asyncHandler');

// Récupérer tous les avis
exports.getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.status(200).json(reviews);
});

// Créer un nouvel avis
exports.createReview = asyncHandler(async (req, res) => {
  const { name, rating, comment } = req.body;

  // Validation des données
  if (!name || !rating || !comment) {
    return res.status(400).json({
      error: 'Tous les champs requis: name, rating, comment',
    });
  }

  const numericRating = Number(rating);
  // eslint-disable-next-line prettier/prettier
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({
      error: 'La note doit être un nombre entre 1 et 5',
    });
  }

  const review = new Review({
    name: name.trim(),
    rating: +rating,
    comment: comment.trim(),
    createdAt: new Date(),
  });

  const savedReview = await review.save();
  res.status(201).json(savedReview);
});
