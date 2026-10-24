import Link from "next/link";
import { SITE } from "@/lib/site";
import { TOOLS } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-semibold text-foreground">{SITE.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Free browser-based utility tools. No signup, no uploads —
              everything runs on your device.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Popular Tools
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {TOOLS.slice(0, 5).map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/tools/${t.slug}/`}
                    className="transition hover:text-primary"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">About</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Made with Next.js. Runs 100% client-side.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              © 2026 {SITE.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
