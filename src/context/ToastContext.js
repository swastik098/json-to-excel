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
      duration
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
  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}`}
          role="alert"
          onClick={() => onRemove(t.id)}
          title="Click to dismiss"
        >
          <span className="toast-icon" aria-hidden="true">
            {ICONS[t.type] ?? "ℹ"}
          </span>
          <span className="toast-message">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
