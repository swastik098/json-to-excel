/**
 * Hero.jsx
 * Full-width hero section — animated gradient background, glowing badge,
 * animated headline, and live stats bar.
 */

import React from "react";
import { StatsBar } from "../StatsBar/StatsBar";
import "./Hero.css";

const FORMAT_BADGES = ["JSON", "Excel", "CSV", "XML"];

export function Hero({ totalConversions, shouldAnimate = false }) {
  return (
    <section className="hero" aria-label="Hero banner">
      {/* Decorative animated background layers */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__bg-orb hero__bg-orb--a" />
        <div className="hero__bg-orb hero__bg-orb--b" />
        <div className="hero__bg-orb hero__bg-orb--c" />
        <div className="hero__grid-lines" />
      </div>

      <div className="hero__inner">
        {/* Creator badge */}
        <div className="hero__creator-badge">
          <span className="hero__creator-dot" aria-hidden="true" />
          <span>Built by</span>
          <span className="hero__creator-name">Swastik</span>
        </div>

        {/* Glowing format badge */}
        <div className="hero__badge" aria-label="Supported formats">
          <span className="hero__badge-dot" aria-hidden="true" />
          <span>Supports</span>
          {FORMAT_BADGES.map((f, i) => (
            <span key={f} className="hero__badge-format">
              {f}
              {i < FORMAT_BADGES.length - 1 && (
                <span className="hero__badge-sep" aria-hidden="true">
                  ·
                </span>
              )}
            </span>
          ))}
        </div>

        {/* Animated headline */}
        <h1 className="hero__title">
          <span className="hero__title-line">Forge Your</span>
          <br />
          <span className="hero__title-gradient">Data</span>{" "}
          <span className="hero__title-gradient2">Instantly</span>
        </h1>

        <p className="hero__sub">
          Transform JSON, Excel, CSV &amp; XML files in seconds —{" "}
          <strong>entirely in your browser.</strong> No uploads. No servers.
          Zero compromise.
        </p>

        {/* CTA arrow hint */}
        <div className="hero__cta-hint" aria-hidden="true">
          <span>Choose a format below to start forging</span>
          <span className="hero__cta-arrow">↓</span>
        </div>

        <StatsBar
          totalConversions={totalConversions}
          shouldAnimate={shouldAnimate}
        />
      </div>
    </section>
  );
}
