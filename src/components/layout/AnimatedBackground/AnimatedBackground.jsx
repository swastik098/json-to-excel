/**
 * AnimatedBackground.jsx
 * Full-page animated aurora/mesh gradient background.
 * Renders fixed behind all content — pure CSS, no JS animation loops.
 */

import React from "react";
import "./AnimatedBackground.css";

export function AnimatedBackground() {
  return (
    <div className="anim-bg" aria-hidden="true">
      {/* Aurora orbs */}
      <div className="anim-bg__orb anim-bg__orb--1" />
      <div className="anim-bg__orb anim-bg__orb--2" />
      <div className="anim-bg__orb anim-bg__orb--3" />
      <div className="anim-bg__orb anim-bg__orb--4" />
      <div className="anim-bg__orb anim-bg__orb--5" />
      <div className="anim-bg__orb anim-bg__orb--6" />

      {/* Floating particles */}
      <div className="anim-bg__particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`particle particle--${i + 1}`} />
        ))}
      </div>

      {/* Dot grid overlay */}
      <div className="anim-bg__grid" />
    </div>
  );
}
