/**
 * DataPreview.jsx
 * Renders the first N rows of a JSON array as a responsive table.
 */

import React from "react";
import { PREVIEW_MAX_ROWS } from "../../../constants/conversions";
import { truncate } from "../../../utils/formatters";
import "./DataPreview.css";

/**
 * @param {object[]}  data     Array of row objects
 * @param {number}    maxRows  Max rows to display (default from constants)
 */
export function DataPreview({ data, maxRows = PREVIEW_MAX_ROWS }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const headers = Object.keys(data[0] || {});
  const rows = data.slice(0, maxRows);
  const remaining = data.length - maxRows;

  return (
    <div className="data-preview anim-slide-up">
      <div className="data-preview__header">
        <span className="data-preview__label">
          📋 Preview
        </span>
        <span className="data-preview__meta">
          {data.length.toLocaleString()} rows · {headers.length} columns
        </span>
      </div>

      <div className="data-preview__scroll" role="region" aria-label="Data preview table">
        <table className="data-preview__table">
          <thead>
            <tr>
              <th className="data-preview__th data-preview__rownum" scope="col">#</th>
              {headers.map((h) => (
                <th key={h} className="data-preview__th" scope="col" title={h}>
                  {truncate(h, 30)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="data-preview__row">
                <td className="data-preview__td data-preview__rownum">{i + 1}</td>
                {headers.map((h) => (
                  <td key={h} className="data-preview__td" title={String(row[h] ?? "")}>
                    {truncate(String(row[h] ?? ""), 48)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {remaining > 0 && (
        <p className="data-preview__more">
          …and {remaining.toLocaleString()} more rows not shown
        </p>
      )}
    </div>
  );
}
