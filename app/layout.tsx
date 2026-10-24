import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MonetagScript from "@/components/third-parties/MonetagScript";
import { SITE, MONETAG } from "@/lib/site";

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
  return (
    <html lang="en">
      <body>
        <Header />
        <meta name="monetag" content="4aa723a2e244527c14c398beb7136e25"></meta>
        <main className="min-h-[60vh]">{children}</main>
        <Footer />

        {/* Monetag Script — Zone ID apne dashboard se daalein */}
        <MonetagScript zoneId={MONETAG.globalZoneId} />
      </body>
    </html>
  );
}
