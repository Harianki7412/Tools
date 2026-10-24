import ToolCard from "@/components/ToolCard";
import { TOOLS } from "@/lib/tools";

export const metadata = {
  title: "All Tools",
  description: "Browse all free online utility tools.",
};

export default function ToolsIndex() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900">All Tools</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </section>
  );
}