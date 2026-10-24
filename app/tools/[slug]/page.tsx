import { notFound } from "next/navigation";
import { TOOLS, getTool } from "@/lib/tools";
import ToolRunner from "@/components/ToolRunner";
import JsonLd from "@/components/JsonLd";
import MonetagBanner from "@/components/third-parties/MonetagBanner";
import { SITE, MONETAG, isZoneValid } from "@/lib/site";
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
    openGraph: {
      title: tool.name,
      description: tool.shortDescription,
      url,
      siteName: SITE.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: tool.name,
      description: tool.shortDescription,
    },
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

  // ✅ Client ko sirf serializable metadata bhejein (run function nahi)
  const { run: _run, ...toolMetadata } = tool;
  const metadataForClient: ToolMetadata = toolMetadata;

  // ✅ Banner zone valid hai tab hi render karein
  const bannerZone = isZoneValid(MONETAG.bannerZoneId)
    ? MONETAG.bannerZoneId
    : "";

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      {/* ============ STRUCTURED DATA (SEO) ============ */}
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
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: SITE.url,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Tools",
              item: `${SITE.url}/tools/`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: tool.name,
              item: url,
            },
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

      {/* ============ BREADCRUMB ============ */}
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

      {/* ============ H1 + DESCRIPTION ============ */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {tool.name}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          {tool.description}
        </p>
      </header>

      {/* ============ TOOL RUNNER ============ */}
      <section className="mt-8">
        <ToolRunner toolMetadata={metadataForClient} />
      </section>

      {/* ============ 📢 BANNER AD — Tool ke neeche ============ */}
      {bannerZone && (
        <section className="mt-8">
          <MonetagBanner
            zoneId={bannerZone}
            minHeight={250}
            src={MONETAG.scriptUrl}
          />
        </section>
      )}

      {/* ============ HOW TO USE ============ */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-foreground">
          How to use {tool.name}
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
          {tool.howTo.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="mt-3 space-y-3">
          {tool.faqs.map((f, i) => (
            <details
              key={i}
              className="group rounded-card border border-border bg-background p-4 transition hover:border-primary/40"
            >
              <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground">
                <span>{f.q}</span>
                <span className="ml-2 text-muted-foreground transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ============ RELATED TOOLS (Optional but SEO-friendly) ============ */}
      <RelatedTools currentSlug={tool.slug} category={tool.category} />
    </article>
  );
}

/* ============================================================
   RELATED TOOLS COMPONENT
   Same category ke doosre tools dikhata hai — internal linking
   SEO ke liye bahut achha hai aur bounce rate kam karta hai.
   ============================================================ */
function RelatedTools({
  currentSlug,
  category,
}: {
  currentSlug: string;
  category: string;
}) {
  const related = TOOLS.filter(
    (t) => t.slug !== currentSlug && t.category === category,
  ).slice(0, 3);

  // Agar same category mein 3 se kam tools hain, toh kisi bhi category se bharein
  const fillers =
    related.length < 3
      ? TOOLS.filter(
          (t) => t.slug !== currentSlug && !related.includes(t),
        ).slice(0, 3 - related.length)
      : [];

  const finalRelated = [...related, ...fillers];

  if (finalRelated.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-8">
      <h2 className="text-lg font-semibold text-foreground">Related Tools</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {finalRelated.map((t) => (
          <a
            key={t.slug}
            href={`/tools/${t.slug}/`}
            className="group rounded-card border border-border bg-background p-4 transition hover:border-primary hover:shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded bg-secondary text-xs font-bold text-primary">
                {t.icon}
              </span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary">
                {t.name}
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
              {t.shortDescription}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
