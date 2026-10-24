export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "ToolKitPro",
  title: "Free Online Utility Tools — Fast, Private, No Signup",
  description:
    "Free browser-based utility tools: JSON formatter, Base64 encoder, age calculator, password generator, UUID, color converter, and more. No signup, runs 100% in your browser.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://toolkitpro.example.com",
  twitter: "@toolkitpro",
};

export const MONETAG = {
  /** Global Multitag zone — popunder, push, vignette */
  globalZoneId: process.env.NEXT_PUBLIC_MONETAG_GLOBAL_ZONE || "",

  /** Homepage banner zone */
  bannerZoneId: process.env.NEXT_PUBLIC_MONETAG_BANNER_ZONE || "",

  /** Script URL */
  scriptUrl:
    process.env.NEXT_PUBLIC_MONETAG_SCRIPT_URL ||
    "https://inklinkor.com/tag.min.js",
};

/** Helper: zone ID valid hai ya nahi */
export function isZoneValid(zoneId: string | undefined): boolean {
  if (!zoneId) return false;
  if (zoneId.includes("0000000")) return false;
  if (!/^\d+$/.test(zoneId)) return false;
  return true;
}