import Script from "next/script";

export default function GoogleAdsense({ pId }: { pId: string }) {
  if (!pId || pId.includes("0000000000")) {
    // Skip loading in dev or with placeholder
    return null;
  }
  return (
    <Script
      async
      id="adsbygoogle-init"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
