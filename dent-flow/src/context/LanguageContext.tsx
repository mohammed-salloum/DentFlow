import React, { createContext, useState } from "react";
import i18n from "../i18n/i18n";

/* -----------------------------
   Supported Languages
----------------------------- */
type Lang = "ar" | "en";

/* -----------------------------
   Context Type Definition
----------------------------- */
interface LanguageContextType {
  language: Lang;                 // Current app language
  changeLanguage: (lang: Lang) => void; // Function to switch language
}

/* -----------------------------
   Language Context with default values
   Used when no provider is present
----------------------------- */
export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  changeLanguage: () => {},
});

/* -----------------------------
   Detect language based on domain
   Fallback for first-time users if no language saved
----------------------------- */
function detectLanguageFromDomain(): Lang {
  try {
    const hostname = window.location.hostname.toLowerCase();

    const domainLangMap: Record<string, Lang> = {
      "ae.web.app": "ar",
      "us.web.app": "en",
    };

    for (const key in domainLangMap) {
      if (hostname.includes(key)) return domainLangMap[key];
    }

    return "en"; // Default fallback
  } catch {
    return "en"; // Default fallback in case of errors
  }
}

/* -----------------------------
   LanguageProvider Component
   Wraps the app to provide language state globally
----------------------------- */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize language from localStorage or domain detection
  const [language, setLanguage] = useState<Lang>(() => {
    return (
      (localStorage.getItem("app-language") as Lang) ||
      detectLanguageFromDomain()
    );
  });

  /* -----------------------------
     Switch language handler
     Updates state, localStorage, and i18n instance
  ----------------------------- */
  const changeLanguage = (lang: Lang) => {
    setLanguage(lang);
    localStorage.setItem("app-language", lang);
    i18n.changeLanguage(lang);
  };

  /* -----------------------------
     Provide context values to all children
  ----------------------------- */
  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}