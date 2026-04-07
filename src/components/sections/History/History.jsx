/**
 * History.jsx
 * Shows a list of recent conversion operations with status badges.
 */

import React from "react";
import "./History.css";

/**
 * @param {{ fileName, from, to, time, status, icon }[]} items
 */
export function History({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="history" aria-label="Recent conversions">
      <h2 className="history__heading">Recent Conversions</h2>
      <ul className="history__list" role="list">
        {items.map((item, i) => (
          <li key={i} className="history-item">
            <span className="history-item__icon" aria-hidden="true">{item.icon}</span>
            <div className="history-item__info">
              <span className="history-item__name truncate">{item.fileName}</span>
              <span className="history-item__meta">
                {item.from} → {item.to} · {item.time}
              </span>
            </div>
            <span
              className={`history-item__badge history-item__badge--${item.status}`}
              aria-label={`Status: ${item.status}`}
            >
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
