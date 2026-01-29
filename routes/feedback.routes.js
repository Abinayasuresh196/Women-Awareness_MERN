const express = require('express');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');

const feedbackController = require('../controllers/feedback.controller');
const feedbackValidation = require('../validations/feedback.validation');

const router = express.Router();

// Public route for creating feedback (requires authentication)
router
  .route('/')
  .post(
    auth,
    validate(feedbackValidation.createFeedback),
    feedbackController.createFeedback
  );

// Admin-only routes
router
  .route('/')
  .get(
    auth,
    role(['admin', 'super-admin']),
    validate(feedbackValidation.getFeedbacks),
    feedbackController.getFeedbacks
  );

// Get feedback statistics (Admin only)
router
  .route('/stats')
  .get(
    auth,
    role(['admin', 'super-admin']),
    feedbackController.getFeedbackStats
  );

// Individual feedback operations (Admin only)
router
  .route('/:feedbackId')
  .get(
    auth,
    role(['admin', 'super-admin']),
    validate(feedbackValidation.feedbackId),
    feedbackController.getFeedback
  )
  .patch(
    auth,
    role(['admin', 'super-admin']),
    validate(feedbackValidation.updateFeedbackStatus),
    feedbackController.updateFeedback
  )
  .delete(
    auth,
    role(['admin', 'super-admin']),
    validate(feedbackValidation.feedbackId),
    feedbackController.deleteFeedback
  );

module.exports = router;
