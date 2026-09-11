import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PageHero } from "@/components/site/PageHero";

export const metadata: Metadata = {
  title: "Credits",
  description: "Photo credits and licenses for Boulder County Dryer Vent city page imagery.",
};

export default function CreditsPage() {
  let attribution = "";
  try {
    attribution = readFileSync(join(process.cwd(), "CREDITS.md"), "utf8");
  } catch {
    attribution = "See CREDITS.md in the repository.";
  }

  return (
    <>
      <PageHero
        kicker="Credits"
        title="Photo credits"
        lede="City page heroes are licensed local scenery — not dryer-vent job photos."
      />
      <section className="site-wrap py-12">
        <pre className="card overflow-x-auto whitespace-pre-wrap p-6 text-sm leading-relaxed text-charcoal-800">
          {attribution}
        </pre>
      </section>
    </>
  );
}
