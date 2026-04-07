/**
 * Header.jsx
 * Sticky top navigation bar with logo and dark/light mode toggle.
 */

import React from "react";
import { useTheme } from "../../../hooks/useTheme";
import "./Header.css";

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-logo-icon" aria-hidden="true">🔷</span>
          <span className="header-logo-text">DataForge</span>
          <span className="header-by-swastik" aria-label="by Swastik">by Swastik</span>
          <span className="header-tagline" aria-hidden="true">Free · Private · Fast</span>
        </div>

        <nav className="header-nav" aria-label="Site navigation">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            <span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>
            <span>{isDark ? "Light" : "Dark"}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
