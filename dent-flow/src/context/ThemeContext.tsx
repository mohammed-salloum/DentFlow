import React, { createContext, useState, useEffect } from "react";

/* -----------------------------
   Theme Names
----------------------------- */
export type ThemeName = "light" | "dark";

/* -----------------------------
   Context Type Definition
----------------------------- */
interface ThemeContextProps {
  theme: ThemeName;                   // Current theme
  setTheme: (t: ThemeName) => void;   // Function to update theme
  themes: ThemeName[];                // List of available themes
}

/* -----------------------------
   ThemeContext with default values
   Used when no provider is present
----------------------------- */
export const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  setTheme: () => {},
  themes: ["light", "dark"],
});

/* -----------------------------
   ThemeProvider Component
   Wraps the app and manages global theme state
----------------------------- */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

  /* -----------------------------
     Initialize theme from localStorage
     Default to 'light' if no saved theme
  ----------------------------- */
  const [theme, setTheme] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  /* -----------------------------
     Side Effect: Update body attribute
     and persist theme to localStorage whenever it changes
  ----------------------------- */
  useEffect(() => {
    document.body.setAttribute("data-theme", theme); // For CSS theming
    localStorage.setItem("theme", theme);           // Persist theme across sessions
  }, [theme]);

  /* -----------------------------
     Provide theme context values to all children
  ----------------------------- */
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themes: ["light", "dark"], // Available themes
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};