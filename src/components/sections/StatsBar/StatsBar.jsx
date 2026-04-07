/**
 * StatsBar.jsx
 * Displays headline stats (conversions, formats, size, price).
 */

import React from "react";
import "./StatsBar.css";

export function StatsBar({ totalConversions }) {
  const stats = [
    { value: totalConversions || 0, label: "Conversions" },
    { value: 8, label: "Formats" },
    { value: "unlimited", label: "File Size" },
    { value: "100%", label: "Free" },
  ];

  return (
    <ul className="stats-bar" aria-label="Key statistics">
      {stats.map(({ value, label }) => (
        <li key={label} className="stat-card">
          <span className="stat-card__value">{value}</span>
          <span className="stat-card__label">{label}</span>
        </li>
      ))}
    </ul>
  );
}
