const catchAsync = require('../utils/catchAsync');
const feedbackService = require('../services/feedback.service');
const ApiError = require('../utils/ApiError');

/**
 * Create a feedback
 * @route POST /api/feedback
 * @access Public (but requires authentication)
 */
const createFeedback = catchAsync(async (req, res) => {
  const feedback = await feedbackService.createFeedback(req.body, req);

  res.status(201).json({
    status: 'success',
    message: 'Feedback submitted successfully',
    data: {
      feedback: {
        id: feedback._id,
        name: feedback.name,
        email: feedback.email,
        message: feedback.message,
        status: feedback.status,
        createdAt: feedback.createdAt
      }
    }
  });
});

/**
 * Get all feedbacks (Admin only)
 * @route GET /api/feedback
 * @access Private (Admin)
 */
const getFeedbacks = catchAsync(async (req, res) => {
  const filter = {};
  const options = {
    limit: parseInt(req.query.limit, 10) || 10,
    page: parseInt(req.query.page, 10) || 1,
    sortBy: req.query.sortBy || 'createdAt:desc'
  };

  // Filter by status if provided
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const result = await feedbackService.queryFeedbacks(filter, options);

  res.json({
    status: 'success',
    data: {
      feedbacks: result.docs, // Changed from result.results to result.docs
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        totalResults: result.totalDocs // Changed from totalResults to totalDocs
      }
    }
  });
});

/**
 * Get feedback by ID (Admin only)
 * @route GET /api/feedback/:feedbackId
 * @access Private (Admin)
 */
const getFeedback = catchAsync(async (req, res) => {
  const feedback = await feedbackService.getFeedbackById(req.params.feedbackId);

  res.json({
    status: 'success',
    data: {
      feedback
    }
  });
});

/**
 * Update feedback status (Admin only)
 * @route PATCH /api/feedback/:feedbackId
 * @access Private (Admin)
 */
const updateFeedback = catchAsync(async (req, res) => {
  const feedback = await feedbackService.updateFeedbackById(
    req.params.feedbackId,
    req.body,
    req.user
  );

  res.json({
    status: 'success',
    message: 'Feedback updated successfully',
    data: {
      feedback
    }
  });
});

/**
 * Delete feedback (Admin only)
 * @route DELETE /api/feedback/:feedbackId
 * @access Private (Admin)
 */
const deleteFeedback = catchAsync(async (req, res) => {
  await feedbackService.deleteFeedbackById(req.params.feedbackId);

  res.json({
    status: 'success',
    message: 'Feedback deleted successfully'
  });
});

/**
 * Get feedback statistics (Admin only)
 * @route GET /api/feedback/stats
 * @access Private (Admin)
 */
const getFeedbackStats = catchAsync(async (req, res) => {
  const stats = await feedbackService.getFeedbackStats();

  res.json({
    status: 'success',
    data: {
      stats
    }
  });
});

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats
};
