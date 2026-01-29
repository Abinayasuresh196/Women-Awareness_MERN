import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchLaws,
  addLaw,
  updateLaw,
  deleteLaw,
  approveLaw
} from "../../features/laws/lawSlice";
import Loader from "../../components/common/Loader";
import LawDetailView from "../../components/admin/LawDetailView";
import "../../styles/manageLaws.css";

const ManageLaws = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { laws, loading, error } = useSelector((state) => state.laws);

  const [selectedLaw, setSelectedLaw] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  /* ===== PAGINATION ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  /* ===== AUTH CHECK ===== */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");

    if (!token || !role) {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchLaws());
  }, [dispatch]);

  /* ===== PAGINATION LOGIC ===== */
  const totalPages = Math.ceil(laws.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentLaws = laws.slice(indexOfFirst, indexOfLast);

  /* ===== HANDLERS ===== */
  const handleAdd = () => {
    setSelectedLaw(null);
    setShowDetailView(true);
  };

  const handleEdit = (law) => {
    setSelectedLaw(law);
    setShowDetailView(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this law?")) {
      dispatch(deleteLaw(id));
    }
  };

  const handleApprove = (id) => {
    dispatch(approveLaw(id));
  };

  const handleSave = async (data) => {
    try {
      if (selectedLaw) {
        await dispatch(updateLaw({ id: selectedLaw._id, data })).unwrap();
      } else {
        await dispatch(addLaw(data)).unwrap();
      }
      dispatch(fetchLaws());
      setShowDetailView(false);
      setSuccessMessage("Saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="manage-laws-page">
      <div className="content-wrapper">

        {/* ===== HEADER ===== */}
        <div className="page-header">
          <h2>Manage Laws</h2>
          <button className="btn-primary" onClick={handleAdd}>
            + Add Law
          </button>
        </div>

        {loading && <Loader />}
        {error && <p className="laws-error">{error}</p>}

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {/* ===== TABLE ===== */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>AI Check</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentLaws.length === 0 ? (
              <tr>
                <td colSpan="5" align="center">No laws found</td>
              </tr>
            ) : (
              currentLaws.map((law) => (
                <tr key={law._id}>
                  <td>{law.title}</td>
                  <td>{law.category}</td>

                  {/* STATUS */}
                  <td>
                    <span className={`status ${law.status || "pending"}`}>
                      {law.status}
                    </span>
                  </td>

                  {/* AI STATUS */}
                  <td>
                    <div className="status-container">
                      <span
                        className={`status ${
                          law.aiVerificationResult === 'verified' ? "approved" : "pending"
                        }`}
                      >
                        {law.aiVerificationResult === 'verified' ? "AI Verified" : "AI Pending"}
                      </span>

                      {law.aiVerificationNotes && (
                        <div className="ai-status">
                          <small>{law.aiVerificationNotes}</small>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(law)}>
                      Edit
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(law._id)}
                    >
                      Delete
                    </button>

                    {law.status === "pending" && law.aiVerified && (
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(law._id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ===== PAGINATION ===== */}
        <div className="pagination-wrapper">
          <div className="pagination-info">
            Showing {currentLaws.length} of {laws.length} laws
          </div>

          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ← Prev
            </button>

            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`pagination-number ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next →
            </button>
          </div>
        </div>

        {/* ===== DETAIL VIEW ===== */}
        {showDetailView && (
          <LawDetailView
            law={selectedLaw}
            onClose={() => setShowDetailView(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default ManageLaws;
