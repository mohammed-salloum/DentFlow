import { useEffect, useContext } from "react";
import { LanguageContext } from "./context/LanguageContext";
import AppRouter from "./routes/AppRouter";

/* -----------------------------
   App Component
   Main application wrapper
   - Adjusts document direction (LTR/RTL) based on current language
   - Renders the app router
----------------------------- */
export default function App() {
  const { language } = useContext(LanguageContext);

  /* -----------------------------
     Effect: Update HTML direction
     Ensures proper layout for RTL languages (e.g., Arabic)
  ----------------------------- */
  useEffect(() => {
    document.documentElement.setAttribute(
      "dir",
      language === "ar" ? "rtl" : "ltr"
    );
  }, [language]);

  /* -----------------------------
     Render main router
  ----------------------------- */
  return <AppRouter />;
}