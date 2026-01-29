/**
 * Article Routes
 * Handles all Article-related endpoints
 */

const express = require('express');
const router = express.Router();

// Controllers
const {
  createArticle,
  getAllArticles,
  submitArticle,
  getPendingArticles,
  reviewArticle,
  getArticleById,
  updateArticle,
  deleteArticle
} = require('../controllers/article.controller');

// Validations
const { articleValidation } = require('../validations/article.validation');

// Middleware
const protect = require('../middleware/auth.middleware'); // JWT authentication
const authorize = require('../middleware/role.middleware'); // Role-based access control

// Routes

// Create a new article (admin & super-admin)
router.post('/', protect, authorize('admin', 'super-admin'), articleValidation, createArticle);

// Submit article for approval (authenticated users)
router.post('/submit', protect, articleValidation, submitArticle);

// Get pending articles for admin review (admin only)
router.get('/pending', protect, authorize('admin', 'super-admin'), getPendingArticles);

// Review article (approve/reject) (admin only)
router.put('/:id/review', protect, authorize('admin', 'super-admin'), reviewArticle);

// Get all articles (publicly accessible)
router.get('/', getAllArticles);

// Get single article by ID (publicly accessible)
router.get('/:id', getArticleById);

// Update article by ID (admin & super-admin)
router.put('/:id', protect, authorize('admin', 'super-admin'), articleValidation, updateArticle);

// Delete article by ID (super-admin only)
router.delete('/:id', protect, authorize('super-admin'), deleteArticle);

module.exports = router;
