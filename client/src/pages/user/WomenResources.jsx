import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import womenResourceService from "../../services/womenResourceService";
import WomenResourceCard from "../../components/cards/WomenResourceCard";
import Loader from "../../components/common/Loader";
import "../../styles/FIRAssistant.css";
import "../../styles/WomenResources.css";
import "../../styles/lawModal.css";

const WomenResources = () => {
  const { t, i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  
  // Exactly 3 tabs: gov, apps, websites
  const [activeTab, setActiveTab] = useState("gov");
  const [allResources, setAllResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchAllResources = async () => {
      try {
        setLoading(true);
        setError(null);
        const language = isTamil ? 'ta' : 'en';
        // Use getResourcesByCategory to get all resources grouped by category
        const response = await womenResourceService.getResourcesByCategory(language);
        
        // Flatten all categories into a single array
        const allResourcesArray = [];
        Object.values(response.data).forEach(categoryResources => {
          if (Array.isArray(categoryResources)) {
            allResourcesArray.push(...categoryResources);
          }
        });
        
        setAllResources(allResourcesArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError(err.message || 'Failed to load resources');
        setLoading(false);
        toast.error(isTamil ? "வளங்களை ஏற்றுவதில் பிழை" : "Error loading resources");
      }
    };

    fetchAllResources();
  }, [isTamil]);

  // Logic to filter content based on the 3 tabs
  const getFilteredResources = () => {
    switch (activeTab) {
      case "gov":
        // Shows only Government category resources
        return allResources.filter(r => r.category === "Government");
      case "apps":
        // Shows only mobile apps (type: "app")
        return allResources.filter(r => r.type === "app");
      case "websites":
        // Shows websites, helplines, and services (but not apps)
        return allResources.filter(r => 
          (r.type === "website" || r.type === "helpline" || r.type === "service") &&
          r.type !== "app"
        );
      default:
        return allResources;
    }
  };

  const handleLearnMoreClick = (resource) => {
    // Handle both string and object types for all fields
    const getText = (field) => {
      if (!field) return "";
      if (typeof field === "string") return field;
      return isTamil ? (field.ta || field.en) : (field.en || field.ta);
    };

    const displayTitle = getText(resource.title);
    const displayDescription = getText(resource.description);
    const displayBenefits = Array.isArray(resource.benefits) ? resource.benefits : [];
    const displayFeatures = Array.isArray(resource.features) ? resource.features : [];
    const displayServices = Array.isArray(resource.services) ? resource.services : [];
    const displayContact = resource.contact || {};
    
    setModalContent({ 
      title: displayTitle, 
      description: displayDescription,
      benefits: displayBenefits,
      features: displayFeatures,
      services: displayServices,
      contact: displayContact,
      category: resource.category,
      type: resource.type,
      link: resource.link,
      priority: resource.priority,
      tags: resource.tags
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const renderContent = () => {
    if (loading) return <Loader fullScreen />;

    if (error) return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          {isTamil ? "மீண்டும் முயற்சிக்கவும்" : "Try Again"}
        </button>
      </div>
    );

    const resources = getFilteredResources();

    if (resources.length === 0) return (
      <div className="no-resources">
        <p>{isTamil ? "தகவல்கள் எதுவும் இல்லை" : "No resources found in this category"}</p>
      </div>
    );

    return (
      <div className="resources-grid">
        {resources.map((resource) => (
          <WomenResourceCard
            key={resource.id || resource._id}
            resource={resource}
            onLearnMore={(resource) => handleLearnMoreClick(resource)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fir-assistant">
      <div className="fir-main">
        {/* Header Section */}
        <div className="fir-header">
          <div className="fir-header-content">
            <h1 className="fir-title">
              {isTamil ? "பெண்களுக்கான வளங்கள்" : "Women Resources"}
            </h1>
            <p className="fir-subtitle">
              {isTamil ?
                "அரசு திட்டங்கள், பாதுகாப்பு செயலிகள் மற்றும் பயனுள்ள இணையதளங்கள்" :
                "Government schemes, safety apps, and useful websites for women"
              }
            </p>
          </div>
        </div>

        {/* The 3 Tabs */}
        <div className="fir-tabs">
          <div className="tabs-buttons">
            <button
              className={`tab-btn ${activeTab === "gov" ? "active" : ""}`}
              onClick={() => setActiveTab("gov")}
            >
              {isTamil ? "அரசு சலுகைகள்" : "Gov Benefits"}
            </button>
            <button
              className={`tab-btn ${activeTab === "apps" ? "active" : ""}`}
              onClick={() => setActiveTab("apps")}
            >
              {isTamil ? "செயலிகள்" : "Apps"}
            </button>
            <button
              className={`tab-btn ${activeTab === "websites" ? "active" : ""}`}
              onClick={() => setActiveTab("websites")}
            >
              {isTamil ? "இணையதளங்கள்" : "Websites"}
            </button>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="fir-content">
          {renderContent()}
        </div>
      </div>

      {/* Shared Modal */}
      {showModal && (
        <div className="modal-overlay-no-blur" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{modalContent.title}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <p>{modalContent.description}</p>
              
              {/* Benefits Section */}
              {modalContent.benefits && modalContent.benefits.length > 0 && (
                <div className="modal-section">
                  <h4>{isTamil ? "நன்மைகள்" : "Benefits"}</h4>
                  <ul>
                    {modalContent.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Features Section */}
              {modalContent.features && modalContent.features.length > 0 && (
                <div className="modal-section">
                  <h4>{isTamil ? "அம்சங்கள்" : "Features"}</h4>
                  <ul>
                    {modalContent.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Services Section */}
              {modalContent.services && modalContent.services.length > 0 && (
                <div className="modal-section">
                  <h4>{isTamil ? "சேவைகள்" : "Services"}</h4>
                  <ul>
                    {modalContent.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Contact Section */}
              {modalContent.contact && (
                <div className="modal-section">
                  <h4>{isTamil ? "தொடர்பு" : "Contact"}</h4>
                  {modalContent.contact.phone && (
                    <p><strong>{isTamil ? "தொலைபேசி:" : "Phone:"}</strong> {modalContent.contact.phone}</p>
                  )}
                  {modalContent.contact.email && (
                    <p><strong>{isTamil ? "மின்னஞ்சல்:" : "Email:"}</strong> {modalContent.contact.email}</p>
                  )}
                  {modalContent.contact.website && (
                    <p><strong>{isTamil ? "இணையதளம்:" : "Website:"}</strong> {modalContent.contact.website}</p>
                  )}
                </div>
              )}
              
              {/* Additional Info */}
              <div className="modal-info">
                <p><strong>{isTamil ? "வகை:" : "Category:"}</strong> {modalContent.category}</p>
                <p><strong>{isTamil ? "வகைப்பாடு:" : "Type:"}</strong> {modalContent.type}</p>
                {modalContent.link && (
                  <p><strong>{isTamil ? "இணைப்பு:" : "Link:"}</strong> <a href={modalContent.link} target="_blank" rel="noopener noreferrer">{modalContent.link}</a></p>
                )}
                {modalContent.priority && (
                  <p><strong>{isTamil ? "முன்னுரிமை:" : "Priority:"}</strong> {modalContent.priority}</p>
                )}
                {modalContent.tags && modalContent.tags.length > 0 && (
                  <p><strong>{isTamil ? "குறிச்சொற்கள்:" : "Tags:"}</strong> {modalContent.tags.join(', ')}</p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="ok-btn" onClick={closeModal}>
                {isTamil ? "சரி" : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WomenResources;
