import { Tool } from "../types";
import { asString, asNumber } from "../utils";

export const jsonFormatter: Tool = {
  slug: "json-formatter",
  name: "JSON Formatter & Validator",
  category: "Developer Tools",
  icon: "{ }",
  shortDescription: "Format, validate, and minify JSON instantly in your browser.",
  description:
    "Paste JSON to pretty-print it with configurable indentation, validate its syntax, or minify it for production. All processing happens locally — your data never leaves the browser.",
  keywords: ["json formatter", "json validator", "json beautifier", "minify json"],
  fields: [
    {
      id: "input",
      label: "JSON Input",
      type: "textarea",
      placeholder: '{"name":"John","age":30}',
      defaultValue: '{"name":"John","age":30,"tags":["dev","writer"]}',
    },
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "pretty",
      options: [
        { value: "pretty", label: "Pretty print" },
        { value: "minify", label: "Minify" },
        { value: "validate", label: "Validate only" },
      ],
    },
    { id: "indent", label: "Indent (spaces)", type: "number", defaultValue: 2 },
  ],
  run: (v) => {
    const input = asString(v.input);
    const mode = asString(v.mode) || "pretty";
    const indent = asNumber(v.indent, 2);
    if (!input.trim()) throw new Error("Please paste some JSON.");
    let parsed: unknown;
    try {
      parsed = JSON.parse(input);
    } catch (e: any) {
      throw new Error(`Invalid JSON: ${e.message}`);
    }
    if (mode === "validate") return "✅ Valid JSON";
    if (mode === "minify") return JSON.stringify(parsed);
    const spaces = Math.max(0, Math.min(8, indent));
    return JSON.stringify(parsed, null, spaces);
  },
  howTo: [
    "Paste or type your JSON into the input box.",
    "Choose mode: pretty-print, minify, or validate.",
    "Click Format JSON to see the result.",
    "Copy the output with the Copy button.",
  ],
  faqs: [
    {
      q: "Is my JSON sent to a server?",
      a: "No. Everything runs in your browser using JavaScript. Nothing leaves your device.",
    },
    {
      q: "What indentation should I use?",
      a: "2 spaces is standard for most codebases. Tabs and 4-space are also valid.",
    },
  ],
};