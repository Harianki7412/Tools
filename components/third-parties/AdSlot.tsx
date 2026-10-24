"use client";
import { useEffect, useRef } from "react";

interface AdSlotProps {
  client: string;
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  layout?: string;
  className?: string;
}

export default function AdSlot({
  client,
  slot,
  format = "auto",
  layout,
  className = "",
}: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    if (!client || !slot) return;
    if (client.includes("0000000000") || slot.includes("0000000000")) {
      // Dev/placeholder — do nothing
      return;
    }
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      console.error("AdSense push failed:", e);
    }
  }, [client, slot]);

  // Placeholder visual (dev / not approved yet)
  if (!client || !slot || client.includes("0000000000")) {
    return (
      <div
        className={`ad-container text-xs uppercase tracking-wider text-muted-foreground ${className}`}
      >
        Ad Space
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive="true"
      />
    </div>
  );
}
