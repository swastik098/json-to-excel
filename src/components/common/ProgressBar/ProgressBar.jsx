/**
 * ProgressBar.jsx
 * Animated progress bar with percentage label and phase text.
 * Renders nothing when progress is null.
 */

import React from "react";
import "./ProgressBar.css";

/**
 * @param {number|null} progress  0–100, or null to hide
 * @param {string}      phase     Description of current phase
 */
export function ProgressBar({ progress, phase }) {
  if (progress === null || progress === undefined) return null;

  const pct = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="progress-wrapper anim-slide-up" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-meta">
        <span className="progress-phase">{phase || "Processing…"}</span>
        <span className="progress-pct">{pct}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
