/**
 * Scheme Model
 * Stores government schemes related to women
 * Advanced: validation, timestamps, URL validation
 */

const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Scheme name is required'],
      trim: true,
      unique: true,
      maxlength: [150, 'Scheme name cannot exceed 150 characters']
    },
    name_ta: {
      type: String,
      required: [true, 'Scheme name in Tamil is required'],
      trim: true,
      maxlength: [150, 'Scheme name cannot exceed 150 characters']
    },
    eligibility: {
      type: String,
      required: [true, 'Eligibility criteria is required'],
      trim: true
    },
    eligibility_ta: {
      type: String,
      required: [true, 'Eligibility criteria in Tamil is required'],
      trim: true
    },
    benefits: {
      type: String,
      required: [true, 'Benefits description is required'],
      trim: true
    },
    benefits_ta: {
      type: String,
      required: [true, 'Benefits description in Tamil is required'],
      trim: true
    },
    link: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // simple URL validation regex
          return /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/.*)?$/.test(v);
        },
        message: 'Please provide a valid URL'
      }
    },
    image: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['education', 'employment', 'health', 'safety', 'financial', 'empowerment'],
      default: 'education'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'ai_verifying'],
      default: 'approved'
    },
    aiVerificationResult: {
      type: String,
      enum: ['verified', 'not_verified', 'error', 'pending'],
      default: 'verified'
    },
    aiVerificationNotes: {
      type: String,
      trim: true,
      default: 'Content verified by AI system'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

// Index for fast search by name
schemeSchema.index({ name: 'text' });

module.exports = mongoose.model('Scheme', schemeSchema);
