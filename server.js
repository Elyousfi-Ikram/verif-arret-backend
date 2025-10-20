const http = require('http');
const app = require('./app');

// Import des middlewares
const errorHandler = require('./src/middleware/errorHandler');

const port = process.env.PORT || process.env.SERVER_PORT || 3000;

// Validation du port
if (Number.isNaN(Number(port)) || port < 1 || port > 65535) {
  console.error('❌ Port invalide:', port);
  process.exit(1);
}

// Démarrage du serveur selon l'environnement
const server = http.createServer(app);

if (process.env.NODE_ENV === 'prod') {
  console.log('Production server starting...');
} else if (process.env.NODE_ENV === 'dev') {
  console.log('Development server starting...');
}

server.on('error', errorHandler);

server.listen(port, () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  console.log(`HTTPS Server listening on ${bind}`);
  console.log(`Server URL: ${process.env.SERVER_URL}:${port}`);
});
