import { FaHeartbeat } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import "./AppBrand.css";

const AppBrand = () => {
  const { t } = useTranslation(); // Translation hook for i18n strings
  const { lang } = useParams(); // Get current language from URL params

  const isRTL = lang === "ar"; // Determine if the layout should be RTL

  return (
    <Link
      to={`/${lang}`} // Navigate to home page with current language
      className="app-brand"
      dir={isRTL ? "rtl" : "ltr"} // Set text direction for accessibility
      aria-label={t("appBrand.title")} // Screen reader label for brand
    >
      <div className="brand-icon">
        <FaHeartbeat size={22} /> {/* Brand logo/icon */}
      </div>

      <div className="brand-text">
        <h2>{t("appBrand.title")}</h2> {/* Brand title */}
        <p>{t("appBrand.subtitle")}</p> {/* Brand subtitle */}
      </div>
    </Link>
  );
};

export default AppBrand;