import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { PlatformLogo } from "@/components/platform-logo";
import { type IconLink } from "@/lib/brand-marks";
import { site } from "@/lib/site-data";

const PROFILE_DETAILS: Record<string, { subtitle: string; category: string }> = {
  Trustpilot: { subtitle: "Verified Customer Reviews", category: "Reviews" },
  Clutch: { subtitle: "BPO & Outsourcing Ratings", category: "Ratings" },
  Upwork: { subtitle: "Top Rated Agency Profile", category: "Top Rated" },
  GoodFirms: { subtitle: "Company Directory & Reviews", category: "Directory" },
  G2: { subtitle: "Client Feedback & Ratings", category: "Verified" },
  Linktree: { subtitle: "All Official Company Links", category: "Link Hub" },
};

/**
 * The directory and review listings section on about and contact pages.
 * Displays each platform link with its authentic official website logo.
 */
export function BusinessProfiles({ items = site.profiles }: { items?: IconLink[] }) {
  return (
    <section className="border-y border-border bg-card">
      <div className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow="Verify us"
          title="Where you can check our work"
          description="We are listed and reviewed on the platforms buyers use to vet an outsourcing partner. Every profile below is ours."
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((p) => {
            const details = PROFILE_DETAILS[p.name] ?? {
              subtitle: "Verified Business Listing",
              category: "Platform",
            };

            return (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit our ${p.name} profile`}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-marigold hover:shadow-lg hover:shadow-marigold/5"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-border/60 bg-muted/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-colors group-hover:border-marigold/30 group-hover:bg-marigold/10 group-hover:text-marigold">
                      {details.category}
                    </span>
                    <span className="grid size-7 place-items-center rounded-full border border-border/60 bg-muted/30 text-muted-foreground transition-all group-hover:border-marigold group-hover:bg-marigold group-hover:text-charcoal">
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>

                  {/* Prominent Website Logo */}
                  <div className="mt-5 flex items-center min-h-[40px]">
                    <PlatformLogo name={p.name} className="h-7 sm:h-8 max-w-[150px] w-auto transition-transform duration-300 group-hover:scale-105 origin-left" />
                  </div>
                </div>

                <div className="mt-6 border-t border-border/50 pt-3">
                  <p className="text-xs text-muted-foreground/80 transition-colors group-hover:text-charcoal">
                    {details.subtitle}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
