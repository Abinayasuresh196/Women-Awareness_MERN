/**
 * Audit Log input validation
 * Validates creation of audit log entries
 */

const Joi = require('joi');

const auditLogValidation = (req, res, next) => {
  const schema = Joi.object({
    action: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Action is required',
        'string.min': 'Action must be at least 3 characters',
        'string.max': 'Action cannot exceed 100 characters'
      }),
    performedBy: Joi.string()
      .min(3)
      .required()
      .messages({
        'string.empty': 'PerformedBy field is required',
        'string.min': 'PerformedBy must be at least 3 characters'
      }),
    entity: Joi.string()
      .min(3)
      .required()
      .messages({
        'string.empty': 'Entity is required',
        'string.min': 'Entity must be at least 3 characters'
      }),
    entityId: Joi.string()
      .required()
      .messages({
        'string.empty': 'Entity ID is required'
      }),
    timestamp: Joi.date()
      .optional()
      .messages({
        'date.base': 'Timestamp must be a valid date'
      }),
    details: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Details cannot exceed 500 characters'
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
  auditLogValidation
};
