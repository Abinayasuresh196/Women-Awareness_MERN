/**
 * Admin input validation
 * Uses Joi to validate incoming requests
 */

const Joi = require('joi');

// Admin login validation
const loginValidation = (req, res, next) => {
  // Define schema
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be valid'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters'
      })
  });

  // Validate request body
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((detail) => detail.message).join(', ')
    });
  }

  next(); // Proceed if valid
};

module.exports = {
  loginValidation,
  adminValidation: loginValidation
};
