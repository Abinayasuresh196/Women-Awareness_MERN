/**
 * Law input validation
 * Validates creating or updating a law entry
 */

const Joi = require('joi');

// Validation for creating or updating a law
const lawValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(3)
      .max(200)
      .required()
      .messages({
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title cannot exceed 200 characters'
      }),
    title_ta: Joi.string()
      .min(3)
      .max(200)
      .optional()
      .messages({
        'string.min': 'Tamil title must be at least 3 characters',
        'string.max': 'Tamil title cannot exceed 200 characters'
      }),
    description: Joi.string()
      .min(10)
      .required()
      .messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 10 characters'
      }),
    description_ta: Joi.string()
      .min(10)
      .optional()
      .messages({
        'string.min': 'Tamil description must be at least 10 characters'
      }),
    category: Joi.string()
      .valid('constitutional', 'protection', 'marriage', 'property', 'health', 'political', 'Criminal', 'Civil', 'Constitutional', 'Other')
      .required()
      .messages({
        'any.only': 'Category must be one of the valid options',
        'string.empty': 'Category is required'
      }),
    subCategory: Joi.string()
      .optional()
      .messages({
        'string.empty': 'Sub-category cannot be empty'
      }),
    image: Joi.string()
      .optional()
      .messages({
        'string.empty': 'Image URL cannot be empty'
      }),
    link: Joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'Link must be a valid URL'
      }),
    effectiveDate: Joi.date()
      .optional()
      .messages({
        'date.base': 'Effective date must be a valid date'
      }),
    isActive: Joi.boolean()
      .optional()
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
  lawValidation
};
