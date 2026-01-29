import React from "react";
import { useTranslation } from "react-i18next";
import "../../styles/about.css";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      {/* ===== 1. FULL SCREEN BANNER (NO GAPS) ===== */}
      <section
        className="banner-section-full"
        style={{ backgroundImage: `url("/assets/images/about-banner.jpg")` }}
      >
        <div className="banner-overlay">
          <div className="banner-content">
            <h1 className="white-text-bold">{t("aboutTitle")}</h1>
            <p className="white-text-sub">{t("aboutDescription")}</p>
          </div>
        </div>
      </section>

      {/* ===== 2. MISSION SECTION (IMAGE & CONTENT SEPARATE) ===== */}
      <div className="section-container bg-white">
        <div className="split-layout">
          <div className="image-container">
            <img src="/assets/images/mission.jpg" alt="Mission" />
          </div>
          <div className="content-container">
            <h2 className="section-heading">{t("ourMission")}</h2>
            <p className="section-text">{t("missionDescription")}</p>
          </div>
        </div>
      </div>

      {/* ===== 3. VISION SECTION (REVERSED) ===== */}
      <div className="section-container bg-light">
        <div className="split-layout reverse">
          <div className="image-container">
            <img src="/assets/images/vision.jpg" alt="Vision" />
          </div>
          <div className="content-container">
            <h2 className="section-heading">{t("ourVision")}</h2>
            <p className="section-text">{t("visionDescription")}</p>
          </div>
        </div>
      </div>

      {/* ===== 4. SERVICES GRID ===== */}
      <div className="section-container bg-white">
        <h2 className="grid-main-title">{t("ourServices")}</h2>
        <div className="services-grid-wrapper">
          <div className="service-card">
            <img src="/assets/images/service1.jpg" alt="Legal" />
            <div className="service-info">
              <h3>{t("legalAssistance")}</h3>
              <p>{t("legalAssistanceDesc")}</p>
            </div>
          </div>
          <div className="service-card">
            <img src="/assets/images/service2.jpg" alt="Schemes" />
            <div className="service-info">
              <h3>{t("governmentSchemesAbout")}</h3>
              <p>{t("governmentSchemesDesc")}</p>
            </div>
          </div>
          <div className="service-card">
            <img src="/assets/images/service3.jpg" alt="Awareness" />
            <div className="service-info">
              <h3>{t("awarenessEducation")}</h3>
              <p>{t("awarenessEducationDesc")}</p>
            </div>
          </div>
          <div className="service-card">
            <img src="/assets/images/service4.jpg" alt="Support" />
            <div className="service-info">
              <h3>{t("communitySupport")}</h3>
              <p>{t("communitySupportDesc")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 5. TEAM SECTION ===== */}
      <div className="section-container bg-light">
        <div className="split-layout">
          <div className="image-container">
            <img src="/assets/images/our_team.jpg" alt="Team" />
          </div>
          <div className="content-container">
            <h2 className="section-heading">{t("ourTeam")}</h2>
            <p className="section-text">{t("teamDescription")}</p>
          </div>
        </div>
      </div>

      {/* ===== 6. IMPACT SECTION ===== */}
      <div className="section-container bg-white">
        <div className="split-layout reverse">
          <div className="image-container">
            <img src="/assets/images/our_impact.jpg" alt="Impact" />
          </div>
          <div className="content-container">
            <h2 className="section-heading">{t("ourImpact")}</h2>
            <p className="section-text">{t("impactDescription")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;