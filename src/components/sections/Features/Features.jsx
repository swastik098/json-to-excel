/**
 * Features.jsx
 * "Why DataForge?" feature highlights grid.
 */

import React from "react";
import { FEATURES } from "../../../constants/conversions";
import "./Features.css";

export function Features() {
  return (
    <section className="features" aria-label="Features">
      <h2 className="section-heading">Why DataForge?</h2>
      <ul className="features-grid" role="list">
        {FEATURES.map((f) => (
          <li key={f.title} className="feature-card">
            <span className="feature-card__icon" aria-hidden="true">{f.icon}</span>
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__desc">{f.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
