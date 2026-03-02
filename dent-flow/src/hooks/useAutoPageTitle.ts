import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/* -----------------------------
   useAutoPageTitle Hook
   Automatically sets the document.title based on current language
----------------------------- */
export default function useAutoPageTitle({
  baseTitle = "DentFlow", // Default title if translation not found
  skip = false,           // Skip updating title when true
}) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (skip) return; // Exit early if skipping title update

    // Set document title using i18n translation
    // Fallback to baseTitle if translation key is missing
    document.title = t("titles.dashboard", {
      defaultValue: baseTitle,
    });
  }, [i18n.language, t, baseTitle, skip]); // Re-run effect on language or baseTitle change
}