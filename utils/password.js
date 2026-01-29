/**
 * Password utility functions
 * Handles hashing and comparison securely
 */

const bcrypt = require('bcryptjs');
const logger = require('./logger');

const SALT_ROUNDS = 12;

/**
 * Hash plain password
 * @param {String} password
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    logger.error('Password hashing failed', error);
    throw new Error('Password hashing failed');
  }
};

/**
 * Compare plain password with hashed password
 * @param {String} password
 * @param {String} hashedPassword
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Password comparison failed', error);
    throw new Error('Password comparison failed');
  }
};

module.exports = {
  hashPassword,
  comparePassword
};
