import { Tool } from "../types";

export const percentageCalculator: Tool = {
  slug: "percentage-calculator",
  name: "Percentage Calculator",
  category: "Calculators",
  icon: "%",
  shortDescription: "Calculate X% of Y, percentage change, and what percent one value is of another.",
  description:
    "Four most common percentage calculations in one tool: what is X% of Y, X is what % of Y, % increase/decrease, and X is Y% of what.",
  keywords: ["percentage calculator", "percent calculator", "percent of", "percentage increase", "percent change"],
  fields: [
    {
      id: "mode",
      label: "Calculation",
      type: "select",
      defaultValue: "of",
      options: [
        { value: "of", label: "What is X% of Y?" },
        { value: "isWhatPercent", label: "X is what % of Y?" },
        { value: "change", label: "% change from X to Y" },
        { value: "isPercentOfWhat", label: "X is Y% of what number?" },
      ],
    },
    { id: "x", label: "X", type: "number", defaultValue: 25 },
    { id: "y", label: "Y", type: "number", defaultValue: 200 },
  ],
  run: (v) => {
    const mode = String(v.mode || "of");
    const x = Number(v.x ?? 0);
    const y = Number(v.y ?? 0);

    if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error("Enter valid numbers.");

    if (mode === "of") {
      const r = (x / 100) * y;
      return `${x}% of ${y} = ${r}`;
    }
    if (mode === "isWhatPercent") {
      if (y === 0) throw new Error("Y cannot be zero.");
      const r = (x / y) * 100;
      return `${x} is ${r.toFixed(4).replace(/\.?0+$/, "")}% of ${y}`;
    }
    if (mode === "change") {
      if (x === 0) throw new Error("X cannot be zero for % change.");
      const change = ((y - x) / Math.abs(x)) * 100;
      const word = change >= 0 ? "increase" : "decrease";
      return `From ${x} to ${y} is a ${Math.abs(change).toFixed(4).replace(/\.?0+$/, "")}% ${word}`;
    }
    if (mode === "isPercentOfWhat") {
      if (y === 0) throw new Error("Y cannot be zero.");
      const r = (x / y) * 100;
      return `${x} is ${y}% of ${r}`;
    }
    throw new Error("Unknown calculation.");
  },
  howTo: [
    "Choose the type of percentage calculation.",
    "Enter X and Y values.",
    "Click Calculate.",
  ],
  faqs: [
    { q: "What does % change mean?", a: "It shows how much Y differs from X in percentage terms. Positive = increase, negative = decrease." },
    { q: "Can I use decimals?", a: "Yes — both X and Y accept decimals." },
  ],
};