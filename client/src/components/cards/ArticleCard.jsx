import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ArticleModal from "../modals/ArticleModal";
import "../../styles/LawCard.css";

const ArticleCard = ({ article, onOpenSubmission }) => {
  const [showModal, setShowModal] = useState(false);
  const { i18n, t } = useTranslation();
  const isTamil = i18n.language === 'ta';

  const handleLearnMore = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Use truly unique images for each card based on full ObjectId hash
  const getCardImage = (articleId) => {
    if (!articleId) return "https://picsum.photos/400/200?random=article_default";

    // Create a hash from the full ObjectId for true uniqueness
    let hash = 0;
    const idString = articleId.toString();
    for (let i = 0; i < idString.length; i++) {
      const char = idString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use absolute value and large modulo for maximum uniqueness
    const imageIndex = Math.abs(hash) % 1500 + 1;
    return `https://picsum.photos/400/200?random=article_${imageIndex}`;
  };

  // Get category color for styling
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

  // Get category label with translation
  const getCategoryLabel = (category) => {
    const labels = {
      'Legal': isTamil ? 'சட்டம்' : 'Legal',
      'Health': isTamil ? 'ஆரோக்கியம்' : 'Health',
      'Education': isTamil ? 'கல்வி' : 'Education',
      'Employment': isTamil ? 'வேலைவாய்பு' : 'Employment',
      'General': isTamil ? 'பொது' : 'General'
    };
    return labels[category] || category;
  };

  return (
    <>
      <div className="law-card">
        <div className="law-image-container">
          <img
            src={getCardImage(article._id)} // Use URL-based unique image for each card
            alt={article.title}
            className="law-image"
            onError={(e) => {
              e.target.src = article.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmNhMDJjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4mYXJ0aWNsZTs8L3RleHQ+PC9zdmc+";
            }}
          />
          <div
            className="law-category-badge"
            style={{ backgroundColor: getCategoryColor(article.category) }}
          >
            {getCategoryLabel(article.category)}
          </div>
        </div>

        <div className="law-content">
          <h3 className="law-title">{isTamil ? (article.title_ta || article.title) : article.title}</h3>
          <p className="law-description">
            {isTamil ? (article.summary_ta || article.summary || article.content?.substring(0, 120) + "...") : (article.summary || article.content?.substring(0, 120) + "...")}
          </p>
          <div className="law-actions">
            <button
              onClick={() => handleLearnMore()}
              className="law-link-btn"
            >
              <span className="link-text">{isTamil ? 'மேலும் அறிய' : (t('learnMore') || 'Learn More')}</span>
              <span className="link-icon">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Article Modal with AI Report Generation */}
      <ArticleModal
        article={article}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ArticleCard;
