const Joi = require('joi');

/**
 * Validation middleware that validates request data against Joi schema
 * @param {Object} schema - Joi validation schema object
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    // Collect all validation errors
    const errors = {};

    // Validate each part of the request based on schema
    ['body', 'params', 'query'].forEach((part) => {
      if (schema[part]) {
        const { error } = schema[part].validate(req[part], { abortEarly: false });
        if (error) {
          errors[part] = error.details.map(detail => detail.message);
        }
      }
    });

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

module.exports = validate;
