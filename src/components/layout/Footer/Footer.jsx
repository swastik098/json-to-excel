/**
 * Footer.jsx
 * Site footer with brand info, supported formats, and copyright.
 */

import React from "react";
import "./Footer.css";

const FORMATS = ["JSON ↔ Excel", "JSON ↔ CSV", "CSV ↔ Excel", "XML ↔ JSON"];

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo-icon" aria-hidden="true">🔷</span>
          <strong className="footer-logo-text">DataForge</strong>
          <span className="footer-by-swastik">by Swastik</span>
        </div>

        <p className="footer-desc">
          Precision data transformation — entirely in your browser. Your files never leave your device.
        </p>

        <ul className="footer-formats" aria-label="Supported formats">
          {FORMATS.map((f, i) => (
            <React.Fragment key={f}>
              <li>{f}</li>
              {i < FORMATS.length - 1 && <li className="footer-sep" aria-hidden="true">·</li>}
            </React.Fragment>
          ))}
        </ul>

        <p className="footer-copy">
          © {new Date().getFullYear()} DataForge &mdash; Crafted with ❤️ by <strong className="footer-author">Swastik</strong>
        </p>
      </div>
    </footer>
  );
}
