/**
 * Audit Log Model
 * Tracks all critical actions performed by Admins
 * Useful for monitoring, debugging, and security audits
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, 'Action description is required'],
      trim: true,
      maxlength: [300, 'Action description cannot exceed 300 characters']
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    ipAddress: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // simple IP address regex (IPv4)
          return !v || /^(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)(\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)){3}$/.test(v);
        },
        message: 'Invalid IP address format'
      }
    },
    userAgent: {
      type: String,
      trim: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // can store extra info (optional)
      default: {}
    }
  },
  {
    timestamps: true // createdAt & updatedAt
  }
);

// Optional: index for faster queries on admin and createdAt
auditLogSchema.index({ admin: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
