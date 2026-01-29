import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSchemes, addScheme, updateScheme, deleteScheme, approveScheme } from "../../features/schemes/schemeSlice";
import Loader from "../../components/common/Loader";
import SchemeDetailView from "../../components/admin/SchemeDetailView";
import "../../styles/manageSchemes.css";

const ITEMS_PER_PAGE = 4; // Changed from 3 to 4 items per page

const ManageSchemes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { schemes, loading, error } = useSelector(
    (state) => state.schemes
  );

  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminRole = localStorage.getItem('adminRole');

    // Only redirect if explicitly not authenticated after a brief delay
    // This allows the component to render initially and handle auth gracefully
    if (!token || !adminRole) {
      console.log('No authentication found - redirecting to login');
      // Small delay to prevent immediate redirect loops
      setTimeout(() => {
        navigate('/admin/login');
      }, 100);
      return;
    }
    
    // Allow both super-admin and admin roles
    if (adminRole !== "super-admin" && adminRole !== "admin") {
      console.warn("Limited permissions enabled");
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminRole = localStorage.getItem('adminRole');
    if (token && adminRole) {
      dispatch(fetchSchemes());
    }
  }, [dispatch]);

  // Calculate total pages when schemes change
  useEffect(() => {
    const calculatedTotalPages = Math.ceil(schemes.length / ITEMS_PER_PAGE);
    setTotalPages(calculatedTotalPages);
  }, [schemes, ITEMS_PER_PAGE]);

  // Debug: Add temporary test data if no schemes exist
  useEffect(() => {
    if (!loading && schemes.length === 0) {
      console.log("No schemes found - API might need seeding");
    } else {
      console.log("Schemes loaded:", schemes.length);
    }
  }, [schemes, loading]);

  const handleAdd = () => {
    setSelectedScheme(null);
    setShowDetailView(true);
  };

  const handleEdit = (scheme) => {
    setSelectedScheme(scheme);
    setShowDetailView(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedScheme) {
        await dispatch(updateScheme({ id: selectedScheme._id, data })).unwrap();
      } else {
        await dispatch(addScheme(data)).unwrap();
      }
      // Refetch data to ensure frontend reflects database changes
      dispatch(fetchSchemes());
    } catch (error) {
      console.error("Save failed:", error);
      throw error; // Re-throw to let detail view handle the error
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this scheme?")) {
      dispatch(deleteScheme(id));
    }
  };

  const handleApprove = async (id) => {
    try {
      await dispatch(approveScheme(id)).unwrap();
      setSuccessMessage("Scheme approved successfully!");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to approve scheme:", error);
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSchemes = schemes.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="manage-schemes-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="manage-schemes-page">
      {/* Header */}
      <div className="page-header">
        <h2>Manage Government Schemes</h2>
        <button className="btn-primary" onClick={handleAdd}>+ Add Scheme</button>
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

      {error && <p className="no-data">{error}</p>}

      {schemes.length === 0 && (
        <p className="no-data">No schemes available.</p>
      )}

      {schemes.length > 0 && (
        <div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentSchemes.map((scheme) => (
                <tr key={scheme._id}>
                  <td>{scheme.name}</td>
                  <td>{scheme.eligibility}</td>
                  <td>
                    <div className="status-container">
                      <span className={`status ${scheme.status || 'pending'}`}>
                        {scheme.status === 'ai_verifying' ? 'AI Verifying' :
                         scheme.status === 'approved' ? 'Approved' :
                         scheme.status === 'rejected' ? 'Rejected' :
                         scheme.status || 'pending'}
                      </span>
                      {scheme.aiVerificationResult && (
                        <div className="ai-status">
                          <small>
                            AI: {scheme.aiVerificationResult === 'verified' ? '✅ Verified' :
                                 scheme.aiVerificationResult === 'not_verified' ? '❌ Not Verified' :
                                 scheme.aiVerificationResult === 'error' ? '⚠️ Error' :
                                 '⏳ Pending'}
                          </small>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(scheme)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(scheme._id)}
                      >
                        Delete
                      </button>

                      {scheme.status !== 'approved' && (
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(scheme._id)}
                        >
                          Approve
                        </button>
                      )}
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
      <SchemeDetailView
        scheme={selectedScheme}
        onClose={() => setShowDetailView(false)}
        onSave={handleSave}
      />
    )}
  </div>
);
};

export default ManageSchemes;
