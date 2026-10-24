import { Tool } from "../types";

const MAX_SIZE = 20 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not load image.")); };
    img.src = url;
  });
}

export const imageCompressor: Tool = {
  slug: "image-compressor",
  name: "Image Compressor",
  category: "Image Tools",
  icon: "🗜️",
  shortDescription: "Reduce image file size by re-encoding with adjustable quality and dimensions.",
  description:
    "Shrink JPG, PNG, or WebP files by re-encoding them at lower quality and optionally resizing. Perfect for email attachments, web uploads, and faster page loads. All processing happens in your browser.",
  keywords: ["image compressor", "compress image", "reduce image size", "shrink image", "compress jpg", "compress png"],
  fields: [
    { id: "file", label: "Image File", type: "file", accept: "image/*", description: "PNG, JPEG, WebP, GIF (max 20 MB)." },
    { id: "quality", label: "Quality (1–100)", type: "number", defaultValue: 70, description: "Lower = smaller. PNG ignores this." },
    { id: "maxWidth", label: "Max width (px, 0 = keep)", type: "number", defaultValue: 0 },
    { id: "maxHeight", label: "Max height (px, 0 = keep)", type: "number", defaultValue: 0 },
    {
      id: "format",
      label: "Output Format",
      type: "select",
      defaultValue: "image/jpeg",
      options: [
        { value: "image/jpeg", label: "JPEG (best for photos)" },
        { value: "image/webp", label: "WebP (best compression)" },
        { value: "image/png", label: "PNG (lossless)" },
      ],
    },
  ],
  run: async (v) => {
    const file = v.file as File | null;
    if (!file) throw new Error("Please select an image.");
    if (file.size > MAX_SIZE) throw new Error("Image too large (max 20 MB).");

    const format = String(v.format || "image/jpeg");
    const quality = Math.max(1, Math.min(100, Number(v.quality) || 70)) / 100;
    const maxW = Math.max(0, Number(v.maxWidth) || 0);
    const maxH = Math.max(0, Number(v.maxHeight) || 0);

    const img = await loadImage(file);
    let w = img.width;
    let h = img.height;
    if (maxW > 0 && w > maxW) { h = Math.round((h * maxW) / w); w = maxW; }
    if (maxH > 0 && h > maxH) { w = Math.round((w * maxH) / h); h = maxH; }

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported.");

    if (format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, format, format === "image/png" ? undefined : quality);
    });
    if (!blob) throw new Error("Compression failed.");

    const ext = format.split("/")[1] === "jpeg" ? "jpg" : format.split("/")[1];
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const saved = file.size - blob.size;
    const percent = ((saved / file.size) * 100).toFixed(1);

    return {
      kind: "file" as const,
      blob,
      filename: `${baseName}-compressed.${ext}`,
      mimeType: format,
      note: `${formatBytes(file.size)} → ${formatBytes(blob.size)} (${saved > 0 ? `saved ${percent}%` : "already optimized"}) · ${w}×${h}`,
    };
  },
  howTo: [
    "Select an image file (JPG, PNG, or WebP).",
    "Set quality and optional max dimensions.",
    "Choose output format.",
    "Click Compress and download.",
  ],
  faqs: [
    { q: "Does this upload my image?", a: "No. Compression uses the browser's Canvas API. Your file never leaves your device." },
    { q: "Which format gives the smallest file?", a: "WebP usually produces 25–35% smaller files than JPEG at similar quality. JPEG is universally compatible." },
    { q: "Why does PNG not shrink much?", a: "PNG is lossless — quality setting has no effect. Convert to JPEG or WebP for major savings." },
  ],
};