/**
 * Article Service
 * Handles all database operations related to Articles
 */

const Article = require('../models/Article.model');

class ArticleService {
  // Create a new article
  static async create(data) {
    const article = await Article.create(data);
    return article;
  }

  // Get all articles with pagination
  static async getAll(page = 1, limit = 4) {
    const skip = (page - 1) * limit;
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Article.countDocuments();
    
    return {
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  // Get only approved articles with pagination (for public view)
  static async getApproved(page = 1, limit = 4) {
    const skip = (page - 1) * limit;
    const articles = await Article.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Article.countDocuments({ status: 'approved' });
    
    return {
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  // Get pending articles with pagination for admin review
  static async getPending(page = 1, limit = 4) {
    const skip = (page - 1) * limit;
    const articles = await Article.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Article.countDocuments({ status: 'pending' });
    
    return {
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  // Get articles submitted by a specific user with pagination
  static async getBySubmittedBy(userId, page = 1, limit = 4) {
    const skip = (page - 1) * limit;
    const articles = await Article.find({ submittedBy: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Article.countDocuments({ submittedBy: userId });
    
    return {
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  }

  // Update article approval status
  static async updateStatus(id, status, reviewNotes = '') {
    const article = await Article.findByIdAndUpdate(
      id,
      { status, reviewNotes },
      { new: true, runValidators: true }
    );
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }

  // Get article by ID
  static async getById(id) {
    const article = await Article.findById(id);
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }

  // Update article by ID
  static async update(id, data) {
    const article = await Article.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!article) {
      throw new Error('Article not found');
    }
    return article;
  }

  // Delete article by ID
  static async delete(id) {
    const article = await Article.findByIdAndDelete(id);
    if (!article) {
      throw new Error('Article not found');
    }
    return true;
  }
}

module.exports = ArticleService;
