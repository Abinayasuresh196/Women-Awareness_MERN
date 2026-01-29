import React, { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./AdminLayout.css";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/home", { replace: true });
  };

  return (
    <div className="admin-layout">
      {/* NAVBAR */}
      <header className="admin-header">
        <div className="navbar-container">
          {/* Left: Logo */}
          <div className="admin-header-left">
            <Link to="/admin/dashboard" className="admin-logo">
              <img src="/assets/images/logo.png" alt="Logo" className="admin-logo-img" />
              <span className="admin-logo-text">Admin Panel</span>
            </Link>
          </div>

          {/* Right: User Actions */}
          <div className="admin-header-right">
            <div className="admin-user-profile">
              <span className="admin-user-name">{user?.name || "Super Admin"}</span>
              <img 
                src="/assets/images/avatar.png" 
                alt="Avatar" 
                className="admin-user-avatar"
              />
              <button className="admin-logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="admin-body">
        {/* ALWAYS VISIBLE SIDEBAR */}
        <aside className="admin-sidebar">
          <nav className="admin-sidebar-nav">
            <NavLink to="/admin/dashboard" className="admin-sidebar-item">
              <span className="icon">📊</span> Dashboard
            </NavLink>
            <NavLink to="/admin/manage-laws" className="admin-sidebar-item">
              <span className="icon">⚖️</span> Manage Laws
            </NavLink>
            <NavLink to="/admin/manage-schemes" className="admin-sidebar-item">
              <span className="icon">💼</span> Manage Schemes
            </NavLink>
            <NavLink to="/admin/manage-articles" className="admin-sidebar-item">
              <span className="icon">📰</span> Manage Articles
            </NavLink>
            <NavLink to="/admin/women-resources" className="admin-sidebar-item">
              <span className="icon">🤝</span> Women Resources
            </NavLink>
            <NavLink to="/admin/feedback" className="admin-sidebar-item">
              <span className="icon">💬</span> Feedback
            </NavLink>
            
            
          </nav>
        </aside>

        {/* SCROLLABLE MAIN CONTENT */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;