import ToolCard from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools";
import { SITE, MONETAG } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import MonetagBanner from "@/components/third-parties/MonetagBanner";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: SITE.url,
          description: SITE.description,
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-14 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Free Online Utility Tools
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Fast, private, browser-based tools. No signup, no uploads — everything
          runs on your device.
        </p>
      </section>

      {/* 📢 Banner Ad — hero ke neeche, tools grid se upar */}
      <div className="mx-auto max-w-6xl px-4">
        <MonetagBanner zoneId={MONETAG.bannerZoneId} minHeight={100} />
      </div>

      {/* Tools Grid */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          All Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>
    </>
  );
}
