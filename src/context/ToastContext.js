/**
 * ToastContext.js
 * Provides a global toast notification system via React Context.
 * Wrap your app in <ToastProvider> and call useToast() anywhere.
 */

import React, { createContext, useState, useCallback } from "react";

export const ToastContext = createContext(null);

let idCounter = 0;

/**
 * ToastProvider — mounts the toast container and exposes addToast().
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      duration,
    );
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <ToastPortal toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// ─── Toast Portal (internal) ──────────────────────────────────────────────────
const ICONS = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };

function ToastPortal({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRemove(id);
    }
  };

  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map((t) => (
        <button
          key={t.id}
          className={`toast toast-${t.type}`}
          onClick={() => onRemove(t.id)}
          onKeyDown={(e) => handleKeyDown(e, t.id)}
          title="Click or press Enter/Space to dismiss"
          style={{
            width: "100%",
            border: "none",
            textAlign: "left",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
          aria-live="polite"
        >
          <span className="toast-icon" aria-hidden="true">
            {ICONS[t.type] || ICONS.info}
          </span>
          <span className="toast-message">{t.message}</span>
        </button>
      ))}
    </div>
  );
}
