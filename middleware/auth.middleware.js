/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */

const { verifyToken } = require('../utils/jwt');
const logger = require('../utils/logger');

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token missing'
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    logger.warn('Authentication failed');

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = protect;
