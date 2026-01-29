/**
 * AuditLog Routes
 * Handles all Audit Log-related endpoints
 */

const express = require('express');
const router = express.Router();

// Controllers
const AuditLogController = require('../controllers/auditLog.controller');
const getAllAuditLogs = AuditLogController.getAllLogs;
const getAuditLogById = AuditLogController.getLogById;
const deleteAuditLog = AuditLogController.deleteLog;

// Middleware
const protect = require('../middleware/auth.middleware'); // JWT authentication
const authorize = require('../middleware/role.middleware'); // Role-based access control

// Routes

// Get all audit logs (super-admin only)
router.get('/', protect, authorize('super-admin'), getAllAuditLogs);

// Get a single audit log by ID (super-admin only)
router.get('/:id', protect, authorize('super-admin'), getAuditLogById);

// Delete an audit log by ID (super-admin only)
router.delete('/:id', protect, authorize('super-admin'), deleteAuditLog);

module.exports = router;
