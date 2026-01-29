const Joi = require('joi');

// Validation for creating feedback
const createFeedback = {
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(100)
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      }),
    email: Joi.string()
      .required()
      .email()
      .lowercase()
      .trim()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    message: Joi.string()
      .required()
      .trim()
      .min(10)
      .max(1000)
      .messages({
        'string.empty': 'Message is required',
        'string.min': 'Message must be at least 10 characters long',
        'string.max': 'Message cannot exceed 1000 characters',
        'any.required': 'Message is required'
      })
  })
};

// Validation for updating feedback status (admin only)
const updateFeedbackStatus = {
  params: Joi.object().keys({
    feedbackId: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Invalid feedback ID format'
      })
  }),
  body: Joi.object().keys({
    status: Joi.string()
      .valid('pending', 'reviewed', 'responded')
      .required()
      .messages({
        'any.only': 'Status must be one of: pending, reviewed, responded'
      }),
    adminResponse: Joi.string()
      .when('status', {
        is: 'responded',
        then: Joi.string().required().trim().max(1000).messages({
          'string.empty': 'Admin response is required when status is responded',
          'string.max': 'Admin response cannot exceed 1000 characters'
        }),
        otherwise: Joi.string().optional().trim().max(1000).allow(null, '')
      })
  })
};

// Validation for getting feedback list (admin only)
const getFeedbacks = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'reviewed', 'responded'),
    sortBy: Joi.string().valid('createdAt', 'status', 'name', 'email'),
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1)
  })
};

// Validation for feedback ID parameter
const feedbackId = {
  params: Joi.object().keys({
    feedbackId: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.pattern.base': 'Invalid feedback ID format'
      })
  })
};

module.exports = {
  createFeedback,
  updateFeedbackStatus,
  getFeedbacks,
  feedbackId
};
