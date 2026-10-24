"use client";

import Script from "next/script";

interface MonetagScriptProps {
  zoneId: string;
  src?: string;
}

export default function MonetagScript({
  zoneId,
  src = "https://inklinkor.com/tag.min.js",
}: MonetagScriptProps) {
  // Guard: skip if placeholder or invalid
  if (!zoneId || zoneId.includes("0000000") || !/^\d+$/.test(zoneId)) {
    return null;
  }

  return (
    <Script
      id={`monetag-global-${zoneId}`}
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(a,b,c,d){
            a.src = b;
            a.async = true;
            a.setAttribute('data-zone', c);
            a.setAttribute('data-cfasync', 'false');
            d.appendChild(a);
          })(
            document.createElement('script'),
            '${src}',
            '${zoneId}',
            document.body || document.documentElement
          );
        `,
      }}
    />
  );
}
