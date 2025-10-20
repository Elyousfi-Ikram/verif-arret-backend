const errorHandler = (err, _req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur
  // console.error(err);

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = {
      statusCode: 400,
      message: message.join(', '),
    };
  }

  // Erreur de duplication Mongoose
  if (err.code === 11000) {
    const message = 'Ressource déjà existante';
    error = {
      statusCode: 400,
      message,
    };
  }

  // Erreur CastError Mongoose
  if (err.name === 'CastError') {
    const message = 'Ressource non trouvée';
    error = {
      statusCode: 404,
      message,
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erreur serveur',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
