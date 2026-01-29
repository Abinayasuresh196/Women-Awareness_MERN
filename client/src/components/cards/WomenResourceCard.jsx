import React from "react";
import { useTranslation } from "react-i18next";
import "../../styles/WomenResources.css"; // Main CSS file use panrom consistency-kaga

const WomenResourceCard = ({ resource, onLearnMore }) => {
  const { i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';

  if (!resource) return null;

  const { title, description, link, category } = resource;

  // Helper: Backend-la irunthu vara Language objects (en/ta) handle panna
  const getText = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return isTamil ? (field.ta || field.en) : (field.en || field.ta);
  };

  const displayTitle = getText(title);
  const displayDescription = getText(description);

  // Fallback Wikipedia link if DB link is not provided
  const generateWikipediaLink = (title) => {
    if (!title) return "#";
    const cleanTitle = displayTitle.replace(/\s+/g, '_').trim();
    return `https://en.wikipedia.org/wiki/${cleanTitle}`;
  };

  return (
    <div className="resource-card">
      <div className="resource-header">
        {/* Show actual category instead of generic "Information" */}
        {category && (
          <span className="resource-category">
            {category}
          </span>
        )}
        <h3>{displayTitle}</h3>
      </div>

      <div className="resource-content">
        {/* Card-la description short-ah irukkum */}
        <p>{displayDescription}</p>
      </div>

      <div className="resource-actions">
        {/* Learn More: Ithu click aanal main page-la overlay open aagum */}
        <button 
          className="tab-btn" 
          style={{ flex: 1, fontSize: '0.85rem', padding: '10px' }}
          onClick={() => onLearnMore(resource)}
        >
          {isTamil ? "மேலும் அறிய" : "Learn More"}
        </button>

        {/* Visit: Link to Wikipedia page */}
        <a 
          href={link || generateWikipediaLink(title)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="visit-btn"
        >
          {isTamil ? "பார்வையிடு" : "Visit"}
        </a>
      </div>
    </div>
  );
};

export default WomenResourceCard;
