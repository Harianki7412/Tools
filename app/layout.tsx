import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MonetagScript from "@/components/third-parties/MonetagScript";
import { SITE, MONETAG, isZoneValid } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", site: SITE.twitter },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalZone = isZoneValid(MONETAG.globalZoneId)
    ? MONETAG.globalZoneId
    : "";

  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />

        {/* Global Multitag — only loads if zone ID is set and valid */}
        {globalZone && (
          <MonetagScript zoneId={globalZone} src={MONETAG.scriptUrl} />
        )}
      </body>
    </html>
  );
}
