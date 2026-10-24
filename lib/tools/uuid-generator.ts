import { Tool } from "../types";
import { asNumber } from "../utils";

export const uuidGenerator: Tool = {
  slug: "uuid-generator",
  name: "UUID v4 Generator",
  category: "Developer Tools",
  icon: "id",
  shortDescription: "Generate one or many random UUID v4 strings in your browser.",
  description: "Create RFC 4122 version 4 UUIDs. Ideal for database keys, request IDs, and unique tokens.",
  keywords: ["uuid generator", "guid generator", "uuid v4", "random uuid"],
  fields: [{ id: "count", label: "How many UUIDs?", type: "number", defaultValue: 5 }],
  run: (v) => {
    const n = Math.max(1, Math.min(100, asNumber(v.count, 1)));
    const ids = Array.from({ length: n }, () => crypto.randomUUID());
    return ids.join("\n");
  },
  howTo: ["Enter how many UUIDs you need.", "Click Generate.", "Copy all or one."],
  faqs: [
    {
      q: "Are UUIDs guaranteed unique?",
      a: "UUID v4 has ~122 random bits — collisions are astronomically unlikely.",
    },
  ],
};