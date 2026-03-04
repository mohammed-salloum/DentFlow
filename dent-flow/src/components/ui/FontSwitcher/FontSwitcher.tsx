import { useContext } from "react";
import type { FC } from "react";
import { FontContext } from "../../../context/FontContext";
import { MdTextIncrease, MdTextDecrease, MdRestartAlt } from "react-icons/md";
import { useTranslation } from "react-i18next";
import "./FontSwitcher.css";

/* -----------------------------
   Configuration
   MAX_OFFSET: Maximum allowed deviation from default font size
   DELTA: Step size (in pixels) for each increment/decrement
----------------------------- */
const MAX_OFFSET = 1;
const DELTA = 0.5;

/* -----------------------------
   Props for FontSwitcher
   defaultSize: optional fallback font size if context not initialized
----------------------------- */
interface FontSwitcherProps {
  defaultSize?: number; // Default font size in pixels
}

/* -----------------------------
   FontSwitcher Component
   Provides a UI for increasing, decreasing, or resetting font size.
   Uses professional icons and i18n-enabled tooltips.
----------------------------- */
const FontSwitcher: FC<FontSwitcherProps> = ({ defaultSize }) => {
  const { t } = useTranslation();               // i18n translation hook
  const { fontSize, setFontSize } = useContext(FontContext); // Global font state

  // Determine the effective default font size
  const effectiveDefault = defaultSize ?? 16;

  /* -----------------------------
     handleSizeClick
     Updates font size based on action type: increase, decrease, reset
  ----------------------------- */
  const handleSizeClick = (type: "increase" | "decrease" | "reset") => {
    let newSize = fontSize;

    if (type === "reset") {
      newSize = effectiveDefault;
    }

    if (type === "increase" && fontSize < effectiveDefault + MAX_OFFSET) {
      newSize = parseFloat((fontSize + DELTA).toFixed(2));
    }

    if (type === "decrease" && fontSize > effectiveDefault - MAX_OFFSET) {
      newSize = parseFloat((fontSize - DELTA).toFixed(2));
    }

    setFontSize(newSize); // Update context (and CSS variable)
  };

  return (
    <div className="fonts-container">
      {/* Increase font size button */}
      <button
        className="font-btn"
        onClick={() => handleSizeClick("increase")}
        type="button"
        title={t("settings.increaseFont") /* i18n tooltip */}
      >
        <MdTextIncrease size={20} />
      </button>

      {/* Reset font size to default button */}
      <button
        className="font-btn"
        onClick={() => handleSizeClick("reset")}
        type="button"
        title={t("settings.resetFont")}
      >
        <MdRestartAlt size={20} />
      </button>

      {/* Decrease font size button */}
      <button
        className="font-btn"
        onClick={() => handleSizeClick("decrease")}
        type="button"
        title={t("settings.decreaseFont")}
      >
        <MdTextDecrease size={20} />
      </button>
    </div>
  );
};

export default FontSwitcher;
