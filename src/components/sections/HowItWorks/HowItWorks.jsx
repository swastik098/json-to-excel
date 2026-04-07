/**
 * HowItWorks.jsx
 * Step-by-step "how to use" section.
 */

import React from "react";
import { HOW_IT_WORKS_STEPS } from "../../../constants/conversions";
import "./HowItWorks.css";

export function HowItWorks() {
  return (
    <section className="how-it-works" aria-label="How it works">
      <h2 className="section-heading">How It Works</h2>
      <ol className="steps-grid" role="list">
        {HOW_IT_WORKS_STEPS.map((step) => (
          <li key={step.num} className="step-card">
            <span className="step-card__num" aria-label={`Step ${step.num}`}>
              {step.num}
            </span>
            <span className="step-card__icon" aria-hidden="true">{step.icon}</span>
            <h3 className="step-card__title">{step.title}</h3>
            <p className="step-card__desc">{step.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
