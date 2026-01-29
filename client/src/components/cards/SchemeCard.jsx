import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LawModal from "../modals/LawModal";
import "../../styles/LawCard.css";

const SchemeCard = ({ scheme, onLearnMore }) => {
  const { i18n, t } = useTranslation();
  const isTamil = i18n.language === 'ta';
  const [showModal, setShowModal] = useState(false);

  if (!scheme) {
    return null;
  }

  const {
    image,
    name,
    name_ta,
    benefits,
    benefits_ta,
    eligibility,
    eligibility_ta,
    description,
    description_ta,
    link,
    category,
    features,
    features_ta,
    services,
    services_ta,
  } = scheme;

  // Use truly unique images for each card based on full ObjectId hash
  const getCardImage = (resourceId) => {
    if (!resourceId) return "https://picsum.photos/400/200?random=women_default";

    // Create a hash from the full ObjectId for true uniqueness
    let hash = 0;
    const idString = resourceId.toString();
    for (let i = 0; i < idString.length; i++) {
      const char = idString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use absolute value and large modulo for maximum uniqueness
    const imageIndex = Math.abs(hash) % 2000 + 1;
    return `https://picsum.photos/400/200?random=women_${imageIndex}`;
  };

  const fallbackImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmQyZjdmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4mJmFyb3c7PC90ZXh0Pjwvc3ZnPg==";

  // Category color mapping - matching LawCard colors
  const getCategoryColor = (category) => {
    const colors = {
      'government': '#3498db',
      'health': '#27ae60',
      'safety': '#e74c3c',
      'emergency': '#e67e22',
      'legal': '#9b59b6',
      'education': '#f39c12',
      'financial': '#16a085',
      'ngo': '#8e44ad',
      'international': '#d35400',
      'digital': '#34495e',
      'employment': '#e91e63',
      'default': '#667eea'
    };
    return colors[category?.toLowerCase()] || colors.default;
  };

  // Category label mapping
  const getCategoryLabel = (category) => {
    const labels = {
      'government': isTamil ? 'அரசு' : 'Government',
      'health': isTamil ? 'நலம்' : 'Health',
      'safety': isTamil ? 'பாதுகாப்பு' : 'Safety',
      'emergency': isTamil ? 'அவசர' : 'Emergency',
      'legal': isTamil ? 'சட்டம்' : 'Legal',
      'education': isTamil ? 'கல்வி' : 'Education',
      'financial': isTamil ? 'நிதி' : 'Financial',
      'ngo': isTamil ? 'என்ஜிஓ' : 'NGO',
      'international': isTamil ? 'சர்வதேச' : 'International',
      'digital': isTamil ? 'டிஜிட்டல்' : 'Digital',
      'employment': isTamil ? 'வேலை' : 'Employment'
    };

    // Return the mapped label if it exists, otherwise capitalize the actual category name
    const categoryKey = category?.toLowerCase();
    return labels[categoryKey] || (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'General');
  };

  // Use Tamil content if available and language is Tamil
  const displayTitle = isTamil ? (name_ta || name) : name;
  const displayDescription = isTamil ?
    (description_ta || benefits_ta || eligibility_ta || benefits) :
    (description || benefits || eligibility);
  const displayContent = isTamil ?
    (description_ta || benefits_ta || eligibility_ta || benefits) :
    (description || benefits || eligibility);

  const shortDescription = displayDescription || (displayContent ? `${displayContent.substring(0, 120)}...` : "");

  return (
    <div className="law-card">
      <div className="law-image-container">
        <img
          src={getCardImage(scheme._id)}
          alt={displayTitle || "Women Resource"}
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
              (description_ta || benefits_ta || eligibility_ta || description || benefits || eligibility || content?.substring(0, 120) + "...") : 
              (description || benefits || eligibility || content?.substring(0, 120) + "...")
            }
          </p>
          <div className="law-actions">
            <button
              onClick={() => onLearnMore && onLearnMore(scheme)}
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

export default SchemeCard;
