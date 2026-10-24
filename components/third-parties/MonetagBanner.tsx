"use client";

import { useEffect, useRef } from "react";

interface MonetagBannerProps {
  /** Monetag banner zone ID (numeric string) */
  zoneId: string;
  /** Optional height for the container — helps avoid layout jump */
  minHeight?: number;
  className?: string;
}

export default function MonetagBanner({
  zoneId,
  minHeight = 100,
  className = "",
}: MonetagBannerProps) {
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current) return;
    if (!zoneId || zoneId.includes("0000000")) return;
    if (typeof window === "undefined") return;

    // Prevent duplicate injection
    const existing = document.querySelector(
      `script[data-monetag-zone="${zoneId}"]`,
    );
    if (existing) {
      injected.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src = "https://inklinkor.com/tag.min.js";
    script.async = true;
    script.setAttribute("data-zone", zoneId);
    script.setAttribute("data-monetag-zone", zoneId);
    script.setAttribute("data-cfasync", "false");

    document.body.appendChild(script);
    injected.current = true;
  }, [zoneId]);

  // Placeholder (dev mode / zone ID not set)
  if (!zoneId || zoneId.includes("0000000")) {
    return (
      <div
        className={`mx-auto my-6 flex w-full max-w-4xl items-center justify-center rounded-lg border border-dashed border-border bg-muted text-xs uppercase tracking-wider text-muted-foreground ${className}`}
        style={{ minHeight }}
      >
        Ad Banner (Monetag)
      </div>
    );
  }

  return (
    <div
      id={`monetag-banner-${zoneId}`}
      className={`mx-auto my-6 flex w-full max-w-4xl items-center justify-center ${className}`}
      style={{ minHeight }}
    >
      {/* Monetag banner will render here */}
    </div>
  );
}
