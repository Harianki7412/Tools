import { Tool } from "../types";

export const qrGenerator: Tool = {
  slug: "qr-code-generator",
  name: "QR Code Generator",
  category: "Generators",
  icon: "📱",
  shortDescription: "Generate a downloadable PNG QR code for any text, URL, or contact info.",
  description:
    "Create high-quality QR codes for URLs, text, Wi-Fi credentials, or contact cards. Choose size and error correction level. Downloads as PNG. Runs entirely in your browser.",
  keywords: ["qr code generator", "qr generator", "create qr code", "url to qr", "free qr code"],
  fields: [
    {
      id: "text",
      label: "Text or URL",
      type: "textarea",
      defaultValue: "https://example.com",
      placeholder: "https://example.com or any text",
    },
    {
      id: "size",
      label: "Size (px)",
      type: "number",
      defaultValue: 512,
      description: "Recommended: 512 or larger for print.",
    },
    {
      id: "level",
      label: "Error Correction",
      type: "select",
      defaultValue: "M",
      options: [
        { value: "L", label: "Low (7%) — smallest QR" },
        { value: "M", label: "Medium (15%) — recommended" },
        { value: "Q", label: "Quartile (25%)" },
        { value: "H", label: "High (30%) — most robust" },
      ],
    },
  ],
  run: async (v) => {
    const text = String(v.text || "").trim();
    if (!text) throw new Error("Please enter text or a URL.");
    const size = Math.max(128, Math.min(2048, Number(v.size) || 512));
    const level = (String(v.level || "M").toUpperCase() as "L" | "M" | "Q" | "H");

    const QRCode = (await import("qrcode")).default;
    const dataUrl = await QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      errorCorrectionLevel: level,
      color: { dark: "#000000", light: "#ffffff" },
    });

    const res = await fetch(dataUrl);
    const blob = await res.blob();

    return {
      kind: "file" as const,
      blob,
      filename: "qrcode.png",
      mimeType: "image/png",
      note: `${size}×${size}px · ECC ${level} · ${text.length} characters`,
    };
  },
  howTo: [
    "Enter text or URL to encode.",
    "Choose size and error correction level.",
    "Click Generate and download the PNG.",
  ],
  faqs: [
    { q: "Do these QR codes expire?", a: "No — they are static QR codes generated locally. They will work forever." },
    { q: "What is error correction?", a: "Higher levels make the QR readable even if partially damaged or covered, at the cost of a denser code." },
    { q: "Are the QR codes tracked?", a: "No. There is no server, no tracking, no redirect. The QR encodes exactly the text you enter." },
  ],
};