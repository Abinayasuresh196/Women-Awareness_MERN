const Feedback = require('../models/Feedback.model');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

/**
 * Create a feedback
 * @param {Object} feedbackBody
 * @param {Object} req - Express request object for IP and user agent
 * @returns {Promise<Feedback>}
 */
const createFeedback = async (feedbackBody, req = {}) => {
  try {
    // Get user from request if authenticated
    let userId = null;
    if (req.user && req.user._id) {
      userId = req.user._id;
    }

    const feedbackData = {
      ...feedbackBody,
      user: userId,
      ipAddress: req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
      userAgent: req.get ? req.get('User-Agent') : null
    };

    const feedback = await Feedback.create(feedbackData);
    await feedback.populate('user', 'name email');

    return feedback;
  } catch (error) {
    throw new ApiError(500, 'Error creating feedback');
  }
};

/**
 * Query for feedbacks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryFeedbacks = async (filter, options) => {
  const optionsCopy = { ...options };

  // Default sorting
  if (!optionsCopy.sortBy) {
    optionsCopy.sortBy = 'createdAt:desc';
  }

  const feedbacks = await Feedback.paginate(filter, optionsCopy);
  return feedbacks;
};

/**
 * Get feedback by id
 * @param {ObjectId} id
 * @returns {Promise<Feedback>}
 */
const getFeedbackById = async (id) => {
  const feedback = await Feedback.findById(id)
    .populate('user', 'name email')
    .populate('respondedBy', 'name email');

  if (!feedback) {
    throw new ApiError(404, 'Feedback not found');
  }

  return feedback;
};

/**
 * Update feedback by id
 * @param {ObjectId} feedbackId
 * @param {Object} updateBody
 * @param {Object} admin - Admin user performing the update
 * @returns {Promise<Feedback>}
 */
const updateFeedbackById = async (feedbackId, updateBody, admin) => {
  const feedback = await getFeedbackById(feedbackId);

  // If status is being changed to 'responded', set respondedAt and respondedBy
  if (updateBody.status === 'responded' && feedback.status !== 'responded') {
    updateBody.respondedAt = new Date();
    updateBody.respondedBy = admin._id;
  }

  Object.assign(feedback, updateBody);
  await feedback.save();

  // Populate after save
  await feedback.populate('user', 'name email');
  await feedback.populate('respondedBy', 'name email');

  return feedback;
};

/**
 * Delete feedback by id
 * @param {ObjectId} feedbackId
 * @returns {Promise<Feedback>}
 */
const deleteFeedbackById = async (feedbackId) => {
  const feedback = await getFeedbackById(feedbackId);
  await feedback.remove();
  return feedback;
};

/**
 * Get feedback statistics
 * @returns {Promise<Object>}
 */
const getFeedbackStats = async () => {
  const stats = await Feedback.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    total: 0,
    pending: 0,
    reviewed: 0,
    responded: 0
  };

  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });

  return result;
};

module.exports = {
  createFeedback,
  queryFeedbacks,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
  getFeedbackStats
};
