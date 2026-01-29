import React, { useState, useEffect } from "react";
import "../../styles/manageLaws.css";

const LawDetailView = ({ law, onClose, onSave, isEditMode = true }) => {
  const [formData, setFormData] = useState({
    title: "",
    title_ta: "",
    description: "",
    description_ta: "",
    category: "",
    subCategory: "",
    link: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (law) {
      setFormData({
        title: law.title || "",
        title_ta: law.title_ta || "",
        description: law.description || "",
        description_ta: law.description_ta || "",
        category: law.category || "",
        subCategory: law.subCategory || "",
        link: law.link || "",
        image: law.image || ""
      });
    }
  }, [law]);

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
      alert("Failed to save law. Please try again.");
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
    <div className="law-detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="law-detail-container">
        {/* Header with close button */}
        <div className="law-detail-header">
          <div className="law-detail-title">
            <h2>{isEditMode ? (law ? "Edit Law" : "Add New Law") : "Law Details"}</h2>
            {law && (
              <div className="law-status-badge" style={{ backgroundColor: getStatusColor(law.status) }}>
                {law.status === 'ai_verifying' ? 'AI Verifying' :
                 law.status === 'approved' ? 'Approved' :
                 law.status === 'rejected' ? 'Rejected' : law.status}
              </div>
            )}
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* AI Verification Info */}
        {law && law.aiVerificationResult && (
          <div className="ai-verification-info">
            <div className="ai-verification-header">
              <span className="ai-label">AI Verification:</span>
              <span className={`ai-result ${law.aiVerificationResult}`}>
                {law.aiVerificationResult === 'verified' ? '✅ Verified' :
                 law.aiVerificationResult === 'not_verified' ? '❌ Not Verified' :
                 law.aiVerificationResult === 'error' ? '⚠️ Error' : '⏳ Pending'}
              </span>
            </div>
            {law.aiVerificationNotes && (
              <div className="ai-notes">
                <small>{law.aiVerificationNotes}</small>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="law-detail-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Title (English)</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={!isEditMode}
                />
              </div>
              <div className="form-group">
                <label>Title (தமிழ்)</label>
                <input
                  type="text"
                  name="title_ta"
                  value={formData.title_ta}
                  onChange={handleChange}
                  required
                  disabled={!isEditMode}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={!isEditMode}
              >
                <option value="">Select Category</option>
                <option value="constitutional">Constitutional Provisions</option>
                <option value="protection">Protection & Safety Laws</option>
                <option value="marriage">Marriage & Family Laws</option>
                <option value="property">Property & Financial Rights</option>
                <option value="health">Health & Maternity</option>
                <option value="political">Political & Social Empowerment</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Description</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Description (English)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="6"
                  disabled={!isEditMode}
                />
              </div>
              <div className="form-group">
                <label>Description (தமிழ்)</label>
                <textarea
                  name="description_ta"
                  value={formData.description_ta}
                  onChange={handleChange}
                  required
                  rows="6"
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </div>


          <div className="form-section">
            <h3>Additional Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Sub Category</label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  placeholder="Optional sub category"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Reference Link (Optional)</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com"
                disabled={!isEditMode}
              />
            </div>
          </div>

          {/* Metadata */}
          {law && (
            <div className="form-section">
              <h3>Metadata</h3>
              <div className="metadata-grid">
                <div className="metadata-item">
                  <label>Created By:</label>
                  <span>{law.createdBy?.email || 'Unknown'}</span>
                </div>
                <div className="metadata-item">
                  <label>Created At:</label>
                  <span>{new Date(law.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="metadata-item">
                  <label>Last Updated:</label>
                  <span>{new Date(law.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="metadata-item">
                  <label>ID:</label>
                  <span className="id-text">{law._id}</span>
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
                {loading ? "Saving..." : (law ? "Update Law" : "Create Law")}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LawDetailView;
