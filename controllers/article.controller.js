/**
 * Article Controller
 * Handles HTTP requests related to Articles
 */

const ArticleService = require('../services/article.service');

class ArticleController {
  // Create a new article
  static async createArticle(req, res, next) {
    try {
      const articleData = {
        ...req.body,
        createdBy: req.user.id // Set createdBy to the authenticated admin's ID
      };
      const article = await ArticleService.create(articleData);
      res.status(201).json({ success: true, data: article });
    } catch (err) {
      next(err);
    }
  }

  // Get all articles (only approved for public view)
  static async getAllArticles(req, res, next) {
    try {
      const { status, userId, page = 1, limit = 4 } = req.query;
      let result;

      if (status === 'all' && req.user?.role === 'admin') {
        // Admin can see all articles
        result = await ArticleService.getAll(page, limit);
      } else if (userId && req.user?.role === 'admin') {
        // Admin can see user's submissions
        result = await ArticleService.getBySubmittedBy(userId, page, limit);
      } else {
        // Public users see only approved articles
        result = await ArticleService.getApproved(page, limit);
      }

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // Submit article for approval (user submission)
  static async submitArticle(req, res, next) {
    try {
      const articleData = {
        ...req.body,
        submittedBy: req.user.id,
        status: 'pending'
      };
      const article = await ArticleService.create(articleData);
      res.status(201).json({ success: true, data: article });
    } catch (err) {
      next(err);
    }
  }

  // Get pending articles for admin review
  static async getPendingArticles(req, res, next) {
    try {
      const { page = 1, limit = 4 } = req.query;
      const result = await ArticleService.getPending(page, limit);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // Approve or reject article
  static async reviewArticle(req, res, next) {
    try {
      const { id } = req.params;
      const { status, reviewNotes } = req.body;
      const updatedArticle = await ArticleService.updateStatus(id, status, reviewNotes);
      res.status(200).json({ success: true, data: updatedArticle });
    } catch (err) {
      next(err);
    }
  }

  // Get a single article by ID
  static async getArticleById(req, res, next) {
    try {
      const article = await ArticleService.getById(req.params.id);
      res.status(200).json({ success: true, data: article });
    } catch (err) {
      next(err);
    }
  }

  // Update an article by ID
  static async updateArticle(req, res, next) {
    try {
      const updatedArticle = await ArticleService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: updatedArticle });
    } catch (err) {
      next(err);
    }
  }

  // Delete an article by ID
  static async deleteArticle(req, res, next) {
    try {
      await ArticleService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Article deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ArticleController;
