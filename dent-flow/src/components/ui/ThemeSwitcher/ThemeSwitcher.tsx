import { useContext } from "react";
import type { FC, ComponentType } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import type { ThemeName } from "../../../context/ThemeContext";

import { FaSun, FaMoon } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./ThemeSwitcher.css";

export interface ThemeSwitcherProps {
  displayInline?: boolean; // Render buttons inline if true
  showNames?: boolean;     // Show theme names next to icons
}

// Map each theme to its corresponding icon component
const iconMap: Record<ThemeName, ComponentType<{ className?: string }>> = {
  light: FaSun,
  dark: FaMoon,
};

const ThemeSwitcher: FC<ThemeSwitcherProps> = ({
  displayInline = false,
  showNames = true,
}) => {
  const { theme, setTheme, themes } = useContext(ThemeContext); // Access current theme and setter
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // Adjust layout for RTL languages

  // Compute container CSS classes dynamically
  const containerClass = `theme-container ${displayInline ? "inline" : ""} ${
    isRTL ? "rtl" : ""
  }`;

  return (
    <div className={containerClass}>
      {themes.map((th) => {
        const Icon = iconMap[th]; // Get icon for each theme
        return (
          <button
            key={th}
            type="button"
            className={`theme-btn theme-${th} ${theme === th ? "active" : ""}`} // Highlight active theme
            onClick={() => setTheme(th)} // Switch theme on click
            aria-pressed={theme === th}  // Accessibility for toggle state
            title={t ? t(`themes.${th}`) : th} // Tooltip with localized name
          >
            <Icon className="theme-icon" />
            {showNames && (
              <span className="theme-name">
                {t ? t(`themes.${th}`) : th} {/* Display theme name if enabled */}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;