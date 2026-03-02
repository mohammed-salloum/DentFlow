import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

/* -----------------------------
   Global Styles & Dependencies
----------------------------- */
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS framework
import "./styles/theme.css";                // Theme-related CSS variables
import "./index.css";                       // Base app styles

/* -----------------------------
   Context Providers
----------------------------- */
import { LanguageProvider } from "./context/LanguageContext"; // Handles app language
import { FontProvider } from "./context/FontContext";         // Handles global font size & family
import { ThemeProvider } from "./context/ThemeContext";       // Handles light/dark theme

/* -----------------------------
   i18n Initialization
----------------------------- */
import "./i18n/i18n"; // Initializes i18next with translations

/* -----------------------------
   Create React Root and Render App
----------------------------- */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Wrap App with all global context providers */}
    <LanguageProvider>
      <FontProvider>
        <ThemeProvider>
          <App />  {/* Main app component */}
        </ThemeProvider>
      </FontProvider>
    </LanguageProvider>
  </StrictMode>
);