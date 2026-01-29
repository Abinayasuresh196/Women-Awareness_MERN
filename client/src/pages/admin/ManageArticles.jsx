import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchArticles } from "../../features/articles/articleSlice";
import Loader from "../../components/common/Loader";
import ArticleDetailView from "../../components/admin/ArticleDetailView";
import "../../styles/manageArticles.css";

const ManageArticles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = localStorage.getItem("adminRole"); // super-admin | editor
  const token = localStorage.getItem("adminToken");
  
  const { articles, loading, error } = useSelector((state) => state.articles);
  
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const limit = 4; // Changed from 5 to 4 items per page

  /* ===== AUTH CHECK ===== */
  useEffect(() => {
    if (!token || !role) {
      navigate("/admin/login");
      return;
    }
    
    // Allow both super-admin and admin roles
    if (role !== "super-admin" && role !== "admin") {
      console.warn("Limited permissions enabled");
    }
  }, [token, role, navigate]);

  // Check authentication on component mount
  useEffect(() => {
    if (!token || !role) {
      navigate("/admin/login");
      return;
    }
    
    // Allow both super-admin and admin roles
    if (role !== "super-admin" && role !== "admin") {
      console.warn("Limited permissions enabled");
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedArticle(null);
    setShowDetailView(true);
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setShowDetailView(true);
  };

  const handleSave = async (data) => {
    try {
      // Use direct API calls since articleSlice doesn't have these actions
      if (selectedArticle) {
        await api.put(`/articles/${selectedArticle._id}`, data);
      } else {
        await api.post('/articles', data);
      }
      dispatch(fetchArticles());
      setShowDetailView(false);
      setSuccessMessage("Saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this article?")) {
      try {
        await api.delete(`/articles/${id}`);
        dispatch(fetchArticles());
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/articles/${id}/approve`);
      dispatch(fetchArticles());
      setSuccessMessage("Article approved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to approve article:", error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(articles.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const currentArticles = articles.slice(startIndex, endIndex);

  return (
    <div className="manage-articles">

      {/* ===== HEADER ===== */}
      <div className="page-header">
        <h2>Manage Articles</h2>
        <button className="btn-primary" onClick={handleAdd}>+ Add Article</button>
      </div>

      {error && <p className="no-data">{error}</p>}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}


      {/* ===== TABLE ===== */}
      <div className="table-box">
        {loading ? (
          <Loader />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentArticles.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty">
                    No articles found
                  </td>
                </tr>
              )}

              {currentArticles.map((a) => (
                <tr key={a._id}>
                  <td>{a.title}</td>
                  <td>{a.category}</td>
                  <td>
                    <span
                      className={
                        a.status === "approved" ? "status approved" : "status pending"
                      }
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="actions">
                    {(role === "super-admin" || role === "editor") && (
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(a)}
                      >
                        Edit
                      </button>
                    )}

                    {role === "super-admin" && a.status !== "approved" && (
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(a._id)}
                      >
                        Approve
                      </button>
                    )}

                    {role === "super-admin" && (
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(a._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
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
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      )}

      {/* ===== DETAIL VIEW ===== */}
      {showDetailView && (
        <ArticleDetailView
          article={selectedArticle}
          onClose={() => setShowDetailView(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ManageArticles;
