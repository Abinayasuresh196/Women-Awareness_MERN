import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";
import womenResourceService from "../../services/womenResourceService";
import "../../styles/manageWomenResources.css";

const ITEMS_PER_PAGE = 4; // Show 4 items per page with pagination

const ManageWomenResources = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [womenResources, setWomenResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    const adminRole = localStorage.getItem('adminRole');

    if (!token) {
      setTimeout(() => {
        navigate('/home');
      }, 100);
      return;
    }

    if (adminRole && adminRole !== "super-admin" && adminRole !== "admin") return;
  }, [navigate]);

  // Fetch women resources
  useEffect(() => {
    const fetchWomenResources = async () => {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (!token) return;

        // Fetch with pagination - 4 items per page
        const response = await womenResourceService.getResources({
          page: currentPage,
          limit: ITEMS_PER_PAGE
        });
        setWomenResources(response.data?.resources || []);
        setTotalPages(response.data?.pagination?.pages || 0);
      } catch (error) {
        console.error('Error fetching women resources:', error);
        setError('Failed to load women resources');
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    const adminRole = localStorage.getItem('adminRole');
    if (token && adminRole) {
      fetchWomenResources();
    }
  }, [currentPage]); // Add currentPage dependency

  const handleAdd = () => {
    setSelectedResource(null);
    setShowDetailView(true);
  };

  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setShowDetailView(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this women resource?")) {
      try {
        await womenResourceService.deleteResource(id);
        // Refresh the list with current pagination
        const response = await womenResourceService.getResources({
          page: currentPage,
          limit: ITEMS_PER_PAGE
        });
        setWomenResources(response.data?.resources || []);
        setTotalPages(response.data?.pagination?.pages || 0);
        setSuccessMessage("Women resource deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error('Error deleting resource:', error);
        setError('Failed to delete resource');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedResource) {
        await womenResourceService.updateResource(selectedResource.id || selectedResource._id, data);
        setSuccessMessage("Women resource updated successfully!");
      } else {
        await womenResourceService.createResource(data);
        setSuccessMessage("Women resource created successfully!");
      }

      // Refresh the list with current pagination
      const response = await womenResourceService.getResources({
        page: currentPage,
        limit: ITEMS_PER_PAGE
      });
      setWomenResources(response.data?.resources || []);
      setTotalPages(response.data?.pagination?.pages || 0);

      setShowDetailView(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      throw error;
    }
  };

  // Pagination logic - now handled by server
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="manage-women-resources-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="manage-women-resources-page">
      {/* Header */}
      <div className="page-header">
        <h2>Manage Women Resources</h2>
        <button className="btn-primary" onClick={handleAdd}>+ Add Resource</button>
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

      {womenResources.length === 0 && (
        <p className="no-data">No women resources available.</p>
      )}

      {womenResources.length > 0 && (
        <div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {womenResources.map((resource) => (
                <tr key={resource.id || resource._id}>
                  <td>{resource.title}</td>
                  <td>{resource.category}</td>
                  <td>{resource.type}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(resource)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(resource.id || resource._id)}
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

      {showDetailView && (
        <WomenResourceDetailView
          resource={selectedResource}
          onClose={() => setShowDetailView(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// Simple detail view component (can be expanded later)
const WomenResourceDetailView = ({ resource, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    titleEn: '',
    titleTa: '',
    descriptionEn: '',
    descriptionTa: '',
    link: '',
    category: '',
    type: '',
    benefitsEn: '',
    benefitsTa: '',
    featuresEn: '',
    featuresTa: '',
    servicesEn: '',
    servicesTa: '',
    website: '',
    priority: 0,
    tags: ''
  });

  useEffect(() => {
    const load = async () => {
      if (!resource) return;
      const id = resource.id || resource._id;
      if (!id) return;

      const [enRes, taRes] = await Promise.all([
        womenResourceService.getResourceById(id, 'en'),
        womenResourceService.getResourceById(id, 'ta')
      ]);

      const en = enRes.data;
      const ta = taRes.data;

      const zipLines = (enList = [], taList = []) => {
        const max = Math.max(enList.length, taList.length);
        const result = [];
        for (let i = 0; i < max; i++) {
          result.push({ en: enList[i] || '', ta: taList[i] || '' });
        }
        return result;
      };

      const benefitsPairs = zipLines(en?.benefits || [], ta?.benefits || []);
      const featuresPairs = zipLines(en?.features || [], ta?.features || []);
      const servicesPairs = zipLines(en?.services || [], ta?.services || []);

      setFormData({
        titleEn: en?.title || '',
        titleTa: ta?.title || '',
        descriptionEn: en?.description || '',
        descriptionTa: ta?.description || '',
        link: en?.link || '',
        category: en?.category || '',
        type: en?.type || '',
        benefitsEn: benefitsPairs.map(x => x.en).filter(Boolean).join('\n'),
        benefitsTa: benefitsPairs.map(x => x.ta).filter(Boolean).join('\n'),
        featuresEn: featuresPairs.map(x => x.en).filter(Boolean).join('\n'),
        featuresTa: featuresPairs.map(x => x.ta).filter(Boolean).join('\n'),
        servicesEn: servicesPairs.map(x => x.en).filter(Boolean).join('\n'),
        servicesTa: servicesPairs.map(x => x.ta).filter(Boolean).join('\n'),
        website: en?.contact?.website || '',
        priority: typeof en?.priority === 'number' ? en.priority : 0,
        tags: Array.isArray(en?.tags) ? en.tags.join(', ') : ''
      });
    };

    load();
  }, [resource]);

  const buildPayload = (data) => {
    const splitLines = (text) =>
      (text || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

    const zipToObjects = (enText, taText) => {
      const enLines = splitLines(enText);
      const taLines = splitLines(taText);
      const max = Math.max(enLines.length, taLines.length);
      const items = [];
      for (let i = 0; i < max; i++) {
        const en = enLines[i] || '';
        const ta = taLines[i] || '';
        if (!en && !ta) continue;
        items.push({ en, ta });
      }
      return items;
    };

    return {
      title: { en: data.titleEn, ta: data.titleTa },
      description: { en: data.descriptionEn, ta: data.descriptionTa },
      link: data.link,
      category: data.category,
      type: data.type,
      benefits: zipToObjects(data.benefitsEn, data.benefitsTa),
      features: zipToObjects(data.featuresEn, data.featuresTa),
      services: zipToObjects(data.servicesEn, data.servicesTa),
      contact: {
        website: data.website || ''
      },
      priority: Number.isFinite(Number(data.priority)) ? Number(data.priority) : 0,
      tags: (data.tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(buildPayload(formData));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{resource ? 'Edit Women Resource' : 'Add Women Resource'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="resource-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="titleEn"
              value={formData.titleEn}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Title (Tamil) *</label>
            <input
              type="text"
              name="titleTa"
              value={formData.titleTa}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Emergency">Emergency</option>
                <option value="Safety">Safety</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Legal">Legal</option>
                <option value="Financial">Financial</option>
                <option value="NGO">NGO</option>
                <option value="Government">Government</option>
                <option value="International">International</option>
                <option value="Digital">Digital</option>
              </select>
            </div>

            <div className="form-group">
              <label>Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="app">App</option>
                <option value="website">Website</option>
                <option value="helpline">Helpline</option>
                <option value="service">Service</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Description (Tamil) *</label>
            <textarea
              name="descriptionTa"
              value={formData.descriptionTa}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Link *</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority (0-10)</label>
              <input
                type="number"
                name="priority"
                min="0"
                max="10"
                value={formData.priority}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Benefits (English) - one per line</label>
            <textarea
              name="benefitsEn"
              value={formData.benefitsEn}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Benefits (Tamil) - one per line</label>
            <textarea
              name="benefitsTa"
              value={formData.benefitsTa}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Features (English) - one per line</label>
            <textarea
              name="featuresEn"
              value={formData.featuresEn}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Features (Tamil) - one per line</label>
            <textarea
              name="featuresTa"
              value={formData.featuresTa}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Services (English) - one per line</label>
            <textarea
              name="servicesEn"
              value={formData.servicesEn}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Services (Tamil) - one per line</label>
            <textarea
              name="servicesTa"
              value={formData.servicesTa}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {resource ? 'Update Resource' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageWomenResources;
