/**
 * App.js
 * Root component — wires providers, state, and layout together.
 * Business logic lives in hooks; UI lives in components.
 */

import React, { useState, useCallback, useRef } from "react";

// ── Providers & Context ──────────────────────────────────────────────────────
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";

// ── Layout ───────────────────────────────────────────────────────────────────
import { Header } from "./components/layout/Header/Header";
import { Footer } from "./components/layout/Footer/Footer";
import { AnimatedBackground } from "./components/layout/AnimatedBackground/AnimatedBackground";

// ── Sections ─────────────────────────────────────────────────────────────────
import { Hero } from "./components/sections/Hero/Hero";
import { Features } from "./components/sections/Features/Features";
import { History } from "./components/sections/History/History";

// ── Converter ────────────────────────────────────────────────────────────────
import { FormatSelector } from "./components/converter/FormatSelector/FormatSelector";
import { ConverterPanel } from "./components/converter/ConverterPanel/ConverterPanel";

// ── Constants ────────────────────────────────────────────────────────────────
import { CONVERSIONS } from "./constants/conversions";

// ── Styles ───────────────────────────────────────────────────────────────────
import "./App.css";

// ─────────────────────────────────────────────────────────────────────────────

function AppContent() {
  const [activeConversion, setActiveConversion] = useState(CONVERSIONS[0]);
  const [history, setHistory] = useState([]);
  const [totalConversions, setTotalConversions] = useState(0);

  // Optional: Track if we should show the animated counter
  const [shouldAnimate, setShouldAnimate] = useState(false);

  /**
   * Called by ConverterPanel (via useConverter) after a successful conversion.
   * We lift state here so History and StatsBar stay in sync.
   */
  const handleConversionComplete = useCallback((entry) => {
    setHistory((prev) => [entry, ...prev.slice(0, 9)]);
    setTotalConversions((n) => {
      const newTotal = n + 1;
      // Trigger animation on every increment
      setShouldAnimate(true);
      // Reset animation flag after a short delay
      setTimeout(() => setShouldAnimate(false), 800);
      return newTotal;
    });
  }, []);

  const handleFormatChange = useCallback((conv) => {
    setActiveConversion(conv);
  }, []);

  return (
    <div className="app">
      {/* Full-page animated aurora background */}
      <AnimatedBackground />

      <Header />

      <Hero totalConversions={totalConversions} shouldAnimate={shouldAnimate} />

      <main className="page-content" id="main-content">
        {/* Format type picker */}
        <FormatSelector
          active={activeConversion}
          onChange={handleFormatChange}
        />

        {/* Conversion engine panel */}
        <ConverterPanel
          key={
            activeConversion.id
          } /* remount on format change to reset state */
          conversion={activeConversion}
          onComplete={handleConversionComplete}
        />

        {/* Informational sections */}
        <Features />

        {/* Conversion history (visible only after first conversion) */}
        <History items={history} />
      </main>

      <Footer />
    </div>
  );
}

// ── Root export (wraps with Providers) ───────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
