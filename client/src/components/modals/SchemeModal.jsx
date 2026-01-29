import React, { useState, useEffect } from "react";
import "../../styles/manageLaws.css";

const SchemeModal = ({ closeModal, editData, onSubmit }) => {
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

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        name_ta: editData.name_ta || "",
        eligibility: editData.eligibility || "",
        eligibility_ta: editData.eligibility_ta || "",
        benefits: editData.benefits || "",
        benefits_ta: editData.benefits_ta || "",
        link: editData.link || "",
        image: editData.image || ""
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editData ? "Edit Scheme" : "Add Scheme"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Scheme Name (English)</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
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
            />
          </div>
          <div className="form-group">
            <label>Eligibility Criteria (English)</label>
            <textarea
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Eligibility Criteria (தமிழ்)</label>
            <textarea
              name="eligibility_ta"
              value={formData.eligibility_ta}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Benefits (English)</label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Benefits (தமிழ்)</label>
            <textarea
              name="benefits_ta"
              value={formData.benefits_ta}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Official Link (Optional)</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://example.com"
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

export default SchemeModal;
