import React, { useState, useEffect } from "react";
import "../../styles/manageArticles.css";

const ArticleDetailView = ({ article, onClose, onSave, isEditMode = true }) => {
  const [formData, setFormData] = useState({
    title: "",
    title_ta: "",
    summary: "",
    summary_ta: "",
    content: "",
    content_ta: "",
    category: "",
    tags: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        title_ta: article.title_ta || "",
        summary: article.summary || "",
        summary_ta: article.summary_ta || "",
        content: article.content || "",
        content_ta: article.content_ta || "",
        category: article.category || "",
        tags: article.tags ? article.tags.join(", ") : ""
      });
    }
  }, [article]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert tags string to array
    const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag);

    const submitData = {
      ...formData,
      tags: tagsArray
    };

    setLoading(true);
    try {
      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save article. Please try again.");
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
    <div className="article-detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="article-detail-container">
        {/* Header with close button */}
        <div className="article-detail-header">
          <div className="article-detail-title">
            <h2>{isEditMode ? (article ? "Edit Article" : "Add New Article") : "Article Details"}</h2>
            {article && (
              <div className="article-status-badge" style={{ backgroundColor: getStatusColor(article.status) }}>
                {article.status === 'approved' ? 'Approved' :
                 article.status === 'rejected' ? 'Rejected' :
                 article.status === 'pending' ? 'Pending Review' : article.status}
              </div>
            )}
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* Article Image */}
        {article?.image && (
          <div className="article-image-preview">
            <img src={article.image} alt={article.title} onError={(e) => {
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
            }} />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="article-detail-form">
          <div className="form-section">
            <h3>Article Information</h3>
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
                <option value="Legal">Legal</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Employment">Employment</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Summary</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Summary (English)</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  required
                  rows="3"
                  disabled={!isEditMode}
                />
              </div>
              <div className="form-group">
                <label>Summary (தமிழ்)</label>
                <textarea
                  name="summary_ta"
                  value={formData.summary_ta}
                  onChange={handleChange}
                  required
                  rows="3"
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Main Content</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Content (English)</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="8"
                  disabled={!isEditMode}
                />
              </div>
              <div className="form-group">
                <label>Content (தமிழ்)</label>
                <textarea
                  name="content_ta"
                  value={formData.content_ta}
                  onChange={handleChange}
                  required
                  rows="8"
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Tags & Organization</h3>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="women empowerment, rights, awareness"
                disabled={!isEditMode}
              />
            </div>
          </div>

          {/* Metadata */}
          {article && (
            <div className="form-section">
              <h3>Metadata</h3>
              <div className="metadata-grid">
                <div className="metadata-item">
                  <label>Author:</label>
                  <span>{article.author?.name || article.createdBy?.email || 'Unknown'}</span>
                </div>
                <div className="metadata-item">
                  <label>Created At:</label>
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="metadata-item">
                  <label>Last Updated:</label>
                  <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="metadata-item">
                  <label>ID:</label>
                  <span className="id-text">{article._id}</span>
                </div>
                <div className="metadata-item">
                  <label>Views:</label>
                  <span>{article.views || 0}</span>
                </div>
                <div className="metadata-item">
                  <label>Likes:</label>
                  <span>{article.likes || 0}</span>
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
                {loading ? "Saving..." : (article ? "Update Article" : "Create Article")}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ArticleDetailView;
