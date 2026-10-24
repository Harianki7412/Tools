import { Tool } from "../types";

function inr(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export const emiCalculator: Tool = {
  slug: "emi-calculator",
  name: "EMI Calculator",
  category: "Calculators",
  icon: "💰",
  shortDescription: "Calculate monthly EMI, total interest, and total payment for any loan.",
  description:
    "Compute the Equated Monthly Installment for home, car, personal, or education loans. Shows monthly EMI, total interest payable, and total amount paid over the tenure.",
  keywords: ["emi calculator", "loan calculator", "home loan emi", "car loan emi", "personal loan emi"],
  fields: [
    { id: "principal", label: "Loan amount (₹)", type: "number", defaultValue: 500000 },
    { id: "rate", label: "Annual interest rate (%)", type: "number", defaultValue: 8.5 },
    { id: "years", label: "Tenure (years)", type: "number", defaultValue: 5 },
  ],
  run: (v) => {
    const p = Number(v.principal || 0);
    const annualRate = Number(v.rate || 0);
    const years = Number(v.years || 0);

    if (p <= 0 || years <= 0) throw new Error("Loan amount and tenure must be positive.");
    if (annualRate < 0) throw new Error("Interest rate cannot be negative.");

    const r = annualRate / 12 / 100;
    const n = Math.round(years * 12);

    let emi: number;
    if (r === 0) emi = p / n;
    else emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    const total = emi * n;
    const interest = total - p;

    return [
      `Monthly EMI:     ${inr(emi)}`,
      `Total interest:  ${inr(interest)}`,
      `Total payment:   ${inr(total)}`,
      ``,
      `Principal:       ${inr(p)} (${((p / total) * 100).toFixed(1)}%)`,
      `Interest:        ${inr(interest)} (${((interest / total) * 100).toFixed(1)}%)`,
      `Tenure:          ${n} months (${years} years)`,
    ].join("\n");
  },
  howTo: [
    "Enter loan amount, annual interest rate, and tenure.",
    "Click Calculate.",
    "See monthly EMI, total interest, and total payment.",
  ],
  faqs: [
    { q: "What is EMI?", a: "Equated Monthly Installment — the fixed monthly payment that repays both principal and interest over the loan tenure." },
    { q: "Does this include processing fees?", a: "No — it only calculates EMI from principal, rate, and tenure. Bank processing fees are separate." },
  ],
};