/**
 * Role-based authorization middleware
 * Restricts access based on user role
 */

const logger = require('../utils/logger');

/**
 * @param {...String} allowedRoles
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Handle case where allowedRoles might be nested
      let flatAllowedRoles = [];
      allowedRoles.forEach(role => {
        if (Array.isArray(role)) {
          flatAllowedRoles = flatAllowedRoles.concat(role);
        } else {
          flatAllowedRoles.push(role);
        }
      });

      if (!req.user || !req.user.role) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      if (!flatAllowedRoles.includes(req.user.role)) {
        logger.warn(`Unauthorized role access attempt: User ${req.user.id} with role ${req.user.role} tried to access ${req.originalUrl}`);

        return res.status(403).json({
          success: false,
          message: `You do not have permission to perform this action. Required roles: ${flatAllowedRoles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      logger.error('Role authorization failed', error);

      return res.status(500).json({
        success: false,
        message: 'Authorization error'
      });
    }
  };
};

module.exports = authorize;
