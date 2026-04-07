/**
 * App.js
 * Root component — wires providers, state, and layout together.
 * Business logic lives in hooks; UI lives in components.
 */

import React, { useState, useCallback } from "react";

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
import { HowItWorks } from "./components/sections/HowItWorks/HowItWorks";

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
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const handleConversionComplete = useCallback((entry) => {
    setHistory((prev) => [entry, ...prev.slice(0, 9)]);
    setTotalConversions((n) => {
      setShouldAnimate(true);
      setTimeout(() => setShouldAnimate(false), 800);
      return n + 1;
    });
  }, []);

  const handleFormatChange = useCallback((conv) => {
    setActiveConversion(conv);
  }, []);

  return (
    <div className="app">
      <AnimatedBackground />
      <Header />
      <Hero totalConversions={totalConversions} shouldAnimate={shouldAnimate} />

      <main className="page-content" id="main-content">
        <FormatSelector active={activeConversion} onChange={handleFormatChange} />

        <ConverterPanel
          key={activeConversion.id}
          conversion={activeConversion}
          onComplete={handleConversionComplete}
        />

        <Features />
        <HowItWorks />

        <History items={history} />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
