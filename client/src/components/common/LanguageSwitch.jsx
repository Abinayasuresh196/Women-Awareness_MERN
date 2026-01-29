import React from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSwitch.css";

const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  return (
    <div className="lang-switch">
      <button onClick={() => i18n.changeLanguage("en")}>EN</button>
      <button onClick={() => i18n.changeLanguage("ta")}>தமிழ்</button>
    </div>
  );
};

export default LanguageSwitch;
