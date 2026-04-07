/**
 * FormatSelector.jsx
 * Grid of conversion-type cards. Highlights the active selection.
 */

import React from "react";
import { CONVERSIONS } from "../../../constants/conversions";
import "./FormatSelector.css";

/**
 * @param {object}   active       Currently selected conversion object
 * @param {function} onChange     Called with the new conversion object
 */
export function FormatSelector({ active, onChange }) {
  return (
    <section className="format-selector" aria-label="Conversion type selector">
      <h2 className="format-selector__heading">Choose Conversion Type</h2>

      <div className="format-selector__grid" role="listbox" aria-label="Conversion formats">
        {CONVERSIONS.map((conv) => {
          const isActive = active?.id === conv.id;
          return (
            <button
              key={conv.id}
              role="option"
              aria-selected={isActive}
              className={`format-card ${isActive ? "format-card--active" : ""}`}
              style={isActive ? { borderColor: conv.color, boxShadow: `0 0 0 3px ${conv.color}28` } : {}}
              onClick={() => onChange(conv)}
              title={conv.description}
            >
              <span className="format-card__icon" aria-hidden="true">{conv.icon}</span>
              <span className="format-card__label">
                <strong>{conv.from}</strong>
                <span className="format-card__arrow" aria-hidden="true">→</span>
                <strong>{conv.to}</strong>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
