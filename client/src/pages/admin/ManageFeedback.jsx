import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import feedbackService from "../../services/feedbackService";
import "../../styles/manageFeedback.css";

const ITEMS_PER_PAGE = 10; // Changed from 8 to 10 items per page

const ManageFeedback = () => {
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    responded: 0
  });

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    const adminRole = localStorage.getItem('adminRole');

    if (!token) {
      console.log('No authentication found - redirecting to home');
      setTimeout(() => {
        navigate('/home');
      }, 100);
      return;
    }

    if (adminRole && adminRole !== "super-admin" && adminRole !== "admin") {
      console.warn("Limited permissions enabled");
    }
  }, [navigate]);

  // Fetch feedback and stats
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (!token) return;

        // Fetch feedback list
        const feedbackResponse = await feedbackService.getAllFeedback({
          page: currentPage,
          limit: ITEMS_PER_PAGE
        });
        const feedbackData = feedbackResponse.data?.feedbacks || feedbackResponse.data?.docs || feedbackResponse.data || [];
        setFeedbacks(feedbackData);
        
        // Use pagination from API response if available, otherwise calculate locally
        if (feedbackResponse.data?.pagination?.totalPages) {
          setTotalPages(feedbackResponse.data.pagination.totalPages);
        } else {
          setTotalPages(Math.ceil(feedbackData.length / ITEMS_PER_PAGE));
        }

        // Fetch feedback stats
        const statsResponse = await feedbackService.getFeedbackStats();
        setStats(statsResponse.data?.stats || stats);

      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError('Failed to load feedback');
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    const adminRole = localStorage.getItem('adminRole');
    if (token && adminRole) {
      fetchFeedback();
    }
  }, []);

  const handleView = (feedback) => {
    setSelectedFeedback(feedback);
    setShowDetailView(true);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await feedbackService.updateFeedbackStatus(id, { status: newStatus });

      // Refresh the list
      const response = await feedbackService.getAllFeedback({
        page: currentPage,
        limit: ITEMS_PER_PAGE
      });
      const feedbackData = response.data?.feedbacks || response.data?.docs || response.data || [];
      setFeedbacks(feedbackData);
      
      // Use pagination from API response if available, otherwise calculate locally
      if (response.data?.pagination?.totalPages) {
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setTotalPages(Math.ceil(feedbackData.length / ITEMS_PER_PAGE));
      }

      // Update stats
      const statsResponse = await feedbackService.getFeedbackStats();
      setStats(statsResponse.data?.stats || stats);

      setSuccessMessage(`Feedback marked as ${newStatus}!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error('Error updating feedback status:', error);
      setError('Failed to update feedback status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await feedbackService.deleteFeedback(id);

        // Refresh the list
        const response = await feedbackService.getAllFeedback();
        setFeedbacks(response.data || []);
        setTotalPages(Math.ceil((response.data || []).length / ITEMS_PER_PAGE));

        // Update stats
        const statsResponse = await feedbackService.getFeedbackStats();
        setStats(statsResponse.data || stats);

        setSuccessMessage("Feedback deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error('Error deleting feedback:', error);
        setError('Failed to delete feedback');
      }
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  const currentFeedbacks = Array.isArray(feedbacks) ? feedbacks.slice(startIndex, endIndex) : [];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="manage-feedback-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="manage-feedback-page">
      {/* Header */}
      <div className="page-header">
        <h2>Manage User Feedback</h2>
      </div>

      {/* Feedback Statistics */}
      <div className="feedback-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total || 0}</div>
          <div className="stat-label">Total Feedback</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pending || 0}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.reviewed || 0}</div>
          <div className="stat-label">Reviewed</div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message" style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '10px',
          marginBottom: '15px',
          borderRadius: '4px',
          border: '1px solid #c3e6cb'
        }}>
          {successMessage}
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {feedbacks.length === 0 && (
        <p className="no-data">No feedback available.</p>
      )}

      {feedbacks.length > 0 && (
        <div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFeedbacks.map((feedback) => (
                <tr key={feedback._id}>
                  <td>{feedback.name || feedback.user?.name || 'Anonymous'}</td>
                  <td>{feedback.email || feedback.user?.email || 'No email'}</td>
                  <td>
                    <div className="feedback-message" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={feedback.message}>
                      {feedback.message || 'No message'}
                    </div>
                  </td>
                  <td>
                    <span className={`status ${feedback.status || 'pending'}`}>
                      {feedback.status === 'reviewed' ? 'Reviewed' :
                       feedback.status === 'pending' ? 'Pending' :
                       feedback.status || 'Pending'}
                    </span>
                  </td>
                  <td>{new Date(feedback.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-view"
                        onClick={() => handleView(feedback)}
                      >
                        View
                      </button>

                      {feedback.status !== 'reviewed' && (
                        <button
                          className="btn-approve"
                          onClick={() => handleStatusUpdate(feedback._id, 'reviewed')}
                        >
                          Mark Reviewed
                        </button>
                      )}

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(feedback._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ← Previous
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {showDetailView && selectedFeedback && (
        <FeedbackDetailView
          feedback={selectedFeedback}
          onClose={() => setShowDetailView(false)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

// Feedback Detail View Component
const FeedbackDetailView = ({ feedback, onClose, onStatusUpdate, onDelete }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content feedback-detail">
        <div className="modal-header">
          <h3>Feedback Details</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="feedback-content">
          <div className="feedback-meta">
            <div className="meta-item">
              <strong>Name:</strong> {feedback.name || feedback.user?.name || 'Anonymous'}
            </div>
            <div className="meta-item">
              <strong>Email:</strong> {feedback.email || feedback.user?.email || 'Not provided'}
            </div>
            
            <div className="meta-item">
              <strong>Type:</strong>
              <span className={`feedback-type ${feedback.type || 'general'}`}>
                {feedback.type || 'general'}
              </span>
            </div>
            <div className="meta-item">
              <strong>Status:</strong>
              <span className={`status ${feedback.status || 'pending'}`}>
                {feedback.status === 'reviewed' ? 'Reviewed' :
                 feedback.status === 'pending' ? 'Pending' :
                 feedback.status || 'Pending'}
              </span>
            </div>
            <div className="meta-item">
              <strong>Date:</strong> {new Date(feedback.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="feedback-message">
            <h4>Message:</h4>
            <div className="message-content">
              {feedback.message}
            </div>
          </div>

          {feedback.additionalInfo && (
            <div className="feedback-additional">
              <h4>Additional Information:</h4>
              <div className="additional-content">
                {feedback.additionalInfo}
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          {feedback.status !== 'reviewed' && (
            <button
              className="btn-approve"
              onClick={() => onStatusUpdate(feedback._id, 'reviewed')}
            >
              Mark as Reviewed
            </button>
          )}

          <button
            className="btn-delete"
            onClick={() => onDelete(feedback._id)}
          >
            Delete Feedback
          </button>

          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageFeedback;
