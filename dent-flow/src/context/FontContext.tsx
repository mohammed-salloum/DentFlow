import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

/* -----------------------------
   Context Type Definition
----------------------------- */
interface FontContextType {
  fontSize: number;                   // Current font size in pixels
  setFontSize: (size: number) => void; // Function to update font size
  fontFamily: string;                 // Current font family
  setFontFamily: (font: string) => void; // Function to update font family
}

/* -----------------------------
   FontContext with default values
   (used when no provider is present)
----------------------------- */
export const FontContext = createContext<FontContextType>({
  fontSize: 10,
  setFontSize: () => {},
  fontFamily: "'Inter', sans-serif",
  setFontFamily: () => {},
});

/* -----------------------------
   Provider Props
----------------------------- */
interface FontProviderProps {
  children: ReactNode; // Components wrapped by the provider
}

/* -----------------------------
   FontProvider Component
   Manages font size and font family globally
----------------------------- */
export const FontProvider = ({ children }: FontProviderProps) => {
  // Load font size from localStorage or use default 10px
  const [fontSize, setFontSize] = useState<number>(() => {
    const savedSize = localStorage.getItem("fontSize");
    return savedSize ? parseInt(savedSize, 10) : 10;
  });

  // Load font family from localStorage or use default 'Inter'
  const [fontFamily, setFontFamily] = useState<string>(() => {
    return localStorage.getItem("fontFamily") || "'Inter', sans-serif";
  });

  /* -----------------------------
     Side Effect: Update CSS variables
     and persist to localStorage whenever
     fontSize or fontFamily changes
  ----------------------------- */
  useEffect(() => {
    // Set global CSS variables for font usage
    document.documentElement.style.setProperty("--main-font-size", `${fontSize}px`);
    document.documentElement.style.setProperty("--main-font", fontFamily);

    // Persist values in localStorage for page reloads
    localStorage.setItem("fontSize", fontSize.toString());
    localStorage.setItem("fontFamily", fontFamily);
  }, [fontSize, fontFamily]);

  /* -----------------------------
     Provide context values to children
  ----------------------------- */
  return (
    <FontContext.Provider
      value={{ fontSize, setFontSize, fontFamily, setFontFamily }}
    >
      {children}
    </FontContext.Provider>
  );
};