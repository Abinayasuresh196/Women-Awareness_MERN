import api from './api';

const feedbackService = {
  // Submit feedback
  submitFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/feedback', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },

  // Get all feedback (Admin only)
  getAllFeedback: async (params = {}) => {
    try {
      const response = await api.get('/feedback', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  },

  // Get feedback statistics (Admin only)
  getFeedbackStats: async () => {
    try {
      const response = await api.get('/feedback/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      throw error;
    }
  },

  // Get feedback by ID (Admin only)
  getFeedbackById: async (feedbackId) => {
    try {
      const response = await api.get(`/feedback/${feedbackId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  },

  // Update feedback status (Admin only)
  updateFeedbackStatus: async (feedbackId, updateData) => {
    try {
      const response = await api.patch(`/feedback/${feedbackId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating feedback:', error);
      throw error;
    }
  },

  // Delete feedback (Admin only)
  deleteFeedback: async (feedbackId) => {
    try {
      const response = await api.delete(`/feedback/${feedbackId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  }
};

export default feedbackService;
