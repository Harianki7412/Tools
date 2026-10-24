import { Tool } from "../types";
import * as md5Import from "js-md5";

// ✅ Runtime-safe: works with or without esModuleInterop
// With interop:    md5Import = { default: fn }  → .default gives fn
// Without interop: md5Import = fn               → || fallback gives fn
const md5: (text: string) => string =
  (md5Import as any).default || (md5Import as any);

async function sha(
  algo: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512",
  text: string
): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hashBuf = await crypto.subtle.digest(algo, buf);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const hashGenerator: Tool = {
  slug: "hash-generator",
  name: "Hash Generator (MD5, SHA-1, SHA-256, SHA-512)",
  category: "Developer Tools",
  icon: "#️⃣",
  shortDescription: "Compute MD5, SHA-1, SHA-256, or SHA-512 hashes of any text.",
  description:
    "Generate cryptographic hashes from text using MD5, SHA-1, SHA-256, SHA-384, or SHA-512. SHA variants use the browser's Web Crypto API; MD5 is computed via js-md5. All processing is local.",
  keywords: [
    "hash generator",
    "md5 generator",
    "sha256 generator",
    "sha1 hash",
    "checksum",
    "online hash",
  ],
  fields: [
    {
      id: "input",
      label: "Text to hash",
      type: "textarea",
      defaultValue: "hello world",
    },
    {
      id: "algo",
      label: "Algorithm",
      type: "select",
      defaultValue: "SHA-256",
      options: [
        { value: "MD5", label: "MD5 (legacy, not secure)" },
        { value: "SHA-1", label: "SHA-1 (deprecated)" },
        { value: "SHA-256", label: "SHA-256 (recommended)" },
        { value: "SHA-384", label: "SHA-384" },
        { value: "SHA-512", label: "SHA-512" },
      ],
    },
  ],
  run: async (v) => {
    const text = String(v.input ?? "");
    const algo = String(v.algo || "SHA-256");

    if (algo === "MD5") {
      return `MD5: ${md5(text)}\n\n⚠️ MD5 is cryptographically broken. Do not use for security.`;
    }

    if (
      algo === "SHA-1" ||
      algo === "SHA-256" ||
      algo === "SHA-384" ||
      algo === "SHA-512"
    ) {
      const out = await sha(algo, text);
      const warn =
        algo === "SHA-1" ? "\n\n⚠️ SHA-1 is deprecated. Use SHA-256+." : "";
      return `${algo}: ${out}${warn}`;
    }

    throw new Error("Unsupported algorithm.");
  },
  howTo: [
    "Paste or type your text.",
    "Choose an algorithm.",
    "Click Generate and copy the hash.",
  ],
  faqs: [
    {
      q: "Which algorithm should I use?",
      a: "SHA-256 for general use. SHA-512 for extra security. Never use MD5 or SHA-1 for new security-sensitive work.",
    },
    {
      q: "Can I reverse a hash?",
      a: "No — hashing is one-way. Rainbow tables can crack weak passwords but that's not reversing.",
    },
  ],
};