/**
 * formatters.js
 * Pure utility functions for formatting display values.
 */

/**
 * Converts a byte count into a human-readable size string.
 * @param {number} bytes
 * @returns {string}  e.g. "1.23 MB"
 */
export function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Returns a human-readable elapsed-time string for a duration in ms.
 * @param {number} ms
 * @returns {string}
 */
export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Truncates a string to maxLen characters, appending ellipsis if cut.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
export function truncate(str, maxLen = 50) {
  if (!str) return "";
  return str.length > maxLen ? str.slice(0, maxLen) + "…" : str;
}

/**
 * Strips file extension from a filename.
 * @param {string} filename
 * @returns {string}
 */
export function stripExtension(filename) {
  return filename.replace(/\.[^.]+$/, "");
}
