/**
 * Scheme Routes
 * Handles all Scheme-related endpoints
 */

const express = require('express');
const router = express.Router();

// Controllers
const {
  createScheme,
  getAllSchemes,
  getSchemeById,
  updateScheme,
  deleteScheme,
  approveScheme,
  getSchemeRecommendations
} = require('../controllers/scheme.controller');

// Validations
const { schemeValidation } = require('../validations/scheme.validation');

// Middleware
const protect = require('../middleware/auth.middleware'); // JWT authentication
const authorize = require('../middleware/role.middleware'); // Role-based access control

// Routes

// Create a new scheme (admin & super-admin)
router.post('/', protect, authorize('admin', 'super-admin'), schemeValidation, createScheme);

// Get all schemes (publicly accessible)
router.get('/', getAllSchemes);

// Get single scheme by ID (publicly accessible)
router.get('/:id', getSchemeById);

// Update scheme by ID (admin & super-admin)
router.put('/:id', protect, authorize('admin', 'super-admin'), schemeValidation, updateScheme);

// Delete scheme by ID (super-admin only)
router.delete('/:id', protect, authorize('super-admin'), deleteScheme);

// Approve scheme by ID (admin & super-admin)
router.patch('/:id/approve', protect, authorize('admin', 'super-admin'), approveScheme);

// Get AI-powered scheme recommendations (any logged-in user)
router.post('/recommend', protect, getSchemeRecommendations);

module.exports = router;
