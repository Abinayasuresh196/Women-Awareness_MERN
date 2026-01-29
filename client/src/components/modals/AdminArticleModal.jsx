import React, { useState, useEffect } from "react";
import "../../styles/manageLaws.css";

const AdminArticleModal = ({ closeModal, editData, onSubmit }) => {
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

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        title_ta: editData.title_ta || "",
        summary: editData.summary || "",
        summary_ta: editData.summary_ta || "",
        content: editData.content || "",
        content_ta: editData.content_ta || "",
        category: editData.category || "",
        tags: editData.tags ? editData.tags.join(", ") : ""
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert tags string to array
    const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag);

    const submitData = {
      ...formData,
      tags: tagsArray
    };

    onSubmit(submitData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: "800px", maxHeight: "80vh", overflow: "auto" }}>
        <h3>{editData ? "Edit Article" : "Add Article"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title (English)</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
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
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Legal">Legal</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Employment">Employment</option>
              <option value="General">General</option>
            </select>
          </div>
          <div className="form-group">
            <label>Summary (English)</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              required
              rows="3"
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
            />
          </div>
          <div className="form-group">
            <label>Content (English)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="8"
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
            />
          </div>
          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="women empowerment, rights, awareness"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={closeModal} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {editData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminArticleModal;
