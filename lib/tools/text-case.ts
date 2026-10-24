import { Tool } from "../types";
import { asString } from "../utils";

const transformations: Record<string, (s: string) => string> = {
  upper: (s) => s.toUpperCase(),
  lower: (s) => s.toLowerCase(),
  title: (s) => s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()),
  sentence: (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
  camel: (s) => s.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  snake: (s) => s.trim().replace(/[^a-z0-9]+/gi, "_").toLowerCase(),
  kebab: (s) => s.trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase(),
};

export const textCase: Tool = {
  slug: "text-case-converter",
  name: "Text Case Converter",
  category: "Text Tools",
  icon: "Aa",
  shortDescription: "Convert text to UPPER, lower, Title, camelCase, snake_case, or kebab-case.",
  description:
    "One-click conversion between all common text cases. Ideal for developers, writers, and SEO editors.",
  keywords: ["case converter", "camelcase converter", "snake case", "title case"],
  fields: [
    {
      id: "input",
      label: "Text",
      type: "textarea",
      defaultValue: "hello world from tool kit pro",
    },
    {
      id: "case",
      label: "Target Case",
      type: "select",
      defaultValue: "camel",
      options: [
        { value: "upper", label: "UPPERCASE" },
        { value: "lower", label: "lowercase" },
        { value: "title", label: "Title Case" },
        { value: "sentence", label: "Sentence case" },
        { value: "camel", label: "camelCase" },
        { value: "snake", label: "snake_case" },
        { value: "kebab", label: "kebab-case" },
      ],
    },
  ],
  run: (v) => {
    const input = asString(v.input);
    const c = asString(v.case) || "camel";
    if (!input) throw new Error("Please enter some text.");
    const fn = transformations[c];
    if (!fn) throw new Error("Unknown case.");
    return fn(input);
  },
  howTo: ["Paste your text.", "Select a target case.", "Click Convert."],
  faqs: [
    { q: "Does it support Unicode?", a: "Yes — upper/lower/title handle Unicode correctly." },
  ],
};