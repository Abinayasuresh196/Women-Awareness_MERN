import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import "../../styles/navbar.css";
import LanguageSwitch from "./LanguageSwitch";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    // Always redirect to home page for both user and admin logout
    navigate("/home");
  };

  const currentLanguage = i18n.language;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        {/* 1. Left: Logo */}
        <Link to="/" className="navbar-logo-wrapper">
          <img src="/assets/images/logo.png" alt="Logo" className="navbar-logo-img" />
          <div className="navbar-logo-text">
            <span>{currentLanguage === 'ta' ? 'பெண்கள் விழிப்புணர்வு' : 'Women Awareness'}</span>
          </div>
        </Link>

        {/* 2. Middle: Navigation Links (Hides on Mobile) */}
        <ul className={`nav-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <li><NavLink to="/home" onClick={() => setMobileMenuOpen(false)} className="nav-link">{currentLanguage === 'ta' ? 'முகப்பு' : 'Home'}</NavLink></li>
          <li><NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className="nav-link">{currentLanguage === 'ta' ? 'எங்களைப் பற்றி' : 'About'}</NavLink></li>
          <li><NavLink to="/laws" onClick={() => setMobileMenuOpen(false)} className="nav-link">{currentLanguage === 'ta' ? 'சட்டங்கள்' : 'Laws'}</NavLink></li>
          <li><NavLink to="/schemes" onClick={() => setMobileMenuOpen(false)} className="nav-link">{currentLanguage === 'ta' ? 'திட்டங்கள்' : 'Schemes'}</NavLink></li>
          <li><NavLink to="/awareness" onClick={() => setMobileMenuOpen(false)} className="nav-link">{currentLanguage === 'ta' ? 'விழிப்புணர்வு' : 'Awareness'}</NavLink></li>
          <li><NavLink to="/women-resources" onClick={() => setMobileMenuOpen(false)} className="nav-link">{currentLanguage === 'ta' ? 'பெண்கள் வளங்கள்' : 'Women Resources'}</NavLink></li>
          <li><NavLink to="/general-news" onClick={() => setMobileMenuOpen(false)} className="nav-link">{currentLanguage === 'ta' ? 'பொது செய்திகள்' : 'General News'}</NavLink></li>
        </ul>

        {/* 3. Right Side: Actions (Login/User & Lang) - ALWAYS VISIBLE */}
        <div className="navbar-actions">
          
          {/* Show language switch only for user routes, not admin routes */}
          {!isAdminRoute && (
            <div className="lang-wrapper">
               <LanguageSwitch />
            </div>
          )}

          {user ? (
            <div className="auth-status-fixed">
              <div className="user-avatar-name">
                <img src="/assets/images/avatar.png" alt="User" className="user-avatar" />
                <span className="user-name-desktop">{user.name}</span>
              </div>
              <button className="logout-btn-fixed" onClick={handleLogout}>
                {currentLanguage === 'ta' ? 'வெளியேறு' : 'Logout'}
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="login-btn-fixed">
              {currentLanguage === 'ta' ? 'உள்நுழைய' : 'Login'}
            </NavLink>
          )}

          {/* Hamburger Icon - Only for links */}
          <div className="menu-icon" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
            <span className={isMobileMenuOpen ? "open" : ""}></span>
            <span className={isMobileMenuOpen ? "open" : ""}></span>
            <span className={isMobileMenuOpen ? "open" : ""}></span>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
