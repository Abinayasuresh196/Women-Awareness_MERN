const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('./middleware/mongoSanitize.middleware');

const corsConfig = require('./config/cors');
const errorHandler = require('./middleware/error.middleware');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Route imports
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');
const lawRoutes = require('./routes/law.routes');
const schemeRoutes = require('./routes/scheme.routes');
const articleRoutes = require('./routes/article.routes');
const auditLogRoutes = require('./routes/auditLog.routes');
const aiRoutes = require('./routes/ai.routes');
const womenResourceRoutes = require('./routes/womenResource.routes');
const feedbackRoutes = require('./routes/feedback.routes');

const app = express();

/* ==========================
   DATABASE CONNECTION
========================== */
connectDB();

/* ==========================
   GLOBAL MIDDLEWARES
========================== */
app.use(corsConfig);
app.use(helmet()); // Security headers
app.use(mongoSanitize()); // Prevent NoSQL injection

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again later.'
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* ==========================
   HEALTH CHECK
========================== */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Women Awareness API is running'
  });
});

/* ==========================
   API ROUTES
========================== */
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/laws', lawRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/women-resources', womenResourceRoutes);
app.use('/api/feedback', feedbackRoutes);

/* ==========================
   404 HANDLER
========================== */
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

/* ==========================
   GLOBAL ERROR HANDLER
========================== */
app.use(errorHandler);

module.exports = app;
