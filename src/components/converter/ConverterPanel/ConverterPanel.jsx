/**
 * ConverterPanel.jsx
 * The main conversion widget: drop zone + progress + action buttons + previews.
 * Supports unlimited file sizes with a full-screen loader overlay.
 */

import React, { useState, useCallback } from "react";
import { DropZone } from "../DropZone/DropZone";
import { ProgressBar } from "../../common/ProgressBar/ProgressBar";
import { Button } from "../../common/Button/Button";
import { DataPreview } from "../DataPreview/DataPreview";
import { TextPreview } from "../TextPreview/TextPreview";
import { useConverter } from "../../../hooks/useConverter";
import { formatBytes } from "../../../utils/formatters";
import { LARGE_FILE_WARN_MB } from "../../../constants/conversions";
import "./ConverterPanel.css";

/**
 * @param {object}   conversion  Active conversion object from CONVERSIONS
 * @param {function} onComplete  Called with a history entry on success
 */
export function ConverterPanel({ conversion, onComplete }) {
  const [file, setFile] = useState(null);

  const {
    progress,
    progressPhase,
    previewData,
    textOutput,
    outputBlob,
    converting,
    convert,
    autoPreview,
    resetOutput,
  } = useConverter();

  const handleFileChange = useCallback(
    async (newFile) => {
      setFile(newFile);
      resetOutput();
      if (newFile) {
        await autoPreview(newFile, conversion);
      }
    },
    [conversion, autoPreview, resetOutput]
  );

  const handleConvert = useCallback(async () => {
    if (!file) return;
    const result = await convert(file, conversion);
    if (result?.success && onComplete) {
      onComplete({
        fileName: file.name,
        from: conversion.from,
        to: conversion.to,
        icon: conversion.icon,
        time: new Date().toLocaleTimeString(),
        status: "success",
      });
    }
  }, [file, conversion, convert, onComplete]);

  const handleDownload = useCallback(() => {
    if (!outputBlob) return;
    const url = URL.createObjectURL(outputBlob.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = outputBlob.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [outputBlob]);

  const isLargeFile = file && file.size > LARGE_FILE_WARN_MB * 1024 * 1024;
  const fileSizeMB  = file ? (file.size / (1024 * 1024)).toFixed(1) : 0;

  return (
    <section className="converter-panel" aria-label="File converter">

      {/* ── Full-screen conversion loader overlay ────────────────────────── */}
      {converting && (
        <div className="converter-loader-overlay" role="status" aria-live="polite">
          <div className="converter-loader__card">
            {/* Animated ring */}
            <div className="converter-loader__ring">
              <div className="converter-loader__ring-inner" />
              <div className="converter-loader__ring-pulse" />
              <span className="converter-loader__ring-icon" aria-hidden="true">
                {conversion.icon}
              </span>
            </div>

            {/* Phase label */}
            <p className="converter-loader__phase">
              {progressPhase || "Processing…"}
            </p>

            {/* Progress bar inside overlay */}
            {progress !== null && (
              <>
                <div className="converter-loader__track">
                  <div
                    className="converter-loader__fill"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <span className="converter-loader__pct">
                  {Math.round(Math.min(progress, 100))}%
                </span>
              </>
            )}

            {/* File info */}
            {file && (
              <p className="converter-loader__file">
                {file.name}
                {isLargeFile && (
                  <span className="converter-loader__size"> · {fileSizeMB} MB</span>
                )}
              </p>
            )}

            <p className="converter-loader__note">
              Your file stays in your browser — nothing is uploaded.
            </p>
          </div>
        </div>
      )}

      {/* Panel heading */}
      <div className="converter-panel__header">
        <span className="converter-panel__icon" aria-hidden="true">
          {conversion.icon}
        </span>
        <h2 className="converter-panel__title">
          {conversion.from} → {conversion.to} Converter
        </h2>
      </div>

      {/* Drop zone */}
      <DropZone
        accept={conversion.fromExt}
        file={file}
        onFile={handleFileChange}
      />

      {/* File metadata chip */}
      {file && (
        <div className="converter-panel__file-chip">
          <span>📁 {file.name}</span>
          <span className="chip-sep">·</span>
          <span>{formatBytes(file.size)}</span>
          {isLargeFile && (
            <span className="chip-badge chip-badge--warn">⚡ Large file</span>
          )}
        </div>
      )}

      {/* Progress (shown outside overlay too for non-converting phases) */}
      {!converting && <ProgressBar progress={progress} phase={progressPhase} />}

      {/* Convert button */}
      <Button
        variant="primary"
        size="lg"
        className="btn-block"
        style={{ background: conversion.color }}
        icon={conversion.icon}
        loading={converting}
        disabled={!file || converting}
        onClick={handleConvert}
        aria-label={`Convert ${conversion.from} to ${conversion.to}`}
      >
        {converting ? "Converting…" : `Convert ${conversion.from} → ${conversion.to}`}
      </Button>

      {/* Download button */}
      {outputBlob && !converting && (
        <Button
          variant="success"
          size="lg"
          className="btn-block anim-scale-pop"
          icon="⬇"
          onClick={handleDownload}
        >
          Download {outputBlob.filename}
        </Button>
      )}

      {/* Data preview table */}
      <DataPreview data={previewData} />

      {/* Text output preview */}
      {textOutput && (
        <TextPreview
          text={textOutput}
          label={`Output Preview (${conversion.to})`}
        />
      )}
    </section>
  );
}
