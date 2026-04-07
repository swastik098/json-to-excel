/**
 * TextPreview.jsx
 * Displays text-based output (JSON / CSV / XML) with a copy button.
 */

import React, { useState } from "react";
import "./TextPreview.css";

/**
 * @param {string} text   The text content to display
 * @param {string} label  Label shown in the header
 */
export function TextPreview({ text, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="text-preview anim-slide-up">
      <div className="text-preview__header">
        <span className="text-preview__label">{label}</span>
        <button
          className={`text-preview__copy ${copied ? "text-preview__copy--done" : ""}`}
          onClick={handleCopy}
          aria-label={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? "✓ Copied!" : "📋 Copy"}
        </button>
      </div>
      <textarea
        className="text-preview__area"
        readOnly
        value={text}
        spellCheck={false}
        aria-label="Output preview"
      />
    </div>
  );
}
