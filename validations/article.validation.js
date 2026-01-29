/**
 * Article input validation
 * Validates creating or updating an article entry
 */

const Joi = require('joi');

// Validation for creating or updating an article
const articleValidation = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.empty': 'Article title is required',
        'string.min': 'Article title must be at least 5 characters',
        'string.max': 'Article title cannot exceed 200 characters'
      }),
    title_ta: Joi.string()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.empty': 'Article title in Tamil is required',
        'string.min': 'Article title in Tamil must be at least 5 characters',
        'string.max': 'Article title in Tamil cannot exceed 200 characters'
      }),
    content: Joi.string()
      .min(20)
      .required()
      .messages({
        'string.empty': 'Article content is required',
        'string.min': 'Article content must be at least 20 characters'
      }),
    content_ta: Joi.string()
      .min(20)
      .required()
      .messages({
        'string.empty': 'Article content in Tamil is required',
        'string.min': 'Article content in Tamil must be at least 20 characters'
      }),
    category: Joi.string()
      .valid('Health', 'Education', 'Legal', 'Employment', 'General')
      .required()
      .messages({
        'any.only': 'Category must be one of: Health, Education, Legal, Employment, General',
        'string.empty': 'Category is required'
      }),
    summary: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Summary cannot exceed 500 characters'
      }),
    summary_ta: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Summary in Tamil cannot exceed 500 characters'
      }),
    image: Joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'Image must be a valid URL'
      }),
    tags: Joi.array()
      .items(Joi.string().min(2))
      .optional()
      .messages({
        'array.base': 'Tags must be an array of strings',
        'string.min': 'Each tag must be at least 2 characters'
      }),
    status: Joi.string()
      .valid('pending', 'approved', 'rejected')
      .optional()
      .messages({
        'any.only': 'Status must be one of: pending, approved, rejected'
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
  articleValidation
};
