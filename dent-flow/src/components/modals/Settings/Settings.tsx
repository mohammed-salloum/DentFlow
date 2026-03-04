import React, { useContext, useEffect } from "react";
import ThemeSwitcher from "../../ui/ThemeSwitcher/ThemeSwitcher";
import FontSwitcher from "../../ui/FontSwitcher/FontSwitcher";
import { useTranslation } from "react-i18next";
import { FontContext } from "../../../context/FontContext";
import { FiSettings } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import "./Settings.css";

interface SettingsProps {
  onClose: () => void; // Callback to close the settings modal
}

function Settings({ onClose }: SettingsProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // Determine if current language is Right-to-Left
  const { fontSize } = useContext(FontContext); // Get current font size from context

  // Prevent clicks inside the modal from closing it
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  // Handle modal setup and cleanup
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevTitle = document.title; // Store previous document title to restore later

    // Disable page scrolling when modal is open
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    // Update document title to match current language
    const updateTitle = () => {
      document.title = t("settings.title");
    };
    updateTitle();

    // Listen for language changes to dynamically update the title
    i18n.on("languageChanged", updateTitle);

    return () => {
      // Restore scrolling and previous document title on cleanup
      html.style.overflow = "";
      body.style.overflow = "";
      i18n.off("languageChanged", updateTitle);
      document.title = prevTitle;
    };
  }, [i18n, t]);

  return (
    // Overlay that closes modal when clicked outside
    <div className="settings-modal-overlay" onClick={onClose}>
      <div
        className={`settings-modal ${isRTL ? "rtl" : "ltr"}`}
        style={{ fontSize: `${fontSize}px` }} // Apply dynamic font size
        onClick={stopPropagation} // Prevent overlay click from propagating
      >
        {/* Modal header with title and close button */}
        <div className="settings-header">
          <h3 className="settings-title">
            <FiSettings className="settings-icon" /> {t("settings.title")}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <IoClose className="close-icon" />
          </button>
        </div>

        {/* Modal content sections */}
        <div className="settings-content">
          
          {/* -------- FONT SIZE SECTION -------- */}
          <div className="settings-section">
            <h4>{t("settings.fontSize")}</h4>
            <FontSwitcher defaultSize={16} />
          </div>

          <hr />

          {/* -------- THEMES SECTION -------- */}
          <div className="settings-section">
            <h4>{t("settings.themes")}</h4>
            <ThemeSwitcher displayInline={true} showNames={true} />
          </div>

          <hr />
        </div>
      </div>
    </div>
  );
}

export default Settings;