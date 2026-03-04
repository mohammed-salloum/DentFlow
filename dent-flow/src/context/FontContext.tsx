import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

/* -----------------------------
   Constants
   Default font size and family for the application
----------------------------- */
const DEFAULT_FONT_SIZE = 16; // Base font size in pixels
const DEFAULT_FONT_FAMILY = "'Inter', sans-serif"; // Default LTR font

/* -----------------------------
   Context Type Definition
   Defines the shape of the FontContext object
----------------------------- */
interface FontContextType {
  fontSize: number;                     // Current font size in pixels
  setFontSize: (size: number) => void; // Function to update font size
  fontFamily: string;                   // Current font family
  setFontFamily: (font: string) => void; // Function to update font family
}

/* -----------------------------
   Create FontContext
   Provides global font settings for the app
----------------------------- */
export const FontContext = createContext<FontContextType>({
  fontSize: DEFAULT_FONT_SIZE,
  setFontSize: () => {},       // No-op default function
  fontFamily: DEFAULT_FONT_FAMILY,
  setFontFamily: () => {},     // No-op default function
});

/* -----------------------------
   Provider Props
   Wraps app components to provide font settings
----------------------------- */
interface FontProviderProps {
  children: ReactNode; // Components that will consume the context
}

/* -----------------------------
   FontProvider Component
   Manages global font size and font family
   Ensures proper CSS variable initialization and persistence
----------------------------- */
export const FontProvider = ({ children }: FontProviderProps) => {
  // 🔹 Start with default values for initial render
  const [fontSize, setFontSize] = useState<number>(DEFAULT_FONT_SIZE);
  const [fontFamily, setFontFamily] = useState<string>(DEFAULT_FONT_FAMILY);

  /* -----------------------------
     Initialize CSS variables immediately
     Prevents "flash" of wrong font size or font family on first render
  ----------------------------- */
  useEffect(() => {
    document.documentElement.style.setProperty("--main-font-size", `${DEFAULT_FONT_SIZE}px`);
    document.documentElement.style.setProperty("--main-font", DEFAULT_FONT_FAMILY);
  }, []);

  /* -----------------------------
     Load saved font settings from localStorage
     Runs only once after component mounts
     Validates font size to prevent extreme values
  ----------------------------- */
  useEffect(() => {
    const storedSize = localStorage.getItem("fontSize");
    const storedFont = localStorage.getItem("fontFamily");

    if (storedSize) {
      const parsedSize = parseFloat(storedSize);
      if (!isNaN(parsedSize) && parsedSize > 8 && parsedSize < 24) {
        setFontSize(parsedSize);
        document.documentElement.style.setProperty("--main-font-size", `${parsedSize}px`);
      }
    }

    if (storedFont) {
      setFontFamily(storedFont);
      document.documentElement.style.setProperty("--main-font", storedFont);
    }
  }, []);

  /* -----------------------------
     Sync font state with CSS variables and localStorage
     Runs whenever fontSize or fontFamily changes
  ----------------------------- */
  useEffect(() => {
    document.documentElement.style.setProperty("--main-font-size", `${fontSize}px`);
    document.documentElement.style.setProperty("--main-font", fontFamily);

    // Persist current settings for future visits
    localStorage.setItem("fontSize", fontSize.toString());
    localStorage.setItem("fontFamily", fontFamily);
  }, [fontSize, fontFamily]);

  /* -----------------------------
     Provide context values to children
     Exposes state and setter functions
  ----------------------------- */
  return (
    <FontContext.Provider value={{ fontSize, setFontSize, fontFamily, setFontFamily }}>
      {children}
    </FontContext.Provider>
  );
};
