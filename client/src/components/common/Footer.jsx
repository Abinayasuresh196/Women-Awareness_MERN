import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import "../../styles/footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { i18n } = useTranslation();
  
  // Get current language
  const currentLanguage = i18n.language;

  const handleLogout = () => {
    logout();
    if (user && (user.role === "admin" || user.role === "super-admin")) {
      navigate("/admin/login");
    } else {
      navigate("/login");
    }
  };

  // Define all pages
  const allPages = [
    { path: "/home", label: "Home", labelTa: "முகப்பு" },
    { path: "/about", label: "About", labelTa: "எங்களைப் பற்றி" },
    { path: "/laws", label: "Laws", labelTa: "சட்டங்கள்" },
    { path: "/schemes", label: "Schemes", labelTa: "திட்டங்கள்" },
    { path: "/awareness", label: "Awareness", labelTa: "விழிப்புணர்வு" },
    { path: "/women-resources", label: "Women Resources", labelTa: "பெண்கள் வளங்கள்" },
    { path: "/general-news", label: "General News", labelTa: "பொது செய்திகள்" }
  ];

  // Filter out the current page
  const filteredPages = allPages.filter(page => page.path !== location.pathname);

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* ABOUT */}
        <div className="footer-about">
          <div className="footer-logo">
            <img 
              src="/assets/images/logo.png" 
              alt={currentLanguage === 'ta' ? 'பெண்கள் விழிப்புணர்வு' : 'Women Awareness'}
              className="footer-logo-img"
            />
            <h2>
              {currentLanguage === 'ta' ? 'பெண்கள் விழிப்புணர்வு' : 'Women Awareness'}
            </h2>
          </div>
          <p>
            {currentLanguage === 'ta' 
              ? 'விழிப்புணர்வு, சட்ட அறிவு மற்றும் அரசு திட்டங்களை அணுகுவதன் மூலம் பெண்களை மேம்படுத்துதல்.'
              : 'Empowering women through awareness, legal knowledge, and access to government schemes.'
            }
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-links">
          <h3>
            {currentLanguage === 'ta' ? 'விரைவு இணைப்புகள்' : 'Quick Links'}
          </h3>
          <ul>
            {filteredPages.map((page) => (
              <li key={page.path}>
                <Link to={page.path}>
                  {currentLanguage === 'ta' ? page.labelTa : page.label}
                </Link>
              </li>
            ))}
            {user ? (
              <li>
                <button onClick={handleLogout} className="footer-logout-btn">
                  {currentLanguage === 'ta' ? 'வெளியேறு' : 'Logout'}
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login">
                  {currentLanguage === 'ta' ? 'உள்நுழைய' : 'Login'}
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* SOCIAL */}
        <div className="footer-social">
          <h3>
            {currentLanguage === 'ta' ? 'எங்களைப் பின்தொடரவும்' : 'Follow Us'}
          </h3>
          <div className="social-icons">
            <a 
              href="https://www.facebook.com/ncwindia" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a 
              href="https://twitter.com/NCWIndia" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a 
              href="https://www.instagram.com/unwomen" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a 
              href="https://www.linkedin.com/company/un-women" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        {currentLanguage === 'ta' 
          ? `© ${new Date().getFullYear()} பெண்கள் விழிப்புணர்வு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.`
          : `© ${new Date().getFullYear()} Women Awareness. All Rights Reserved.`
        }
      </div>
    </footer>
  );
};

export default Footer;
