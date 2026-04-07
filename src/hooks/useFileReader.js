/**
 * useFileReader.js
 * Custom hook for reading files with progress tracking.
 * Returns a readFile() function that resolves with the file contents.
 */

import { useCallback } from "react";

/**
 * @param {function} onProgress  Called with 0-100 progress values
 * @returns {{ readAsText, readAsArrayBuffer }}
 */
export function useFileReader(onProgress) {
  const readAsText = useCallback(
    (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error("Failed to read file as text."));

        reader.readAsText(file);
      }),
    [onProgress]
  );

  const readAsArrayBuffer = useCallback(
    (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onprogress = (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () =>
          reject(new Error("Failed to read file as binary."));

        reader.readAsArrayBuffer(file);
      }),
    [onProgress]
  );

  return { readAsText, readAsArrayBuffer };
}
