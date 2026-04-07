/**
 * validators.js
 * File validation helpers used before conversion begins.
 * No hard size limit — any size file is accepted.
 */

import { LARGE_FILE_WARN_MB, HUGE_FILE_WARN_MB } from "../constants/conversions";

const WARN_BYTES  = LARGE_FILE_WARN_MB * 1024 * 1024;
const HUGE_BYTES  = HUGE_FILE_WARN_MB  * 1024 * 1024;

/**
 * Validates a File object. No upper size limit — just warns for large files.
 * @param {File} file
 * @returns {{ valid: boolean, warning: string|null, error: string|null }}
 */
export function validateFile(file) {
  if (!file) return { valid: false, warning: null, error: "No file provided." };

  if (file.size === 0) {
    return { valid: false, warning: null, error: "The file is empty." };
  }

  if (file.size > HUGE_BYTES) {
    return {
      valid: true,
      warning: `Very large file (>${HUGE_FILE_WARN_MB} MB) — this may take a while. Please wait…`,
      error: null,
    };
  }

  if (file.size > WARN_BYTES) {
    return {
      valid: true,
      warning: `Large file (>${LARGE_FILE_WARN_MB} MB) — conversion may take a moment.`,
      error: null,
    };
  }

  return { valid: true, warning: null, error: null };
}

/**
 * Checks that a file's extension matches one of the accepted extensions.
 * @param {File} file
 * @param {string} acceptStr  e.g. ".json" or ".xlsx,.xls"
 * @returns {boolean}
 */
export function isAcceptedType(file, acceptStr) {
  if (!file || !acceptStr) return false;
  const ext = "." + file.name.split(".").pop().toLowerCase();
  return acceptStr
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .includes(ext);
}
