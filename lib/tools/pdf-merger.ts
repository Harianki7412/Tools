import { Tool } from "../types";

const MAX_TOTAL = 100 * 1024 * 1024;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export const pdfMerger: Tool = {
  slug: "pdf-merger",
  name: "PDF Merger",
  category: "PDF Tools",
  icon: "📑",
  shortDescription: "Combine multiple PDF files into one in the exact order you choose.",
  description:
    "Merge two or more PDFs into a single document. Files are combined in the order they appear in your selection. All processing happens locally in your browser.",
  keywords: ["pdf merger", "merge pdf", "combine pdf", "join pdf", "pdf joiner"],
  fields: [
    {
      id: "files",
      label: "PDF Files (in order)",
      type: "file",
      accept: "application/pdf,.pdf",
      multiple: true,
      description: "Select 2+ files. Order of selection = order in merged PDF. Max 100 MB total.",
    },
  ],
  run: async (v) => {
    const files = (v.files as File[]) || [];
    if (files.length < 2) throw new Error("Please select at least 2 PDF files.");
    const total = files.reduce((s, f) => s + f.size, 0);
    if (total > MAX_TOTAL) throw new Error("Total size exceeds 100 MB.");

    const { PDFDocument } = await import("pdf-lib");
    const merged = await PDFDocument.create();

    for (const file of files) {
      try {
        const buf = await file.arrayBuffer();
        const src = await PDFDocument.load(buf, { updateMetadata: false });
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      } catch (e: any) {
        throw new Error(`Failed to read "${file.name}": ${e.message}`);
      }
    }

    const bytes = await merged.save({ useObjectStreams: true });
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });

    return {
      kind: "file" as const,
      blob,
      filename: "merged.pdf",
      mimeType: "application/pdf",
      note: `Merged ${files.length} files · ${merged.getPageCount()} pages · ${formatBytes(blob.size)}`,
    };
  },
  howTo: [
    "Select 2 or more PDF files (hold Ctrl/Cmd for multiple).",
    "The order they appear in your selection = order in merged PDF.",
    "Click Merge PDFs and download.",
  ],
  faqs: [
    { q: "Can I control the order of files?", a: "Yes — files merge in the order you select them. To reorder, re-select in the desired order." },
    { q: "Is there a page limit?", a: "No hard page limit — the 100 MB total file size is the only cap." },
    { q: "Are bookmarks preserved?", a: "Bookmarks and forms are not merged. Only page content is combined." },
  ],
};