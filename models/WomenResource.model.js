const mongoose = require('mongoose');

const womenResourceSchema = new mongoose.Schema({
  title: {
    en: {
      type: String,
      required: true,
      trim: true
    },
    ta: {
      type: String,
      required: true,
      trim: true
    }
  },
  description: {
    en: {
      type: String,
      required: true,
      trim: true
    },
    ta: {
      type: String,
      required: true,
      trim: true
    }
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Emergency', 'Safety', 'Education', 'Health', 'Legal', 'Financial', 'NGO', 'Government', 'International', 'Digital'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['app', 'website', 'helpline', 'service'],
    trim: true
  },
  benefits: [{
    en: {
      type: String,
      trim: true
    },
    ta: {
      type: String,
      trim: true
    }
  }],
  features: [{
    en: {
      type: String,
      trim: true
    },
    ta: {
      type: String,
      trim: true
    }
  }],
  services: [{
    en: {
      type: String,
      trim: true
    },
    ta: {
      type: String,
      trim: true
    }
  }],
  contact: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
womenResourceSchema.index({ category: 1, type: 1 });
womenResourceSchema.index({ 'title.en': 'text', 'title.ta': 'text', 'description.en': 'text', 'description.ta': 'text' });
womenResourceSchema.index({ isActive: 1, priority: -1 });

// Virtual for current language title
womenResourceSchema.virtual('currentTitle').get(function() {
  // This will be set by middleware or query helpers based on language
  return this.title.en; // Default fallback
});

// Virtual for current language description
womenResourceSchema.virtual('currentDescription').get(function() {
  // This will be set by middleware or query helpers based on language
  return this.description.en; // Default fallback
});

// Static method to get resources by category
womenResourceSchema.statics.getByCategory = function(category, language = 'en') {
  return this.find({
    category: category,
    isActive: true
  })
  .sort({ priority: -1, createdAt: -1 })
  .select({
    title: 1,
    description: 1,
    link: 1,
    category: 1,
    type: 1,
    benefits: 1,
    features: 1,
    services: 1,
    contact: 1,
    priority: 1,
    tags: 1,
    createdAt: 1
  });
};

// Static method to search resources
womenResourceSchema.statics.search = function(query, language = 'en') {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { [`title.${language}`]: searchRegex },
      { [`description.${language}`]: searchRegex },
      { tags: { $in: [searchRegex] } },
      { category: searchRegex },
      { type: searchRegex }
    ],
    isActive: true
  })
  .sort({ priority: -1, createdAt: -1 });
};

// Instance method to get resource in specific language
womenResourceSchema.methods.getLocalized = function(language = 'en') {
  return {
    id: this._id,
    title: this.title[language] || this.title.en,
    description: this.description[language] || this.description.en,
    link: this.link,
    category: this.category,
    type: this.type,
    benefits: this.benefits.map(benefit => benefit[language] || benefit.en).filter(Boolean),
    features: this.features.map(feature => feature[language] || feature.en).filter(Boolean),
    services: this.services.map(service => service[language] || service.en).filter(Boolean),
    contact: this.contact,
    priority: this.priority,
    tags: this.tags,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('WomenResource', womenResourceSchema);
