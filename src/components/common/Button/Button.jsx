/**
 * Button.jsx
 * Reusable button component with variant, size, loading, and icon support.
 */

import React from "react";
import "./Button.css";

/**
 * @param {"primary"|"secondary"|"success"|"ghost"} variant
 * @param {"sm"|"md"|"lg"} size
 * @param {boolean} loading
 * @param {boolean} disabled
 * @param {string}  style    Inline style override (e.g. for custom bg color)
 * @param {string}  icon     Emoji / character rendered before children
 * @param {string}  className
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  className = "",
  style,
  onClick,
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${loading ? "btn-loading" : ""} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      {...rest}
    >
      {loading ? (
        <>
          <span className="btn-spinner" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="btn-icon" aria-hidden="true">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
