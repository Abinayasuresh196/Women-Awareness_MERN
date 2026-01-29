/**
 * Awareness Article Model
 * Stores informative articles for women awareness
 * Advanced: category, validation, timestamps, admin reference
 */

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      unique: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    title_ta: {
      type: String,
      required: [true, 'Article title in Tamil is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    summary_ta: {
      type: String,
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
      trim: true
    },
    content_ta: {
      type: String,
      required: [true, 'Article content in Tamil is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Health', 'Education', 'Legal', 'Employment', 'General'],
      default: 'General'
    },
    image: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // simple URL validation regex
          return !v || /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/.*)?$/.test(v);
        },
        message: 'Please provide a valid URL for image'
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: function() {
        // createdBy is required only when submittedBy is not present (admin-created articles)
        return !this.submittedBy;
      }
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved' // Default for admin-created articles
    },
    reviewNotes: {
      type: String,
      trim: true
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true // automatically creates createdAt & updatedAt
  }
);

// Text index for search by title and content
articleSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Article', articleSchema);
