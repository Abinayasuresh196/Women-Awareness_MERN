/**
 * Law Routes
 * Handles all Law-related endpoints
 */

const express = require('express');
const router = express.Router();

// Controllers
const {
  createLaw,
  getAllLaws,
  getLawById,
  updateLaw,
  deleteLaw,
  approveLaw
} = require('../controllers/law.controller');

// Validations
const { lawValidation } = require('../validations/law.validation');

// Middleware
const protect = require('../middleware/auth.middleware'); // JWT auth
const authorize = require('../middleware/role.middleware'); // Role-based access

// Routes

// Create new law (only admin & super-admin)
router.post('/', protect, authorize('admin', 'super-admin'), lawValidation, createLaw);

// Get all laws (publicly accessible)
router.get('/', getAllLaws);

// Get single law by ID (publicly accessible)
router.get('/:id', getLawById);

// Update law by ID (only admin & super-admin)
router.put('/:id', protect, authorize('admin', 'super-admin'), lawValidation, updateLaw);

// Approve law by ID (admin & super-admin)
router.patch('/:id/approve', protect, authorize('admin', 'super-admin'), approveLaw);

// Delete law by ID (only super-admin)
router.delete('/:id', protect, authorize('super-admin'), deleteLaw);

module.exports = router;
