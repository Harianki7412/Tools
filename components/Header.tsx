import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-foreground"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            T
          </span>
          {SITE.name}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/tools/"
            className="text-muted-foreground transition hover:text-foreground"
          >
            All Tools
          </Link>
          <Link
            href="/tools/pdf-merger/"
            className="rounded-button bg-primary px-3 py-1.5 font-medium text-primary-foreground transition hover:bg-primary-hover"
          >
            Popular
          </Link>
        </nav>
      </div>
    </header>
  );
}
