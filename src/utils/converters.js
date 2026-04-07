/**
 * converters.js
 * Pure, stateless conversion utility functions.
 * All functions are synchronous and throw on error.
 */

// ─── XML ↔ JSON ──────────────────────────────────────────────────────────────

/**
 * Converts an XML string to a plain JavaScript object.
 * @param {string} xmlString
 * @returns {object}
 */
export function xmlToJson(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");

  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    throw new Error("Invalid XML: " + parserError.textContent.slice(0, 120));
  }

  function nodeToObj(node) {
    // Text node
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue.trim();
    }

    const obj = {};

    // Attributes → @attrName
    for (const attr of node.attributes || []) {
      obj[`@${attr.name}`] = attr.value;
    }

    // Children
    for (const child of node.childNodes) {
      // Skip empty text nodes
      if (child.nodeType === Node.TEXT_NODE && !child.nodeValue.trim()) continue;

      const val = nodeToObj(child);

      if (obj[child.nodeName] !== undefined) {
        if (!Array.isArray(obj[child.nodeName])) {
          obj[child.nodeName] = [obj[child.nodeName]];
        }
        obj[child.nodeName].push(val);
      } else {
        obj[child.nodeName] = val;
      }
    }

    // Collapse single-key objects that only have #text
    const keys = Object.keys(obj);
    if (keys.length === 1 && keys[0] === "#text") return obj["#text"];

    return obj;
  }

  return { [doc.documentElement.nodeName]: nodeToObj(doc.documentElement) };
}

/**
 * Converts a JavaScript value to an XML string fragment (no declaration).
 * @param {any}    value
 * @param {number} indent  Current indentation level
 * @returns {string}
 */
export function jsonToXmlFragment(value, indent = 1) {
  const pad = "  ".repeat(indent);

  if (Array.isArray(value)) {
    return value
      .map((item) => `${pad}<item>\n${jsonToXmlFragment(item, indent + 1)}\n${pad}</item>`)
      .join("\n");
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value)
      .map(([key, val]) => {
        if (Array.isArray(val)) {
          return val
            .map(
              (item) =>
                `${pad}<${key}>\n${jsonToXmlFragment(item, indent + 1)}\n${pad}</${key}>`
            )
            .join("\n");
        }
        if (typeof val === "object" && val !== null) {
          return `${pad}<${key}>\n${jsonToXmlFragment(val, indent + 1)}\n${pad}</${key}>`;
        }
        return `${pad}<${key}>${escapeXml(String(val ?? ""))}</${key}>`;
      })
      .join("\n");
  }

  return `${pad}${escapeXml(String(value ?? ""))}`;
}

/**
 * Builds a complete XML document string from a JSON value.
 * @param {any}    json
 * @param {string} rootTag
 * @returns {string}
 */
export function jsonToXml(json, rootTag = "root") {
  const safeTag = rootTag.replace(/[^a-zA-Z0-9_-]/g, "_") || "root";
  const body = jsonToXmlFragment(json, 1);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${safeTag}>\n${body}\n</${safeTag}>`;
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ─── CSV ─────────────────────────────────────────────────────────────────────

/**
 * Parses a CSV string into an array of row objects.
 * Handles quoted fields and commas inside quotes.
 * @param {string} csvText
 * @returns {object[]}
 */
export function csvToJson(csvText) {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim());

  if (lines.length < 2) {
    throw new Error("CSV must have a header row and at least one data row.");
  }

  const headers = parseCsvRow(lines[0]);

  return lines.slice(1).map((line, rowIndex) => {
    const values = parseCsvRow(line);
    const obj = {};
    headers.forEach((header, i) => {
      const raw = values[i] ?? "";
      // Coerce numeric strings
      obj[header] = raw !== "" && !isNaN(raw) && !isNaN(parseFloat(raw))
        ? Number(raw)
        : raw;
    });
    return obj;
  });
}

/**
 * Splits a single CSV line into fields, respecting quoted values.
 * @param {string} line
 * @returns {string[]}
 */
function parseCsvRow(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }

  fields.push(current.trim());
  return fields;
}
