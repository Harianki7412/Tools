import { Tool } from "../types";

const PRESETS: Record<string, string> = {
  "*/5 * * * *": "Every 5 minutes",
  "0 * * * *": "Every hour (on the hour)",
  "0 0 * * *": "Every day at midnight",
  "0 9 * * 1-5": "Weekdays at 9:00 AM",
  "0 0 * * 0": "Every Sunday at midnight",
  "0 0 1 * *": "First day of every month",
  "0 0 1 1 *": "Once a year on Jan 1",
};

export const cronGenerator: Tool = {
  slug: "cron-generator",
  name: "Cron Expression Generator",
  category: "Developer Tools",
  icon: "⏰",
  shortDescription: "Build standard 5-field cron expressions with presets or custom fields.",
  description:
    "Generate a cron schedule from a preset or by entering each field manually. Includes a plain-English explanation for common patterns.",
  keywords: ["cron generator", "crontab generator", "cron expression", "cron schedule", "cron builder"],
  fields: [
    {
      id: "preset",
      label: "Preset (optional)",
      type: "select",
      defaultValue: "",
      options: [
        { value: "", label: "— Custom (use fields below) —" },
        ...Object.keys(PRESETS).map((expr) => ({ value: expr, label: `${expr}  ·  ${PRESETS[expr]}` })),
      ],
    },
    { id: "minute", label: "Minute (0–59)", type: "text", defaultValue: "0" },
    { id: "hour", label: "Hour (0–23)", type: "text", defaultValue: "9" },
    { id: "day", label: "Day of month (1–31)", type: "text", defaultValue: "*" },
    { id: "month", label: "Month (1–12)", type: "text", defaultValue: "*" },
    { id: "weekday", label: "Day of week (0–6, Sun=0)", type: "text", defaultValue: "*" },
  ],
  run: (v) => {
    const preset = String(v.preset || "");
    if (preset) {
      return `Cron: ${preset}\nMeaning: ${PRESETS[preset]}\n\nFields: minute hour day-of-month month day-of-week`;
    }
    const m = String(v.minute ?? "").trim() || "*";
    const h = String(v.hour ?? "").trim() || "*";
    const d = String(v.day ?? "").trim() || "*";
    const mo = String(v.month ?? "").trim() || "*";
    const w = String(v.weekday ?? "").trim() || "*";
    const expr = `${m} ${h} ${d} ${mo} ${w}`;
    return [
      `Cron: ${expr}`,
      ``,
      `Fields: minute hour day-of-month month day-of-week`,
      `         ${m.padEnd(6)}${h.padEnd(4)}${d.padEnd(14)}${mo.padEnd(5)}${w}`,
      ``,
      `Tip: * = any value, */N = every N, 1-5 = range, 1,3,5 = list.`,
    ].join("\n");
  },
  howTo: [
    "Pick a preset for common schedules, OR",
    "Enter each field manually.",
    "Click Generate to get the cron expression.",
  ],
  faqs: [
    { q: "What is standard cron format?", a: "5 fields: minute hour day-of-month month day-of-week. Example: '0 9 * * 1-5' = 9:00 AM on weekdays." },
    { q: "Does this support cron with seconds?", a: "No — this generates standard 5-field cron (used by Linux, GitHub Actions, and most schedulers)." },
    { q: "What is Sunday in the weekday field?", a: "0 or 7, depending on the system. This generator uses 0 = Sunday." },
  ],
};