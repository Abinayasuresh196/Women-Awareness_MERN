/**
 * Scheme input validation
 * Validates creating or updating a government scheme entry
 */

const Joi = require('joi');

// Validation for creating or updating a scheme
const schemeValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(150)
      .required()
      .messages({
        'string.empty': 'Scheme name is required',
        'string.min': 'Scheme name must be at least 3 characters',
        'string.max': 'Scheme name cannot exceed 150 characters'
      }),
    name_ta: Joi.string()
      .min(3)
      .max(150)
      .required()
      .messages({
        'string.empty': 'Scheme name in Tamil is required',
        'string.min': 'Scheme name must be at least 3 characters',
        'string.max': 'Scheme name cannot exceed 150 characters'
      }),
    eligibility: Joi.string()
      .min(5)
      .required()
      .messages({
        'string.empty': 'Eligibility details are required',
        'string.min': 'Eligibility details must be at least 5 characters'
      }),
    eligibility_ta: Joi.string()
      .min(5)
      .required()
      .messages({
        'string.empty': 'Eligibility details in Tamil are required',
        'string.min': 'Eligibility details must be at least 5 characters'
      }),
    benefits: Joi.string()
      .min(5)
      .required()
      .messages({
        'string.empty': 'Benefits details are required',
        'string.min': 'Benefits details must be at least 5 characters'
      }),
    benefits_ta: Joi.string()
      .min(5)
      .required()
      .messages({
        'string.empty': 'Benefits details in Tamil are required',
        'string.min': 'Benefits details must be at least 5 characters'
      }),
    link: Joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'Link must be a valid URL'
      }),
    image: Joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'Image must be a valid URL'
      })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details.map((detail) => detail.message).join(', ')
    });
  }

  next(); // Valid data → proceed
};

module.exports = {
  schemeValidation
};
