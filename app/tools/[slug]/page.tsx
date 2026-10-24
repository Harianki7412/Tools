import { notFound } from "next/navigation";
import { TOOLS, getTool } from "@/lib/tools";
import ToolRunner from "@/components/ToolRunner";
import JsonLd from "@/components/JsonLd";
import AdSlot from "@/components/third-parties/AdSlot";
import { SITE, ADSENSE } from "@/lib/site";
import type { ToolMetadata } from "@/lib/types";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const url = `${SITE.url}/tools/${tool.slug}/`;
  return {
    title: `${tool.name} — Free Online Tool`,
    description: tool.shortDescription,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: { title: tool.name, description: tool.shortDescription, url },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const url = `${SITE.url}/tools/${tool.slug}/`;
  const { run: _run, ...toolMetadata } = tool;
  const metadataForClient: ToolMetadata = toolMetadata;

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      {/* Structured data */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: tool.name,
          description: tool.description,
          url,
          applicationCategory: "UtilityApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tool.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
            {
              "@type": "ListItem",
              position: 2,
              name: "Tools",
              item: `${SITE.url}/tools/`,
            },
            { "@type": "ListItem", position: 3, name: tool.name, item: url },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: `How to use ${tool.name}`,
          step: tool.howTo.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            text: s,
          })),
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-muted-foreground">
        <a href="/" className="transition hover:text-primary">
          Home
        </a>{" "}
        /{" "}
        <a href="/tools/" className="transition hover:text-primary">
          Tools
        </a>{" "}
        / <span className="text-foreground">{tool.name}</span>
      </nav>

      {/* H1 + description */}
      <h1 className="text-3xl font-bold text-foreground">{tool.name}</h1>
      <p className="mt-2 text-muted-foreground">{tool.description}</p>

      {/* AD #1: Above tool (leaderboard) */}
      <AdSlot
        client={ADSENSE.publisherId}
        slot={ADSENSE.slots.leaderboardTop}
        format="horizontal"
      />

      {/* Tool itself */}
      <ToolRunner toolMetadata={metadataForClient} />

      {/* AD #2: Below output */}
      <AdSlot
        client={ADSENSE.publisherId}
        slot={ADSENSE.slots.belowOutput}
        format="auto"
      />

      {/* How to use */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">
          How to use {tool.name}
        </h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-muted-foreground">
          {tool.howTo.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="mt-3 space-y-3">
          {tool.faqs.map((f, i) => (
            <details
              key={i}
              className="rounded-card border border-border bg-background p-4"
            >
              <summary className="cursor-pointer font-medium text-foreground">
                {f.q}
              </summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
