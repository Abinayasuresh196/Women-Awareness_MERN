/**
 * JWT utility functions
 * Handles token generation and verification
 */

const jwt = require('jsonwebtoken');
const logger = require('./logger');

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 */
const generateToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    logger.error('JWT generation failed', error);
    throw new Error('Token generation failed');
  }
};

/**
 * Verify JWT token
 * @param {String} token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.warn('JWT verification failed');
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  generateToken,
  verifyToken
};
