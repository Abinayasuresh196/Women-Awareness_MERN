/**
 * AuditLog Service
 * Handles all database operations related to Audit Logs
 */

const AuditLog = require('../models/AuditLog.model');

class AuditLogService {
  // Create a new audit log
  static async create(data) {
    const log = await AuditLog.create(data);
    return log;
  }

  // Get all audit logs
  static async getAll() {
    const logs = await AuditLog.find().sort({ createdAt: -1 });
    return logs;
  }

  // Get audit log by ID
  static async getById(id) {
    const log = await AuditLog.findById(id);
    if (!log) {
      throw new Error('Audit log not found');
    }
    return log;
  }

  // Delete audit log by ID
  static async delete(id) {
    const log = await AuditLog.findByIdAndDelete(id);
    if (!log) {
      throw new Error('Audit log not found');
    }
    return true;
  }
}

module.exports = AuditLogService;
