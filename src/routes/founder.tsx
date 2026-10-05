import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/booking-dialog";
import founderPhoto from "@/assets/haider-ali.jpg";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site-data";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      { title: `${site.founder.name}, ${site.founder.role} | ${site.name}` },
      { name: "description", content: site.founder.summary },
      {
        property: "og:title",
        content: `${site.founder.name}, ${site.founder.role} | ${site.name}`,
      },
      { property: "og:description", content: site.founder.summary },
      { property: "og:type", content: "profile" },
    ],
    /**
     * A Person in its own right, pointing back at the Organization the root
     * declares. The root already names him as its founder; this says the same
     * from his side, so the two resolve to one entity rather than two.
     */
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": `${site.url}/founder#person`,
          name: site.founder.name,
          jobTitle: site.founder.role,
          description: site.founder.summary,
          url: `${site.url}/founder`,
          worksFor: { "@id": `${site.url}/#organization` },
          sameAs: site.founder.profiles.map((p) => p.url),
        }),
      },
    ],
  }),
  component: FounderPage,
});

function FounderPage() {
  return (
    <>
      <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-charcoal pt-24 pb-8 lg:min-h-screen lg:pt-24 lg:pb-8 xl:pt-28 xl:pb-10">
        {/* Background Editorial Image */}
        <div className="absolute inset-0 z-0 flex justify-end">
          <div className="relative h-full w-full lg:w-3/5">
            <img
              src={founderPhoto}
              alt=""
              className="h-full w-full object-cover grayscale opacity-30 mix-blend-luminosity lg:opacity-50"
            />
            {/* Gradients to blend the image seamlessly into the charcoal background */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal lg:bg-gradient-to-r lg:from-charcoal lg:via-charcoal/60 lg:to-transparent" />
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-charcoal/40 to-transparent hidden lg:block" />
          </div>
        </div>

        <div className="container-page relative z-10 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 xl:col-span-7">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-8 bg-marigold" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-marigold sm:text-xs">
                Leadership
              </span>
            </div>

            <h1 className="font-display text-6xl leading-[0.85] tracking-tight text-offwhite sm:text-7xl lg:text-8xl xl:text-[6.25rem]">
              {site.founder.name}
            </h1>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-offwhite/60 sm:text-sm">
              {site.founder.role}
            </p>

            <blockquote className="my-5 border-l-2 border-marigold pl-5 text-xl font-light italic leading-snug text-offwhite sm:text-2xl lg:text-2xl xl:text-[1.85rem]">
              "The right team gives a business capacity without forcing it to build every function internally."
            </blockquote>

            <div className="prose prose-invert max-w-none">
              <div className="space-y-2.5 text-xs leading-relaxed text-offwhite/75 sm:text-[13.5px] lg:text-[14.5px]">
                {site.founder.bio.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-offwhite/10 pt-4">
              {site.founder.profiles.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-offwhite/20 bg-offwhite/5 px-4 py-1.5 text-xs font-medium text-offwhite transition-all hover:border-marigold hover:bg-marigold hover:text-charcoal hover:shadow-[var(--shadow-marigold)] sm:px-5 sm:py-2"
                >
                  {p.name}
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Next step"
            title="Talk to the team he built"
            description="Tell us what needs covering and we will come back with a proposed team shape."
          />
          <div className="mt-10 flex flex-wrap gap-4">
            <BookingDialog>
              <Button variant="marigold" size="xl">
                <CalendarDays /> Book a Free Consultation
              </Button>
            </BookingDialog>
            <Button variant="outlineDark" size="xl" asChild>
              <a href={site.whatsapp} target="_blank" rel="noreferrer">
                <MessageCircle /> WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
