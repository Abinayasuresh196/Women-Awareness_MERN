/**
 * Law Model
 * Stores laws & acts information
 * Advanced: timestamps, indexes, validation
 */

const mongoose = require('mongoose');

const lawSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Law title is required'],
      trim: true,
      unique: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    title_ta: {
      type: String,
      required: [true, 'Law title in Tamil is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    description_ta: {
      type: String,
      required: [true, 'Description in Tamil is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true
    },
    content_ta: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['constitutional', 'protection', 'marriage', 'property', 'health', 'political', 'laws'],
      default: 'laws'
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
    subCategory: {
      type: String,
      default: '',
      trim: true
    },
    image: {
      type: String,
      default: '',
      trim: true
    },
    link: {
      type: String,
      default: '',
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    }
  },
  {
    timestamps: true // createdAt, updatedAt automatically
  }
);

// Index for faster search by title
lawSchema.index({ title: 'text', category: 1 });

module.exports = mongoose.model('Law', lawSchema);
