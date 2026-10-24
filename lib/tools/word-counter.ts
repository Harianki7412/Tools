import { Tool } from "../types";
import { asString } from "../utils";

export const wordCounter: Tool = {
  slug: "word-counter",
  name: "Word & Character Counter",
  category: "Text Tools",
  icon: "#",
  shortDescription: "Count words, characters, sentences, and reading time instantly.",
  description:
    "Paste any text to get live counts: words, characters (with and without spaces), sentences, paragraphs, and estimated reading time.",
  keywords: ["word counter", "character counter", "reading time calculator"],
  fields: [
    {
      id: "input",
      label: "Text",
      type: "textarea",
      defaultValue:
        "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
    },
  ],
  run: (v) => {
    const text = asString(v.input);
    const words = text.trim().match(/\S+/g)?.length ?? 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s+/g, "").length;
    const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter((p: string) => p.trim()).length;
    const readingMinutes = Math.max(1, Math.ceil(words / 200));
    return [
      `Words: ${words}`,
      `Characters (with spaces): ${chars}`,
      `Characters (no spaces): ${charsNoSpaces}`,
      `Sentences: ${sentences}`,
      `Paragraphs: ${paragraphs}`,
      `Reading time: ~${readingMinutes} min`,
    ].join("\n");
  },
  howTo: ["Paste or type text.", "Click Count.", "See full statistics."],
  faqs: [{ q: "How is reading time calculated?", a: "At 200 words per minute, a common benchmark." }],
};