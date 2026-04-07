/**
 * DropZone.jsx
 * Accessible drag-and-drop / click-to-upload file input.
 */

import React, { useState, useRef } from "react";
import { formatBytes } from "../../../utils/formatters";
import "./DropZone.css";

/**
 * @param {string}        accept    MIME / extension string, e.g. ".json,.csv"
 * @param {File|null}     file      Currently selected file
 * @param {function}      onFile    Called with File or null
 */
export function DropZone({ accept, file, onFile }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current?.click();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onFile(dropped);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      className={[
        "dropzone",
        dragging ? "dropzone--active" : "",
        file ? "dropzone--filled" : "",
      ].join(" ")}
      role="button"
      tabIndex={0}
      aria-label={file ? `Selected: ${file.name}. Click to change.` : "Click or drag a file here to upload"}
      onClick={openPicker}
      onKeyDown={handleKey}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      {/* Hidden real input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="dropzone__input"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />

      {file ? (
        <div className="dropzone__file">
          <span className="dropzone__file-icon" aria-hidden="true">📁</span>
          <div className="dropzone__file-meta">
            <span className="dropzone__file-name truncate">{file.name}</span>
            <span className="dropzone__file-size">{formatBytes(file.size)}</span>
          </div>
          <button
            className="dropzone__remove"
            onClick={handleRemove}
            aria-label={`Remove ${file.name}`}
            title="Remove file"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="dropzone__empty">
          <span className="dropzone__cloud" aria-hidden="true">☁️</span>
          <p className="dropzone__title">Drag &amp; drop your file here</p>
          <p className="dropzone__sub">
            or <span className="dropzone__link">click to browse</span>
          </p>
          <p className="dropzone__hint">Accepted: {accept}</p>
        </div>
      )}
    </div>
  );
}
