import { Tool } from "../types";

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const pdfCompressor: Tool = {
  slug: "pdf-compressor",
  name: "PDF Compressor",
  category: "PDF Tools",
  icon: "📄",
  shortDescription:
    "Reduce PDF file size by optimizing internal object streams and removing metadata.",
  description:
    "Optimize your PDF by combining object streams and stripping unneeded metadata. Best results on unoptimized PDFs. All processing happens in your browser — files never leave your device.",
  keywords: [
    "pdf compressor",
    "compress pdf",
    "reduce pdf size",
    "optimize pdf",
    "shrink pdf",
  ],
  fields: [
    {
      id: "file",
      label: "PDF File",
      type: "file",
      accept: "application/pdf,.pdf",
      description: "Max 50 MB. Everything runs locally.",
    },
  ],
  run: async (v) => {
    const file = v.file as File | null;
    if (!file) throw new Error("Please select a PDF file.");
    if (file.size > MAX_SIZE) throw new Error("File too large (max 50 MB).");

    // Dynamic import — pdf-lib sirf tab load hota hai jab zaroorat ho
    const { PDFDocument } = await import("pdf-lib");

    const arrayBuffer = await file.arrayBuffer();
    let pdf;
    try {
      pdf = await PDFDocument.load(arrayBuffer, { updateMetadata: false });
    } catch (e: any) {
      throw new Error(`Could not read PDF: ${e.message}`);
    }

    const compressedBytes = await pdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    // ✅ FIX: Uint8Array<ArrayBuffer> copy — BlobPart ke saath compatible
    const compressedBlob = new Blob([new Uint8Array(compressedBytes)], {
      type: "application/pdf",
    });

    // Agar compression ne file badi kar di (rare), original return karein
    const finalBlob = compressedBlob.size < file.size ? compressedBlob : file;

    const saved = file.size - finalBlob.size;
    const percent = ((saved / file.size) * 100).toFixed(1);

    const note =
      finalBlob.size < file.size
        ? `${formatBytes(file.size)} → ${formatBytes(finalBlob.size)} (saved ${formatBytes(saved)}, ${percent}%)`
        : `Already optimized — original size kept (${formatBytes(file.size)})`;

    return {
      kind: "file" as const,
      blob: finalBlob,
      filename: file.name.replace(/\.pdf$/i, "") + "-compressed.pdf",
      mimeType: "application/pdf",
      note,
    };
  },
  howTo: [
    "Select a PDF file (max 50 MB).",
    "Click Compress PDF.",
    "Download the optimized file.",
  ],
  faqs: [
    {
      q: "Does this upload my PDF anywhere?",
      a: "No. The entire compression runs in your browser. Your file never leaves your device.",
    },
    {
      q: "How much will my file shrink?",
      a: "Results vary. PDFs with unoptimized object streams often shrink 5–30%. Already-optimized PDFs may see minimal change. This tool does not re-encode embedded images.",
    },
    {
      q: "Why is my file sometimes not compressed?",
      a: "If re-saving would make the file larger (rare but possible), we return the original unchanged to protect quality.",
    },
  ],
};