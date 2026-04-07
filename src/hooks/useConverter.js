/**
 * useConverter.js
 * Core conversion engine as a React hook.
 * Handles file reading, format conversion, progress tracking,
 * preview generation, and download blob creation.
 */

import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { useToast } from "./useToast";
import { useFileReader } from "./useFileReader";
import { xmlToJson, jsonToXml, csvToJson } from "../utils/converters";
import { stripExtension } from "../utils/formatters";
import { validateFile } from "../utils/validators";
import { TEXT_PREVIEW_LIMIT } from "../constants/conversions";

const TRUNCATE_NOTE = "\n\n… (output truncated for preview — full file in download)";

/**
 * @returns {{
 *   progress: number|null,
 *   progressPhase: string,
 *   previewData: object[]|null,
 *   textOutput: string|null,
 *   outputBlob: { blob: Blob, filename: string }|null,
 *   converting: boolean,
 *   convert: (file: File, conversion: object) => Promise<void>,
 *   autoPreview: (file: File, conversion: object) => Promise<void>,
 *   resetOutput: () => void,
 * }}
 */
export function useConverter() {
  const toast = useToast();

  const [progress, setProgress] = useState(null);
  const [progressPhase, setProgressPhase] = useState("");
  const [previewData, setPreviewData] = useState(null);
  const [textOutput, setTextOutput] = useState(null);
  const [outputBlob, setOutputBlob] = useState(null);
  const [converting, setConverting] = useState(false);

  // File reader wired to upload-phase progress (0–45 %)
  const { readAsText, readAsArrayBuffer } = useFileReader((pct) =>
    setProgress(5 + pct * 0.4)
  );

  // ── Helpers ───────────────────────────────────────────────────────────────

  const phase = (label, pct) => {
    setProgressPhase(label);
    setProgress(pct);
  };

  const truncateText = (str) =>
    str.length > TEXT_PREVIEW_LIMIT
      ? str.slice(0, TEXT_PREVIEW_LIMIT) + TRUNCATE_NOTE
      : str;

  const makeJsonBlob = (data) =>
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });

  const makeXlsxBlob = (jsonArray) => {
    const ws = XLSX.utils.json_to_sheet(jsonArray);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  };

  const makeCsvBlob = (jsonArray) => {
    const ws = XLSX.utils.json_to_sheet(jsonArray);
    const csv = XLSX.utils.sheet_to_csv(ws);
    return { blob: new Blob([csv], { type: "text/csv" }), csv };
  };

  // ── Auto-preview (on file select, no conversion yet) ─────────────────────

  const autoPreview = useCallback(
    async (file, conversion) => {
      if (!file) return;
      resetOutput();
      setProgress(5);

      try {
        const { from } = conversion;

        if (from === "Excel") {
          setProgressPhase("Reading Excel…");
          const buf = await readAsArrayBuffer(file);
          setProgress(60);
          const wb = XLSX.read(new Uint8Array(buf), { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
          setPreviewData(json);
          setProgress(null);
          toast(
            `Loaded: ${wb.SheetNames.length} sheet(s) · ${json.length.toLocaleString()} rows`,
            "success"
          );
        } else if (from === "CSV") {
          setProgressPhase("Reading CSV…");
          const text = await readAsText(file);
          setProgress(60);
          const json = csvToJson(text);
          setPreviewData(json);
          setProgress(null);
          toast(`Loaded: ${json.length.toLocaleString()} rows`, "success");
        } else if (from === "JSON") {
          setProgressPhase("Reading JSON…");
          const text = await readAsText(file);
          setProgress(60);
          const json = JSON.parse(text);
          const arr = Array.isArray(json) ? json : [json];
          setPreviewData(arr);
          setProgress(null);
          toast(`Loaded: ${arr.length.toLocaleString()} record(s)`, "success");
        } else {
          // XML — just acknowledge file loaded
          setProgress(null);
          toast("File loaded. Click Convert to process.", "info");
        }
      } catch (err) {
        setProgress(null);
        toast("Preview failed: " + (err.message || "Unknown error"), "warning");
      }
    },
    [toast, readAsText, readAsArrayBuffer] // eslint-disable-line
  );

  // ── Main convert ──────────────────────────────────────────────────────────

  const convert = useCallback(
    async (file, conversion) => {
      if (!file) {
        toast("Please upload a file first.", "warning");
        return null;
      }

      const { valid, error, warning } = validateFile(file);
      if (!valid) { toast(error, "error"); return null; }
      if (warning) toast(warning, "warning");

      setConverting(true);
      resetOutput();

      const outBase = stripExtension(file.name) + "_converted";
      const { id, from, to } = conversion;
      let result = null;

      try {
        phase("Reading file…", 5);

        // ── JSON → Excel ──────────────────────────────────────────────────
        if (id === "json-excel") {
          const text = await readAsText(file);
          phase("Parsing JSON…", 48);
          const json = JSON.parse(text);
          const arr = Array.isArray(json) ? json : [json];
          phase("Building Excel…", 72);
          await tick();
          const blob = makeXlsxBlob(arr);
          phase("Done!", 100);
          setOutputBlob({ blob, filename: `${outBase}.xlsx` });
          setPreviewData(arr);
          toast(`✓ ${arr.length.toLocaleString()} rows → Excel`, "success");
          result = { success: true };
        }

        // ── Excel → JSON ──────────────────────────────────────────────────
        else if (id === "excel-json") {
          const buf = await readAsArrayBuffer(file);
          phase("Parsing Excel…", 50);
          const wb = XLSX.read(new Uint8Array(buf), { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          phase("Generating JSON…", 75);
          const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
          const blob = makeJsonBlob(json);
          const jsonStr = JSON.stringify(json, null, 2);
          phase("Done!", 100);
          setOutputBlob({ blob, filename: `${outBase}.json` });
          setPreviewData(json);
          setTextOutput(truncateText(jsonStr));
          toast(`✓ ${json.length.toLocaleString()} rows → JSON`, "success");
          result = { success: true };
        }

        // ── JSON → CSV ────────────────────────────────────────────────────
        else if (id === "json-csv") {
          const text = await readAsText(file);
          phase("Parsing JSON…", 50);
          const json = JSON.parse(text);
          const arr = Array.isArray(json) ? json : [json];
          phase("Generating CSV…", 78);
          const { blob, csv } = makeCsvBlob(arr);
          phase("Done!", 100);
          setOutputBlob({ blob, filename: `${outBase}.csv` });
          setPreviewData(arr);
          setTextOutput(truncateText(csv));
          toast(`✓ ${arr.length.toLocaleString()} rows → CSV`, "success");
          result = { success: true };
        }

        // ── CSV → JSON ────────────────────────────────────────────────────
        else if (id === "csv-json") {
          const text = await readAsText(file);
          phase("Parsing CSV…", 50);
          const json = csvToJson(text);
          phase("Generating JSON…", 78);
          const blob = makeJsonBlob(json);
          const jsonStr = JSON.stringify(json, null, 2);
          phase("Done!", 100);
          setOutputBlob({ blob, filename: `${outBase}.json` });
          setPreviewData(json);
          setTextOutput(truncateText(jsonStr));
          toast(`✓ ${json.length.toLocaleString()} rows → JSON`, "success");
          result = { success: true };
        }

        // ── CSV → Excel ───────────────────────────────────────────────────
        else if (id === "csv-excel") {
          const text = await readAsText(file);
          phase("Parsing CSV…", 50);
          const json = csvToJson(text);
          phase("Building Excel…", 75);
          await tick();
          const blob = makeXlsxBlob(json);
          phase("Done!", 100);
          setOutputBlob({ blob, filename: `${outBase}.xlsx` });
          setPreviewData(json);
          toast(`✓ ${json.length.toLocaleString()} rows → Excel`, "success");
          result = { success: true };
        }

        // ── Excel → CSV ───────────────────────────────────────────────────
        else if (id === "excel-csv") {
          const buf = await readAsArrayBuffer(file);
          phase("Parsing Excel…", 50);
          const wb = XLSX.read(new Uint8Array(buf), { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(ws, { defval: "" });
          phase("Generating CSV…", 78);
          const csv = XLSX.utils.sheet_to_csv(ws);
          const blob = new Blob([csv], { type: "text/csv" });
          phase("Done!", 100);
          setOutputBlob({ blob, filename: `${outBase}.csv` });
          setPreviewData(json);
          setTextOutput(truncateText(csv));
          toast(`✓ ${json.length.toLocaleString()} rows → CSV`, "success");
          result = { success: true };
        }

        // ── XML → JSON ────────────────────────────────────────────────────
        else if (id === "xml-json") {
          const text = await readAsText(file);
          phase("Parsing XML…", 52);
          const json = xmlToJson(text);
          phase("Generating JSON…", 80);
          const blob = makeJsonBlob(json);
          const jsonStr = JSON.stringify(json, null, 2);
          phase("Done!", 100);
          setOutputBlob({ blob, filename: `${outBase}.json` });
          const arr = Array.isArray(json) ? json : [json];
          setPreviewData(arr);
          setTextOutput(truncateText(jsonStr));
          toast("✓ XML → JSON conversion complete!", "success");
          result = { success: true };
        }

        // ── JSON → XML ────────────────────────────────────────────────────
        else if (id === "json-xml") {
          const text = await readAsText(file);
          phase("Parsing JSON…", 50);
          const json = JSON.parse(text);
          phase("Generating XML…", 78);
          const xmlStr = jsonToXml(json, outBase);
          const blob = new Blob([xmlStr], { type: "application/xml" });
          phase("Done!", 100);
          setOutputBlob({ blob, filename: `${outBase}.xml` });
          setTextOutput(truncateText(xmlStr));
          toast("✓ JSON → XML conversion complete!", "success");
          result = { success: true };
        }

      } catch (err) {
        const msg = err.message || "Conversion failed. Please check your file.";
        toast(msg, "error");
        setProgress(null);
        result = { success: false, error: msg };
      } finally {
        setConverting(false);
        setTimeout(() => setProgress((p) => (p === 100 ? null : p)), 1800);
      }

      return result;
    },
    [toast, readAsText, readAsArrayBuffer] // eslint-disable-line
  );

  // ── Reset ─────────────────────────────────────────────────────────────────

  const resetOutput = useCallback(() => {
    setPreviewData(null);
    setTextOutput(null);
    setOutputBlob(null);
    setProgress(null);
    setProgressPhase("");
  }, []);

  return {
    progress,
    progressPhase,
    previewData,
    textOutput,
    outputBlob,
    converting,
    convert,
    autoPreview,
    resetOutput,
  };
}

// Yield to event loop so React can re-render progress updates
function tick() {
  return new Promise((r) => setTimeout(r, 0));
}
