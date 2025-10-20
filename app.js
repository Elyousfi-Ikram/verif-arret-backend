const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
const env = process.env.NODE_ENV || 'dev';
dotenv.config({ path: `env/${env}.env` });
const mongodbUri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority&appName=${process.env.MONGODB_APP_NAME}`;

if (env === 'dev') {
  console.log('mongodbUri', mongodbUri);
}

const app = express();

// Import des middlewares
const errorHandler = require('./src/middleware/errorHandler');

// Import des routes
const reviewsRoutes = require('./src/routes/reviews');

const corsOptions = {
  origin: function (origin, callback) {
    // Permettre les requêtes sans origin (ex: applications mobiles, Postman)
    if (!origin) return callback(null, true);

    const allowedOrigins = [];

    // Ajouter les origines depuis les variables d'environnement
    if (process.env.CORS_ORIGIN) {
      const envOrigins = process.env.CORS_ORIGIN.split(',').map((o) =>
        o.trim(),
      );
      allowedOrigins.push(...envOrigins);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS: Origin ${origin} not allowed`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  optionsSuccessStatus: 200, // Pour supporter les anciens navigateurs
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/reviews', reviewsRoutes);

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler);

mongoose
  .connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch((error) => {
    console.log('❌ Connexion à MongoDB échouée !');
    console.error("Détails de l'erreur:", error.message);
    process.exit(1);
  });

module.exports = app;
