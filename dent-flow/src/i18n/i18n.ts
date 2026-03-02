import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./en/translation.json";
import translationAR from "./ar/translation.json";

/* -----------------------------
   i18n Initialization
   Sets up translations for English and Arabic
----------------------------- */
i18n
  .use(initReactI18next) // Passes i18n instance to React
  .init({
    resources: {
      en: { translation: translationEN }, // English translations
      ar: { translation: translationAR }, // Arabic translations
    },

    fallbackLng: "en", // Default language if key is missing

    // Note: Do NOT set `lng` here. Language is managed by LanguageHandler / LanguageContext

    interpolation: {
      escapeValue: false, // React already escapes values, prevents double-escaping
    },

    react: {
      useSuspense: false, // Recommended for SPA to avoid fallback component
    },
  });

export default i18n;