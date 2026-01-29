import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LawModal from "../modals/LawModal";
import "../../styles/LawCard.css";

const LawCard = ({ law, onLearnMore }) => {
  const { i18n, t } = useTranslation();
  const isTamil = i18n.language === 'ta';
  const [showModal, setShowModal] = useState(false);

  
  if (!law || !law._id) {
    return null;
  }

  const {
    image,
    title,
    title_ta,
    description,
    description_ta,
    content,
    content_ta,
    link,
    category,
  } = law;

  // Use truly unique images for each card based on full ObjectId hash
  const getCardImage = (lawId) => {
    if (!lawId) return "https://picsum.photos/400/200?random=law_default";

    // Create a hash from the full ObjectId for true uniqueness
    let hash = 0;
    const idString = lawId.toString();
    for (let i = 0; i < idString.length; i++) {
      const char = idString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use absolute value and large modulo for maximum uniqueness
    const imageIndex = Math.abs(hash) % 1000 + 1;
    return `https://picsum.photos/400/200?random=law_${imageIndex}`;
  };

  const fallbackImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmQyZjdmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4mbGFiZTs8L3RleHQ+PC9zdmc+";

  // Category color mapping
  const getCategoryColor = (category) => {
    const colors = {
      'criminal': '#e74c3c',
      'family': '#3498db',
      'property': '#f39c12',
      'employment': '#27ae60',
      'domestic': '#9b59b6',
      'cyber': '#8e44ad',
      'harassment': '#e67e22',
      'rights': '#34495e',
      'political': '#9c27b0',
      'constitutional': '#2196f3',
      'protection': '#ff9800',
      'marriage': '#e91e63',
      'health': '#4caf50',
      'laws': '#607d8b',
      'default': '#667eea'
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  // Category label mapping
  const getCategoryLabel = (category) => {
    const labels = {
      'criminal': isTamil ? 'குற்றம்' : 'Criminal',
      'family': isTamil ? 'குடும்பம்' : 'Family',
      'property': isTamil ? 'சொத்து' : 'Property',
      'employment': isTamil ? 'வேலை' : 'Employment',
      'domestic': isTamil ? 'உள்நோக்கம்' : 'Domestic',
      'cyber': isTamil ? 'சைபர்' : 'Cyber',
      'harassment': isTamil ? 'தொந்தனம்' : 'Harassment',
      'rights': isTamil ? 'உரிமைகள்' : 'Rights',
      'political': isTamil ? 'அரசியல்' : 'Political',
      'constitutional': isTamil ? 'அரசியலமைப்பு' : 'Constitutional',
      'protection': isTamil ? 'பாதுகாப்பு' : 'Protection',
      'marriage': isTamil ? 'திருமணம்' : 'Marriage',
      'health': isTamil ? 'ஆரோக்கியம்' : 'Health',
      'laws': isTamil ? 'சட்டங்கள்' : 'Laws'
    };

    // Return the mapped label if it exists, otherwise capitalize the actual category name
    const categoryKey = category?.toLowerCase();
    return labels[categoryKey] || (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'General');
  };

  // Use Tamil content if available and language is Tamil
  const displayTitle = isTamil ? (title_ta || title) : title;
  const displayDescription = isTamil ?
    (description_ta || description) :
    (description || (content ? `${content.substring(0, 120)}...` : ""));
  const displayContent = isTamil ?
    (content_ta || content) : // For Women's Reservation Act, content_ta doesn't exist, so it will use English content
    content;

  const shortDescription = displayDescription || (displayContent ? `${displayContent.substring(0, 120)}...` : "");

  
  return (
    <div className="law-card">
      <div className="law-image-container">
        <img
          src={getCardImage(law._id)} // Use URL-based unique image for each card
          alt={displayTitle || "Law"}
          className="law-image"
          onError={(e) => {
            e.target.src = image || fallbackImage;
          }}
        />
        {category && (
          <div
            className="law-category-badge"
            style={{ backgroundColor: getCategoryColor(category) }}
          >
            {getCategoryLabel(category)}
          </div>
        )}
      </div>
      <div className="law-content">
        <h3 className="law-title">{displayTitle}</h3>
        <p className="law-description">
          {isTamil ? 
            (law.description_ta || law.description || law.content?.substring(0, 120) + "...") : 
            (law.description || law.content?.substring(0, 120) + "...")
          }
        </p>
        <div className="law-actions">
          <button
            onClick={() => onLearnMore && onLearnMore(law)}
            className="law-link-btn"
          >
            <span className="link-text">{isTamil ? 'மேலும் அறிய' : (t('learnMore') || 'Learn More')}</span>
            <span className="link-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LawCard;
