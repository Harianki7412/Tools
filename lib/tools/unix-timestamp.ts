import { Tool } from "../types";

export const unixTimestamp: Tool = {
  slug: "unix-timestamp-converter",
  name: "Unix Timestamp Converter",
  category: "Developer Tools",
  icon: "⏱️",
  shortDescription: "Convert between Unix timestamps and human-readable dates.",
  description:
    "Convert Unix timestamps (seconds or milliseconds) to ISO, UTC, and local time, or convert any date back to a Unix timestamp.",
  keywords: ["unix timestamp", "epoch converter", "timestamp to date", "date to timestamp", "epoch to date"],
  fields: [
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "toDate",
      options: [
        { value: "toDate", label: "Timestamp → Date" },
        { value: "toTimestamp", label: "Date → Timestamp" },
        { value: "now", label: "Current Timestamp (now)" },
      ],
    },
    {
      id: "input",
      label: "Input (timestamp or date)",
      type: "text",
      defaultValue: "1700000000",
      placeholder: "1700000000 or 2024-01-15T12:00:00Z",
    },
  ],
  run: (v) => {
    const mode = String(v.mode || "toDate");
    const input = String(v.input || "").trim();

    if (mode === "now") {
      const now = Date.now();
      return `Unix seconds: ${Math.floor(now / 1000)}\nUnix ms: ${now}\nISO: ${new Date(now).toISOString()}\nLocal: ${new Date(now).toString()}`;
    }

    if (mode === "toDate") {
      const n = Number(input);
      if (!Number.isFinite(n) || n < 0) throw new Error("Enter a valid positive number.");
      const ms = input.length > 10 ? n : n * 1000;
      const d = new Date(ms);
      if (isNaN(d.getTime())) throw new Error("Invalid timestamp.");
      return [
        `ISO (UTC):  ${d.toISOString()}`,
        `UTC string: ${d.toUTCString()}`,
        `Local time: ${d.toString()}`,
        `Unix seconds: ${Math.floor(ms / 1000)}`,
        `Unix ms:     ${ms}`,
      ].join("\n");
    }

    if (mode === "toTimestamp") {
      const d = new Date(input);
      if (isNaN(d.getTime())) throw new Error("Enter a valid date (e.g., 2024-01-15 or 2024-01-15T12:00:00Z).");
      return [
        `Unix seconds: ${Math.floor(d.getTime() / 1000)}`,
        `Unix ms:     ${d.getTime()}`,
        `ISO:         ${d.toISOString()}`,
      ].join("\n");
    }
    throw new Error("Unknown mode.");
  },
  howTo: [
    "Pick a conversion mode.",
    "Enter a timestamp or date.",
    "Click Convert.",
  ],
  faqs: [
    { q: "Does this handle milliseconds?", a: "Yes — 10 digits = seconds, 13 digits = milliseconds. Auto-detected." },
    { q: "What timezone is used?", a: "Output includes both UTC (ISO) and your local timezone." },
  ],
};