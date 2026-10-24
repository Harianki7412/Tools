"use client";

import { useEffect, useRef, useState } from "react";

interface MonetagBannerProps {
  zoneId: string;
  minHeight?: number;
  className?: string;
  src?: string;
}

export default function MonetagBanner({
  zoneId,
  minHeight = 250,
  className = "",
  src = "https://inklinkor.com/tag.min.js",
}: MonetagBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);
  const [status, setStatus] = useState<"idle" | "loaded" | "error">("idle");

  const zoneValid =
    zoneId && !zoneId.includes("0000000") && /^\d+$/.test(zoneId);

  useEffect(() => {
    if (!zoneValid) return;
    if (injected.current) return;
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
    script.src = src;
    script.async = true;
    script.setAttribute("data-zone", zoneId);
    script.setAttribute("data-monetag-zone", zoneId);
    script.setAttribute("data-cfasync", "false");
    script.onload = () => setStatus("loaded");
    script.onerror = () => setStatus("error");

    document.body.appendChild(script);
    injected.current = true;
  }, [zoneId, zoneValid, src]);

  // Dev mode / placeholder preview
  if (!zoneValid) {
    return (
      <div
        className={`mx-auto my-6 flex w-full max-w-4xl flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted text-xs uppercase tracking-wider text-muted-foreground ${className}`}
        style={{ minHeight }}
      >
        <span>Monetag Banner</span>
        <span className="text-[10px] normal-case tracking-normal">
          (set NEXT_PUBLIC_MONETAG_BANNER_ZONE in .env.local)
        </span>
      </div>
    );
  }

  return (
    <div className={`relative mx-auto my-6 w-full max-w-4xl ${className}`}>
      <div
        ref={containerRef}
        id={`monetag-banner-${zoneId}`}
        className="flex w-full items-center justify-center overflow-hidden rounded-lg"
        style={{ minHeight }}
      />
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-muted text-xs text-red-500">
          Ad failed to load
        </div>
      )}
    </div>
  );
}
