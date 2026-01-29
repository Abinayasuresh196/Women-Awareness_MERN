const Joi = require('joi');

// Base validation schemas
const titleSchema = Joi.object({
  en: Joi.string().trim().min(1).max(200).required(),
  ta: Joi.string().trim().min(1).max(200).required()
});

const descriptionSchema = Joi.object({
  en: Joi.string().trim().min(1).max(1000).required(),
  ta: Joi.string().trim().min(1).max(1000).required()
});

const benefitSchema = Joi.object({
  en: Joi.string().trim().min(1).max(300),
  ta: Joi.string().trim().min(1).max(300)
});

const featureSchema = Joi.object({
  en: Joi.string().trim().min(1).max(300),
  ta: Joi.string().trim().min(1).max(300)
});

const serviceSchema = Joi.object({
  en: Joi.string().trim().min(1).max(300),
  ta: Joi.string().trim().min(1).max(300)
});

// Create validation schema
const createWomenResource = {
  body: Joi.object({
    title: titleSchema.required(),
    description: descriptionSchema.required(),
    link: Joi.string().uri().required(),
    category: Joi.string().valid('Emergency', 'Safety', 'Education', 'Health', 'Legal', 'Financial', 'NGO', 'Government', 'International', 'Digital').required(),
    type: Joi.string().valid('app', 'website', 'helpline', 'service').required(),
    benefits: Joi.array().items(benefitSchema),
    features: Joi.array().items(featureSchema),
    services: Joi.array().items(serviceSchema),
    contact: Joi.object({
      phone: Joi.string().pattern(/^[+\-\s()0-9]+$/).allow(''),
      email: Joi.string().email().allow(''),
      website: Joi.string().uri().allow('')
    }),
    priority: Joi.number().min(0).max(10).default(0),
    tags: Joi.array().items(Joi.string().trim().min(1).max(50))
  })
};

// Update validation schema
const updateWomenResource = {
  params: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  body: Joi.object({
    title: titleSchema,
    description: descriptionSchema,
    link: Joi.string().uri(),
    category: Joi.string().valid('Emergency', 'Safety', 'Education', 'Health', 'Legal', 'Financial', 'NGO', 'Government', 'International', 'Digital'),
    type: Joi.string().valid('app', 'website', 'helpline', 'service'),
    benefits: Joi.array().items(benefitSchema),
    features: Joi.array().items(featureSchema),
    services: Joi.array().items(serviceSchema),
    contact: Joi.object({
      phone: Joi.string().pattern(/^[+\-\s()0-9]+$/).allow(''),
      email: Joi.string().email().allow(''),
      website: Joi.string().uri().allow('')
    }),
    priority: Joi.number().min(0).max(10),
    isActive: Joi.boolean(),
    tags: Joi.array().items(Joi.string().trim().min(1).max(50))
  }).min(1) // At least one field must be provided for update
};

// Get resources validation
const getWomenResources = {
  query: Joi.object({
    category: Joi.string().valid('Emergency', 'Safety', 'Education', 'Health', 'Legal', 'Financial', 'NGO', 'Government', 'International', 'Digital'),
    type: Joi.string().valid('app', 'website', 'helpline', 'service'),
    language: Joi.string().valid('en', 'ta').default('en'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().min(1).max(100),
    sortBy: Joi.string().valid('priority', 'createdAt', 'title').default('priority'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  })
};

// Get single resource validation
const getWomenResource = {
  params: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  query: Joi.object({
    language: Joi.string().valid('en', 'ta').default('en')
  })
};

// Delete resource validation
const deleteWomenResource = {
  params: Joi.object({
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  })
};

module.exports = {
  createWomenResource,
  updateWomenResource,
  getWomenResources,
  getWomenResource,
  deleteWomenResource
};
