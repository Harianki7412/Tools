"use client";

import Script from "next/script";

export default function MonetagBanner({ zoneId }: { zoneId: string }) {
  if (!zoneId || zoneId.includes("0000000")) return null;

  return (
    <div className="ad-container my-6">
      <Script
        id={`monetag-banner-${zoneId}`}
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
              document.getElementById('monetag-slot-${zoneId}') || document.body
            );
          `,
        }}
      />
      <div id={`monetag-slot-${zoneId}`} />
    </div>
  );
}
