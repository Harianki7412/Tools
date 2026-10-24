import { Tool } from "../types";
import { asNumber, asBool } from "../utils";

function pick<T>(arr: T[]): T {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return arr[buf[0] % arr.length];
}

export const passwordGenerator: Tool = {
  slug: "password-generator",
  name: "Secure Password Generator",
  category: "Security",
  icon: "🔐",
  shortDescription: "Generate strong random passwords using cryptographically secure randomness.",
  description:
    "Create strong passwords with configurable length and character sets. Uses window.crypto — never transmitted anywhere.",
  keywords: ["password generator", "strong password", "secure password", "random password"],
  fields: [
    { id: "length", label: "Length", type: "number", defaultValue: 16 },
    { id: "upper", label: "Include uppercase (A–Z)", type: "checkbox", defaultValue: true },
    { id: "lower", label: "Include lowercase (a–z)", type: "checkbox", defaultValue: true },
    { id: "digits", label: "Include digits (0–9)", type: "checkbox", defaultValue: true },
    { id: "symbols", label: "Include symbols (!@#$…)", type: "checkbox", defaultValue: true },
  ],
  run: (v) => {
    const len = Math.max(4, Math.min(128, asNumber(v.length, 16)));
    let pool = "";
    if (asBool(v.upper)) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (asBool(v.lower)) pool += "abcdefghijklmnopqrstuvwxyz";
    if (asBool(v.digits)) pool += "0123456789";
    if (asBool(v.symbols)) pool += "!@#$%^&*()-_=+[]{};:,.<>?";
    if (!pool) throw new Error("Select at least one character type.");
    const chars = pool.split("");
    return Array.from({ length: len }, () => pick(chars)).join("");
  },
  howTo: ["Choose length and character sets.", "Click Generate.", "Copy the password."],
  faqs: [
    {
      q: "Is this secure?",
      a: "Yes — it uses window.crypto.getRandomValues, which is cryptographically strong.",
    },
    { q: "Are generated passwords stored?", a: "No — nothing is saved or transmitted." },
  ],
};