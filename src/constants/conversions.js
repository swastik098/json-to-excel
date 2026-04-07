/**
 * conversions.js
 * Defines all supported file-format conversion types.
 * Add new conversions here — the UI picks them up automatically.
 */

export const CONVERSIONS = [
  {
    id: "json-excel",
    from: "JSON",
    to: "Excel",
    fromExt: ".json",
    toExt: ".xlsx",
    icon: "📊",
    color: "#10b981",
    description: "Convert JSON data into a formatted Excel spreadsheet",
  },
  {
    id: "excel-json",
    from: "Excel",
    to: "JSON",
    fromExt: ".xlsx,.xls",
    toExt: ".json",
    icon: "🔄",
    color: "#3b82f6",
    description: "Extract Excel data into structured JSON format",
  },
  {
    id: "json-csv",
    from: "JSON",
    to: "CSV",
    fromExt: ".json",
    toExt: ".csv",
    icon: "📋",
    color: "#8b5cf6",
    description: "Flatten JSON arrays into comma-separated values",
  },
  {
    id: "csv-json",
    from: "CSV",
    to: "JSON",
    fromExt: ".csv",
    toExt: ".json",
    icon: "🔃",
    color: "#f59e0b",
    description: "Parse CSV rows into structured JSON objects",
  },
  {
    id: "csv-excel",
    from: "CSV",
    to: "Excel",
    fromExt: ".csv",
    toExt: ".xlsx",
    icon: "📈",
    color: "#ef4444",
    description: "Import CSV data into a formatted Excel file",
  },
  {
    id: "excel-csv",
    from: "Excel",
    to: "CSV",
    fromExt: ".xlsx,.xls",
    toExt: ".csv",
    icon: "📉",
    color: "#06b6d4",
    description: "Export Excel sheet data as a CSV file",
  },
  {
    id: "xml-json",
    from: "XML",
    to: "JSON",
    fromExt: ".xml",
    toExt: ".json",
    icon: "🗂️",
    color: "#ec4899",
    description: "Transform XML documents into JSON objects",
  },
  {
    id: "json-xml",
    from: "JSON",
    to: "XML",
    fromExt: ".json",
    toExt: ".xml",
    icon: "📄",
    color: "#14b8a6",
    description: "Serialize JSON data into valid XML markup",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    num: "1",
    icon: "📂",
    title: "Choose Format",
    desc: "Select your source and target format from 8 supported conversion types.",
  },
  {
    num: "2",
    icon: "☁️",
    title: "Upload File",
    desc: "Drag & drop or click to upload. Supports files up to 500 MB.",
  },
  {
    num: "3",
    icon: "⚡",
    title: "Convert",
    desc: "Watch real-time progress. Preview your data before downloading.",
  },
  {
    num: "4",
    icon: "⬇️",
    title: "Download",
    desc: "Your converted file is ready instantly — no sign-up required.",
  },
];

export const FEATURES = [
  {
    icon: "🔒",
    title: "100% Private",
    desc: "All conversions happen in your browser. Files never leave your device.",
  },
  {
    icon: "⚡",
    title: "Any File Size",
    desc: "No size limits — convert files of any size with real-time progress tracking.",
  },
  {
    icon: "📊",
    title: "8 Formats",
    desc: "JSON, Excel, CSV, XML — all combinations supported in one place.",
  },
  {
    icon: "🆓",
    title: "Always Free",
    desc: "No sign-up, no watermarks, no limits. Completely free forever.",
  },
  {
    icon: "👁️",
    title: "Live Preview",
    desc: "Preview your data as a table before downloading. See what you'll get.",
  },
  {
    icon: "🌙",
    title: "Dark Mode",
    desc: "Easy on the eyes — switch between light and dark themes anytime.",
  },
];

export const MAX_FILE_SIZE_MB   = Infinity;  // No hard limit — all sizes accepted
export const LARGE_FILE_WARN_MB = 100;        // Soft warning at 100 MB
export const HUGE_FILE_WARN_MB  = 500;        // Extra warning at 500 MB
export const PREVIEW_MAX_ROWS   = 8;
export const TEXT_PREVIEW_LIMIT = 5000;
