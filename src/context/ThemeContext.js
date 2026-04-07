/**
 * ThemeContext.js
 * Manages dark/light theme state globally.
 * Persists preference to localStorage.
 */

import React, { createContext, useState, useEffect, useCallback } from "react";

export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

const STORAGE_KEY = "dataforge-theme";

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) return saved === "dark";
    } catch (_) {}
    // Respect OS preference as default
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });

  // Apply class to <body>
  useEffect(() => {
    document.body.className = isDark ? "dark" : "light";
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    } catch (_) {}
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
