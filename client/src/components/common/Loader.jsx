import React from "react";
import "../../styles/loader.css";

/**
 * Loader Component
 * @param {boolean} fullScreen - shows full screen overlay loader
 * @param {boolean} small - shows small loader (for buttons/cards)
 */
const Loader = ({ fullScreen = false, small = false }) => {
  if (fullScreen) {
    return (
      <div className="loader-overlay">
        <div className={`loader-spinner ${small ? "loader-small" : ""}`} />
      </div>
    );
  }

  return (
    <div className={`loader-spinner ${small ? "loader-small" : ""}`} />
  );
};

export default Loader;
