import Link from "next/link";
import { ToolMetadata } from "@/lib/types";

export default function ToolCard({ tool }: { tool: ToolMetadata }) {
  return (
    <Link
      href={`/tools/${tool.slug}/`}
      className="group block rounded-card border border-border bg-background p-5 transition hover:border-primary hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-sm font-bold text-primary">
          {tool.icon}
        </span>
        <div>
          <h3 className="font-semibold text-foreground transition group-hover:text-primary">
            {tool.name}
          </h3>
          <p className="text-xs text-muted-foreground">{tool.category}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {tool.shortDescription}
      </p>
    </Link>
  );
}
