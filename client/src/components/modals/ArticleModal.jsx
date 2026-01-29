import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ReportModal from "./ReportModal";
import "../../styles/lawModal.css";

const ArticleModal = ({ article, isOpen, onClose, onOpenSubmission }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const { i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  if (!isOpen || !article) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  return (
    <div className="law-modal-overlay" onClick={handleBackdropClick}>
      <div className="law-modal">
        <button className="law-modal-close-btn" onClick={onClose}>×</button>

        {/* Generate Report Button - Top Right */}
        <button
          className="generate-report-modal-btn"
          onClick={handleGenerateReport}
        >
          📊 {isTamil ? 'அறிக்கை உருவாக்கு' : 'Generate Report'}
        </button>

        <div className="law-modal-content">
          {/* Left Side - Image */}
          <div className="law-modal-image-section">
            <img
              src={article.image || "/api/placeholder/600/400"}
              alt={article.title}
              className="law-modal-main-image"
              onError={(e) => {
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
              }}
            />
            <div className="law-modal-category-badge" style={{
              backgroundColor: getCategoryColor(article.category)
            }}>
              {getCategoryLabel(article.category, isTamil)}
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="law-modal-details-section">
            {/* Title + Short Summary */}
            <div className="law-modal-header">
              <h1 className="law-modal-title">{isTamil ? (article.title_ta || article.title) : article.title}</h1>
              <p className="law-modal-summary">{isTamil ? (article.summary_ta || article.summary) : article.summary}</p>
            </div>

            {/* Main Content - Condensed for single screen */}
            <div className="law-modal-compact-content">
              {/* Title Name Section */}
              <div className="law-modal-section-compact">
                <h3 className="law-section-title-compact">{isTamil ? '📋 தலைப்பு' : '📋 Title'}</h3>
                <p className="law-section-content-compact">
                  <span style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '1.1rem' }}>
                    {(isTamil ? (article.title_ta || article.title) : article.title) || article.name || 'No Title Available'}
                  </span><br/>
                  {isTamil ? 'இந்த கட்டுரை பெண்களின் விழிப்புணர்வு மற்றும் அதிகாரமளிப்புக்காக வடிவமைக்கப்பட்டுள்ளது.' : 'This article is designed for women\'s awareness and empowerment.'}
                </p>
              </div>

              {/* Overview */}
              <div className="law-modal-section-compact">
                <h3 className="law-section-title-compact">{isTamil ? '🎯 சுருக்கம்' : '🎯 Overview'}</h3>
                <p className="law-section-content-compact">
                  {isTamil ? 
                    (article.content_ta || article.content ? (article.content_ta || article.content).substring(0, 150) + "..." : "பெண்களை அறிவுறுத்தல் மற்றும் ஆதரவுடன் அதிகாரமளிக்க வடிவமைக்கப்பட்ட விரிவான விழிப்புணர்வு மற்றும் கல்வி திட்டம்.") :
                    (article.content ? article.content.substring(0, 150) + "..." : "Comprehensive awareness and education program designed to empower women with knowledge and support.")
                  }
                </p>
              </div>

              {/* Key Benefits */}
              <div className="law-modal-section-compact">
                <h3 className="law-section-title-compact">{isTamil ? '✨ முக்கிய நன்மைகள்' : '✨ Key Benefits'}</h3>
                <div className="law-benefits-grid">
                  <div className="law-benefit-item">{isTamil ? '• சட்டபூர்வமான உரிமைகள் விழிப்புணர்வு' : '• Legal Rights Awareness'}</div>
                  <div className="law-benefit-item">{isTamil ? '• பாதுகாப்பு மற்றும் பாதுகாப்பு' : '• Safety & Security'}</div>
                  <div className="law-benefit-item">{isTamil ? '• சமூக ஆதரவு' : '• Community Support'}</div>
                  <div className="law-benefit-item">{isTamil ? '• அதிகாரமளிப்பு திட்டங்கள்' : '• Empowerment Programs'}</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="law-modal-section-compact">
                <h3 className="law-section-title-compact">{isTamil ? '🚀 விரைவான நடவடிக்கைகள்' : '🚀 Quick Actions'}</h3>
                <div className="law-quick-actions-grid">
                  <button
                    className="law-quick-action-btn primary"
                    onClick={() => window.open("tel:181", "_blank")}
                  >
                    {isTamil ? '📞 உதவித்தொலைபேசி (181)' : '📞 Helpline (181)'}
                  </button>
                  <button
                    className="law-quick-action-btn secondary"
                    onClick={() => window.open("tel:112", "_blank")}
                  >
                    {isTamil ? '🚔 அவசரம் (112)' : '🚔 Emergency (112)'}
                  </button>
                </div>
              </div>

              {/* Important Note */}
              <div className="law-modal-note">
                <p><strong>{isTamil ? '💡 குறிப்பு:' : '💡 Note:'}</strong> {isTamil ? 'இந்த சேவை முற்றிலும் இலவசம் மற்றும் ரகசியமானது. தேவைப்படும் பெண்களுக்கு 24/7 உதவி கிடைக்கிறது.' : 'This service is completely free and confidential. Help is available 24/7 for women in need.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        article={article}
        isOpen={showReportModal}
        onClose={handleCloseReportModal}
      />
    </div>
  );
};

// Helper functions (same as in ArticleCard)
const getCategoryColor = (category) => {
  const colors = {
    'Legal': '#1f77b4',
    'Health': '#2ca02c',
    'Education': '#ff7f0e',
    'Employment': '#d62728',
    'General': '#9467bd'
  };
  return colors[category] || '#6c757d';
};

const getCategoryLabel = (category, isTamil) => {
  const labels = {
    'Legal': isTamil ? 'சட்டம்' : 'Legal',
    'Health': isTamil ? 'ஆரோக்கியம்' : 'Health',
    'Education': isTamil ? 'கல்வி' : 'Education',
    'Employment': isTamil ? 'வேலைவாய்ப்பு' : 'Employment',
    'General': isTamil ? 'பொது' : 'General'
  };
  return labels[category] || category;
};

export default ArticleModal;
