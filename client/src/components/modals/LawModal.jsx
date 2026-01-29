import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/lawModal.css";

const LawModal = ({ law, isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';

  if (!isOpen || !law) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Category color mapping
  const getCategoryColor = (category) => {
    const colors = {
      'constitutional': '#1f77b4',
      'protection': '#2ca02c',
      'marriage': '#ff7f0e',
      'property': '#d62728',
      'health': '#9467bd',
      'political': '#8c564b'
    };
    return colors[category?.toLowerCase()] || '#6c757d';
  };

  // Category label mapping
  const getCategoryLabel = (category, isTamil) => {
    const labels = {
      'constitutional': isTamil ? 'அரசியலமைப்பு' : 'Constitutional',
      'protection': isTamil ? 'பாதுகாப்பு' : 'Protection',
      'marriage': isTamil ? 'திருமணம்' : 'Marriage',
      'property': isTamil ? 'சொத்து' : 'Property',
      'health': isTamil ? 'ஆரோக்கியம்' : 'Health',
      'political': isTamil ? 'அரசியல்' : 'Political'
    };
    return labels[category?.toLowerCase()] || (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'General');
  };

  // Use Tamil content if available and language is Tamil
  const displayTitle = isTamil ? (law.title_ta || law.title) : law.title;
  const displayDescription = isTamil ?
    (law.description_ta || law.description) :
    (law.description || (law.content ? `${law.content.substring(0, 150)}...` : ""));
  const displayContent = isTamil ?
    (law.content_ta || law.content) :
    law.content;

  const shortDescription = displayDescription || (displayContent ? `${displayContent.substring(0, 120)}...` : "");

  return (
    <div className="law-modal-overlay" onClick={handleBackdropClick}>
      <div className="law-modal">
        <button className="law-modal-close-btn" onClick={onClose}>×</button>

        <div className="law-modal-content">
          {/* Left Side - Image */}
          <div className="law-modal-image-section">
            <img
              src={law.image || "/api/placeholder/600/400"}
              alt={displayTitle || "Law"}
              className="law-modal-main-image"
              onError={(e) => {
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
              }}
            />
            <div className="law-modal-category-badge" style={{
              backgroundColor: getCategoryColor(law.category)
            }}>
              {getCategoryLabel(law.category, isTamil)}
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="law-modal-details-section">
            {/* Title + Short Summary */}
            <div className="law-modal-header">
              <h1 className="law-modal-title">{displayTitle}</h1>
              <p className="law-modal-summary">{shortDescription}</p>
            </div>

            {/* Main Content - Condensed for single screen */}
            <div className="law-modal-compact-content">
              {/* Title Name Section */}
              <div className="law-modal-section-compact">
                <h3 className="law-section-title-compact">{isTamil ? '📋 தலைப்பு' : '📋 Title'}</h3>
                <p className="law-section-content-compact">
                  <span style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '1.1rem' }}>
                    {displayTitle || law.title || law.name || 'No Title Available'}
                  </span><br/>
                  {isTamil ? 'இந்த சட்டம் பெண்களின் உரிமைகள் மற்றும் பாதுகாப்புக்காக வடிவமைக்கப்பட்டுள்ளது.' : 'This law is designed for women\'s rights and protection.'}
                </p>
              </div>

              {/* Overview */}
              <div className="law-modal-section-compact">
                <h3 className="law-section-title-compact">{isTamil ? '🎯 சுருக்கம்' : '🎯 Overview'}</h3>
                <p className="law-section-content-compact">
                  {isTamil ?
                    (displayDescription ? displayDescription.substring(0, 150) + "..." : "பெண்களின் உரிமைகள் மற்றும் பாதுகாப்பு பற்றிய விரிவான சட்ட தகவல்.") :
                    (displayDescription ? displayDescription.substring(0, 150) + "..." : "Comprehensive legal information about women's rights and protection.")
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

              {/* URL/Link Section - Show prominently for resources */}
              {law.link && (
                <div className="law-modal-section-compact">
                  <h3 className="law-section-title-compact">{isTamil ? '🔗 வலைதள இணைப்பு' : '🔗 Website Link'}</h3>
                  <div className="law-url-display">
                    <div className="law-url-text">
                      <span className="url-label">{isTamil ? 'இணைய முகவரி:' : 'URL:'}</span>
                      <span className="url-value">{law.link}</span>
                    </div>
                    <button
                      className="law-url-visit-btn"
                      onClick={() => window.open(law.link, "_blank")}
                      title={isTamil ? 'புதிய சாளரத்தில் திற' : 'Open in new window'}
                    >
                      {isTamil ? '🌐 செல்' : '🌐 Visit'}
                    </button>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {(law.subCategory || law.image) && (
                <div className="law-modal-section-compact">
                  <h3 className="law-section-title-compact">{isTamil ? 'ℹ️ கூடுதல் தகவல்' : 'ℹ️ Additional Information'}</h3>
                  <div className="law-additional-info">
                    {law.subCategory && (
                      <div className="law-info-item">
                        <strong>{isTamil ? 'உள்வகை:' : 'Sub Category:'}</strong> {law.subCategory}
                      </div>
                    )}
                    {law.image && (
                      <div className="law-info-item">
                        <strong>{isTamil ? 'படம்:' : 'Image:'}</strong> 
                        <span className="image-url">{law.image}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Important Note */}
              <div className="law-modal-note">
                <p><strong>{isTamil ? '💡 குறிப்பு:' : '💡 Note:'}</strong> {isTamil ? 'இந்த சேவை முற்றிலும் இலவசம் மற்றும் ரகசியமானது. தேவைப்படும் பெண்களுக்கு 24/7 உதவி கிடைக்கிறது.' : 'This service is completely free and confidential. Help is available 24/7 for women in need.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawModal;
