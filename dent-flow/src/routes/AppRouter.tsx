import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useAutoPageTitle from "../hooks/useAutoPageTitle";
import LanguageHandler from "./LanguageHandler";
import Dashboard from "../pages/Dashboard/Dashboard";

/**
 * AppRouter
 * Main SPA router that handles:
 * - Language-based routing (/:lang)
 * - Automatic page title updates
 * - Smart fallback for unknown routes
 */
export default function AppRouter() {
  // Get saved language from localStorage or detect browser language
  const savedLang = localStorage.getItem("app_language");
  const browserLang = navigator.language.split("-")[0];

  // Determine initial language for routing fallback
  const initialLang =
    savedLang === "ar" || savedLang === "en"
      ? savedLang
      : browserLang === "ar"
      ? "ar"
      : "en";

  return (
    <BrowserRouter>
      {/* Automatically manage document.title globally */}
      <TitleManager />

      <Routes>
        {/* Language-based routing */}
        <Route path=":lang" element={<LanguageHandler />}>
          {/* Default route under language */}
          <Route index element={<Dashboard />} />
        </Route>

        {/* Fallback: redirect unknown paths to initial language */}
        <Route
          path="*"
          element={<Navigate to={`/${initialLang}`} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * TitleManager
 * Uses a custom hook to update document.title automatically.
 * Placed globally so all routes inherit page title management.
 */
function TitleManager() {
  useAutoPageTitle({});
  return null;
}