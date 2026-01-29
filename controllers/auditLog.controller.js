/**
 * AuditLog Controller
 * Handles HTTP requests related to Audit Logs
 */

const AuditLogService = require('../services/auditLog.service');

class AuditLogController {
  // Get all audit logs
  static async getAllLogs(req, res, next) {
    try {
      const logs = await AuditLogService.getAll();
      res.status(200).json({ success: true, data: logs });
    } catch (err) {
      next(err);
    }
  }

  // Get a single audit log by ID
  static async getLogById(req, res, next) {
    try {
      const log = await AuditLogService.getById(req.params.id);
      res.status(200).json({ success: true, data: log });
    } catch (err) {
      next(err);
    }
  }

  // Create a new audit log
  static async createLog(req, res, next) {
    try {
      const log = await AuditLogService.create(req.body);
      res.status(201).json({ success: true, data: log });
    } catch (err) {
      next(err);
    }
  }

  // Delete an audit log by ID
  static async deleteLog(req, res, next) {
    try {
      await AuditLogService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Audit log deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuditLogController;
