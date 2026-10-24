import { Tool } from "../types";
import { asString } from "../utils";

function encodeUtf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function decodeUtf8(b64: string): string {
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export const base64: Tool = {
  slug: "base64-encoder-decoder",
  name: "Base64 Encoder / Decoder",
  category: "Developer Tools",
  icon: "b64",
  shortDescription: "Encode or decode UTF-8 text to Base64 safely in your browser.",
  description:
    "Convert plain text to Base64 or decode Base64 back to text. Unicode-safe (handles emoji, Devanagari, and other multi-byte characters). Runs entirely client-side.",
  keywords: ["base64 encode", "base64 decode", "base64 converter", "utf8 to base64"],
  fields: [
    {
      id: "input",
      label: "Input",
      type: "textarea",
      placeholder: "Hello world",
      defaultValue: "Hello, दुनिया! 👋",
    },
    {
      id: "mode",
      label: "Mode",
      type: "select",
      defaultValue: "encode",
      options: [
        { value: "encode", label: "Encode to Base64" },
        { value: "decode", label: "Decode from Base64" },
      ],
    },
  ],
  run: (v) => {
    const input = asString(v.input);
    const mode = asString(v.mode) || "encode";
    if (!input) throw new Error("Please enter some text.");
    if (mode === "encode") return encodeUtf8(input);
    try {
      return decodeUtf8(input.trim());
    } catch {
      throw new Error("Invalid Base64 string.");
    }
  },
  howTo: [
    "Choose whether to encode or decode.",
    "Paste text or Base64 into the input.",
    "Click Run to see the result.",
  ],
  faqs: [
    {
      q: "Does this support Unicode?",
      a: "Yes — the tool uses UTF-8 encoding so emoji and non-Latin scripts work correctly.",
    },
    {
      q: "Is Base64 encryption?",
      a: "No, it is just encoding — anyone can reverse it. Do not use it for security.",
    },
  ],
};