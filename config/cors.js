/**
 * CORS configuration
 * Allows controlled access from frontend applications
 */

const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    // For development, allow common localhost ports
    const allowedOrigins = [
      'http://localhost:3000', // React dev
      'http://localhost:5173', // Vite dev
      'http://localhost:5174', // Alternative Vite port
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://localhost:3001', // Alternative port
      'http://127.0.0.1:3001',
      // Production domains
      'https://women-awareness-app.netlify.app',
      'https://stalwart-halva-2a59d8.netlify.app', // Previous Netlify domain
      'https://keen-sorbet-c9a258.netlify.app', // Another Netlify domain
      'https://697c4ccf19eba7dde7db0799--keen-sorbet-c9a258.netlify.app', // Previous deploy preview
      'https://697c503f01a9fbe4caf986bb--keen-sorbet-c9a258.netlify.app', // Current deploy preview
      'https://women-awareness-mern-1.onrender.com'
    ];

    // Check if origin is in allowed list or matches allowed patterns
    if (allowedOrigins.includes(origin)) {
      console.log(`CORS allowed origin: ${origin}`);
      callback(null, true);
    } else if (origin && (
      origin.includes('netlify.app') || // Allow all Netlify domains
      origin.includes('localhost') || // Allow all localhost
      origin.includes('127.0.0.1') // Allow all local IP
    )) {
      console.log(`CORS allowed origin (pattern match): ${origin}`);
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('CORS policy: Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
