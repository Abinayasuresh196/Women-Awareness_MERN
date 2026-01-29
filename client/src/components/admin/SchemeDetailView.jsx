import React, { useState, useEffect } from "react";
import "../../styles/manageSchemes.css";

const SchemeDetailView = ({ scheme, onClose, onSave, isEditMode = true }) => {
  const [formData, setFormData] = useState({
    name: "",
    name_ta: "",
    eligibility: "",
    eligibility_ta: "",
    benefits: "",
    benefits_ta: "",
    link: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scheme) {
      setFormData({
        name: scheme.name || "",
        name_ta: scheme.name_ta || "",
        eligibility: scheme.eligibility || "",
        eligibility_ta: scheme.eligibility_ta || "",
        benefits: scheme.benefits || "",
        benefits_ta: scheme.benefits_ta || "",
        link: scheme.link || "",
        image: scheme.image || ""
      });
    }
  }, [scheme]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save scheme. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#4caf50';
      case 'rejected': return '#f44336';
      case 'pending': return '#ff9800';
      default: return '#2196f3';
    }
  };

  return (
    <div className="scheme-detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="scheme-detail-container">
        {/* Header with close button */}
        <div className="scheme-detail-header">
          <div className="scheme-detail-title">
            <h2>{isEditMode ? (scheme ? "Edit Scheme" : "Add New Scheme") : "Scheme Details"}</h2>
            {scheme && (
              <div className="scheme-status-badge" style={{ backgroundColor: getStatusColor(scheme.status) }}>
                {scheme.status === 'ai_verifying' ? 'AI Verifying' :
                 scheme.status === 'approved' ? 'Approved' :
                 scheme.status === 'rejected' ? 'Rejected' : scheme.status}
              </div>
            )}
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* AI Verification Info */}
        {scheme && scheme.aiVerificationResult && (
          <div className="ai-verification-info">
            <div className="ai-verification-header">
              <span className="ai-label">AI Verification:</span>
              <span className={`ai-result ${scheme.aiVerificationResult}`}>
                {scheme.aiVerificationResult === 'verified' ? '✅ Verified' :
                 scheme.aiVerificationResult === 'not_verified' ? '❌ Not Verified' :
                 scheme.aiVerificationResult === 'error' ? '⚠️ Error' : '⏳ Pending'}
              </span>
            </div>
            {scheme.aiVerificationNotes && (
              <div className="ai-notes">
                <small>{scheme.aiVerificationNotes}</small>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="scheme-detail-form">
          <div className="form-section">
            <h3>Scheme Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Scheme Name (English)</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={!isEditMode}
                />
              </div>
              <div className="form-group">
                <label>Scheme Name (தமிழ்)</label>
                <input
                  type="text"
                  name="name_ta"
                  value={formData.name_ta}
                  onChange={handleChange}
                  required
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Eligibility Criteria</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Eligibility (English)</label>
                <textarea
                  name="eligibility"
                  value={formData.eligibility}
                  onChange={handleChange}
                  required
                  rows="4"
                  disabled={!isEditMode}
                />
              </div>
              <div className="form-group">
                <label>Eligibility (தமிழ்)</label>
                <textarea
                  name="eligibility_ta"
                  value={formData.eligibility_ta}
                  onChange={handleChange}
                  required
                  rows="4"
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Benefits & Support</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Benefits (English)</label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  required
                  rows="4"
                  disabled={!isEditMode}
                />
              </div>
              <div className="form-group">
                <label>Benefits (தமிழ்)</label>
                <textarea
                  name="benefits_ta"
                  value={formData.benefits_ta}
                  onChange={handleChange}
                  required
                  rows="4"
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Media & Resources</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Official Link (Optional)</label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  disabled={!isEditMode}
                />
              </div>
              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </div>

          {/* Metadata */}
          {scheme && (
            <div className="form-section">
              <h3>Metadata</h3>
              <div className="metadata-grid">
                <div className="metadata-item">
                  <label>Created By:</label>
                  <span>{scheme.createdBy?.email || 'Unknown'}</span>
                </div>
                <div className="metadata-item">
                  <label>Created At:</label>
                  <span>{new Date(scheme.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="metadata-item">
                  <label>Last Updated:</label>
                  <span>{new Date(scheme.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="metadata-item">
                  <label>ID:</label>
                  <span className="id-text">{scheme._id}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {isEditMode && (
            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? "Saving..." : (scheme ? "Update Scheme" : "Create Scheme")}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SchemeDetailView;
