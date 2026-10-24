import { Tool } from "../types";

function diffLines(a: string, b: string): string[] {
  const al = a.split("\n");
  const bl = b.split("\n");
  const m = al.length;
  const n = bl.length;

  // LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (al[i] === bl[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const out: string[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (al[i] === bl[j]) {
      out.push("  " + al[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push("- " + al[i]);
      i++;
    } else {
      out.push("+ " + bl[j]);
      j++;
    }
  }
  while (i < m) out.push("- " + al[i++]);
  while (j < n) out.push("+ " + bl[j++]);
  return out;
}

export const textDiff: Tool = {
  slug: "text-diff",
  name: "Text Diff Checker",
  category: "Text Tools",
  icon: "⇄",
  shortDescription: "Compare two text blocks and see line-by-line differences.",
  description:
    "Paste two versions of a text and see exactly what changed, line by line. Lines starting with + are added, - are removed, and unmarked lines are unchanged. Uses an LCS algorithm.",
  keywords: ["text diff", "diff checker", "compare text", "text comparison", "diff tool"],
  fields: [
    { id: "a", label: "Original text", type: "textarea", defaultValue: "Hello world\nThis is line two\nUnchanged line\nLast line" },
    { id: "b", label: "Modified text", type: "textarea", defaultValue: "Hello world\nThis is line 2 (edited)\nUnchanged line\nNew line\nLast line" },
  ],
  run: (v) => {
    const a = String(v.a ?? "");
    const b = String(v.b ?? "");
    if (a === b) return "✅ No differences — the two texts are identical.";
    const lines = diffLines(a, b);
    const added = lines.filter((l) => l.startsWith("+ ")).length;
    const removed = lines.filter((l) => l.startsWith("- ")).length;
    return `Diff (${added} added, ${removed} removed):\n\n` + lines.join("\n");
  },
  howTo: [
    "Paste the original text in the left box.",
    "Paste the modified text in the right box.",
    "Click Compare to see the diff.",
  ],
  faqs: [
    { q: "What do + and - mean?", a: "Lines starting with + are in the modified version but not the original. Lines starting with - are in the original but not the modified." },
    { q: "Is this character-level or line-level?", a: "Line-level. Each line is either added, removed, or unchanged." },
  ],
};