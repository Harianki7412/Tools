import { Tool } from "../types";

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image. Try PNG, JPEG, WebP, or GIF."));
    };
    img.src = url;
  });
}

export const imageConverter: Tool = {
  slug: "image-converter",
  name: "Image Converter (PNG / JPEG / WebP)",
  category: "Image Tools",
  icon: "🖼️",
  shortDescription:
    "Convert images between PNG, JPEG, and WebP formats in your browser. No uploads.",
  description:
    "Convert PNG, JPEG, WebP, GIF, or BMP images to another format with adjustable quality. All conversion happens locally using the Canvas API — files never leave your device.",
  keywords: [
    "image converter",
    "png to jpg",
    "jpg to png",
    "webp converter",
    "image format converter",
    "convert image online",
  ],
  fields: [
    {
      id: "file",
      label: "Image File",
      type: "file",
      accept: "image/*",
      description: "PNG, JPEG, WebP, GIF, BMP (max 20 MB).",
    },
    {
      id: "format",
      label: "Output Format",
      type: "select",
      defaultValue: "image/jpeg",
      options: [
        { value: "image/jpeg", label: "JPEG (.jpg)" },
        { value: "image/png", label: "PNG (.png)" },
        { value: "image/webp", label: "WebP (.webp)" },
      ],
    },
    {
      id: "quality",
      label: "Quality (1–100, JPEG/WebP only)",
      type: "number",
      defaultValue: 85,
      description: "Lower = smaller file. PNG is always lossless.",
    },
  ],
  run: async (v) => {
    const file = v.file as File | null;
    if (!file) throw new Error("Please select an image file.");
    if (file.size > MAX_SIZE) throw new Error("Image too large (max 20 MB).");

    const format = String(v.format || "image/jpeg");
    const quality = Math.max(1, Math.min(100, Number(v.quality) || 85)) / 100;

    const img = await loadImage(file);

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported in this browser.");

    // JPEG ke liye white background (transparent areas black na ho jayein)
    if (format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        resolve,
        format,
        format === "image/png" ? undefined : quality
      );
    });

    if (!blob) throw new Error("Conversion failed. Try a different format.");

    const ext = format.split("/")[1] === "jpeg" ? "jpg" : format.split("/")[1];
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const newName = `${baseName}.${ext}`;

    const change =
      blob.size < file.size
        ? `saved ${formatBytes(file.size - blob.size)}`
        : `added ${formatBytes(blob.size - file.size)}`;

    return {
      kind: "file" as const,
      blob,
      filename: newName,
      mimeType: format,
      note: `${formatBytes(file.size)} → ${formatBytes(blob.size)} (${change}) · ${canvas.width}×${canvas.height}`,
    };
  },
  howTo: [
    "Select an image (PNG, JPEG, WebP, GIF, or BMP).",
    "Choose the output format.",
    "Adjust quality if using JPEG or WebP.",
    "Click Convert and download.",
  ],
  faqs: [
    {
      q: "Are my images uploaded to a server?",
      a: "No. All conversion uses the browser's Canvas API. Your images never leave your device.",
    },
    {
      q: "What does quality do?",
      a: "Lower quality = smaller file. Only affects JPEG and WebP. PNG is always lossless.",
    },
    {
      q: "Why does my PNG become much smaller as JPEG?",
      a: "JPEG uses lossy compression and doesn't support transparency. If your PNG has a transparent background, it becomes white in JPEG.",
    },
    {
      q: "Can I convert animated GIFs?",
      a: "The first frame is converted. Animation is not preserved.",
    },
  ],
};