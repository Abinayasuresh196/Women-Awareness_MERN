/**
 * Admin Routes
 * Handles all Admin-related endpoints
 */

const express = require('express');
const router = express.Router();

// Controllers
const {
  registerAdmin: createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin
} = require('../controllers/admin.controller');

// Validations
const adminValidation = require('../validations/admin.validation').adminValidation;

// Middleware
const protect = require('../middleware/auth.middleware'); // JWT auth
const authorize = require('../middleware/role.middleware'); // Role check

// Routes

// Register new admin (accessible only by super-admin)
router.post(
  '/',
  protect,
  authorize('super-admin'),
  adminValidation,
  createAdmin
);

// Admin login (no auth required)
router.post('/login', loginAdmin);

// Public dashboard statistics (no auth required - for testing)
router.get('/dashboard/public-stats', require('../controllers/admin.controller').getPublicDashboardStats);

// Dashboard statistics (accessible by admin and super-admin)
router.get('/dashboard/stats', protect, authorize('admin', 'super-admin'), require('../controllers/admin.controller').getDashboardStats);

// Get all admins (accessible by super-admin)
router.get('/', protect, authorize('super-admin'), getAllAdmins);

// Get admin by ID (accessible by super-admin or self)
router.get('/:id', protect, authorize('super-admin', 'admin'), getAdminById);

// Update admin (accessible by super-admin or self)
router.put('/:id', protect, authorize('super-admin', 'admin'), adminValidation, updateAdmin);

// Delete admin (accessible only by super-admin)
router.delete('/:id', protect, authorize('super-admin'), deleteAdmin);

module.exports = router;
