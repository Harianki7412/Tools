"use client";

import Script from "next/script";

interface MonetagScriptProps {
  zoneId: string;
}

export default function MonetagScript({ zoneId }: MonetagScriptProps) {
  // Agar zoneId placeholder hai to script load na karein
  if (!zoneId || zoneId.includes("0000000")) {
    return null;
  }

  return (
    <Script
      id="monetag-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(a,b,c,d){
            a.src = b;
            a.setAttribute('data-zone', c);
            d.appendChild(a);
          })(
            document.createElement('script'),
            'https://inklinkor.com/tag.min.js',
            '${zoneId}',
            document.body || document.documentElement
          );
        `,
      }}
    />
  );
}
