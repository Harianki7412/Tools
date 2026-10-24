import { Tool } from "../types";
import { asString } from "../utils";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error("Enter a 6-digit hex like #ff6600.");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export const colorConverter: Tool = {
  slug: "color-converter",
  name: "Color Converter (HEX ⇄ RGB ⇄ HSL)",
  category: "Design Tools",
  icon: "🎨",
  shortDescription: "Convert colors between HEX, RGB, and HSL formats.",
  description: "Pick a color or paste a HEX code to get RGB and HSL equivalents instantly.",
  keywords: ["color converter", "hex to rgb", "rgb to hsl", "hex to hsl"],
  fields: [{ id: "hex", label: "HEX Color", type: "color", defaultValue: "#3b82f6" }],
  run: (v) => {
    const hex = asString(v.hex) || "#000000";
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
    return [
      `HEX: ${hex.toLowerCase()}`,
      `RGB: rgb(${r}, ${g}, ${b})`,
      `HSL: hsl(${h}, ${s}%, ${l}%)`,
    ].join("\n");
  },
  howTo: ["Pick a color.", "Click Convert.", "Copy HEX, RGB, or HSL."],
  faqs: [{ q: "What color formats are supported?", a: "HEX input; outputs include HEX, RGB, and HSL." }],
};