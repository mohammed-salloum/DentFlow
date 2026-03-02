import { useContext } from "react";
import type { FC } from "react";
import "./FontSwitcher.css";
import { FontContext } from "../../../context/FontContext";

// ---------- Configuration Constants ----------
const MAX_OFFSET = 1;      // Maximum deviation from the default font size
const DELTA = 0.5;         // Increment/decrement step for font size

interface FontSwitcherProps {
  defaultSize?: number; // Default font size in pixels
}

const FontSwitcher: FC<FontSwitcherProps> = ({ defaultSize = 10 }) => {
  const { fontSize, setFontSize } = useContext(FontContext); // Access font size state and updater from context

  /**
   * Handles font size changes triggered by user actions.
   * @param type - Action type: 'increase', 'decrease', or 'reset'
   */
  const handleSizeClick = (type: "increase" | "decrease" | "reset") => {
    let newSize = fontSize;

    if (type === "reset") newSize = defaultSize;
    if (type === "increase" && fontSize < defaultSize + MAX_OFFSET) {
      newSize += DELTA;
    }
    if (type === "decrease" && fontSize > defaultSize - MAX_OFFSET) {
      newSize -= DELTA;
    }

    // Update context state
    setFontSize(newSize);

    // Update CSS variable for global font size usage
    document.documentElement.style.setProperty(
      "--main-font-size",
      `${newSize}px`
    );
  };

  return (
    // Container for font control buttons
    <div className="fonts-container">
      {/* Increase font size */}
      <button
        className="font-btn"
        onClick={() => handleSizeClick("increase")}
        type="button"
      >
        A+
      </button>

      {/* Reset font size to default */}
      <button
        className="font-btn"
        onClick={() => handleSizeClick("reset")}
        type="button"
      >
        A
      </button>

      {/* Decrease font size */}
      <button
        className="font-btn"
        onClick={() => handleSizeClick("decrease")}
        type="button"
      >
        A-
      </button>
    </div>
  );
};

export default FontSwitcher;