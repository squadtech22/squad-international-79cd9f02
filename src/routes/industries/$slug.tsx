import { ServiceLink } from "@/components/service-link";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BookingDialog } from "@/components/booking-dialog";
import { CtaBand } from "@/components/cta-band";
import { industries, services, caseStudies, site } from "@/lib/site-data";

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    const industry = industries.find((i) => i.slug === params.slug);
    if (!industry) throw notFound();
    return industry;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} Outsourcing Services | Squad International` },
          { name: "description", content: loaderData.short },
          { property: "og:title", content: `${loaderData.name} Outsourcing | Squad International` },
          { property: "og:description", content: loaderData.short },
        ]
      : [],
  }),
  component: IndustryDetail,
});

function IndustryDetail() {
  const industry = Route.useLoaderData();
  const related = caseStudies.filter((c) => c.industry === industry.name);

  return (
    <>
      <section className="surface-dark">
        <div className="container-page pb-20 pt-36 md:pb-24 md:pt-40">
          <Breadcrumbs parent="/industries" parentLabel="Industries" current={industry.name} />
          <h1 className="mt-5 max-w-4xl text-4xl md:text-6xl">{industry.name}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-offwhite/70 md:text-lg">
            {industry.short}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {industry.metrics.map((m) => (
              <div key={m.label} className="rounded-md border border-offwhite/10 bg-offwhite/[0.04] p-5">
                <p className="font-display text-3xl text-marigold">{m.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-offwhite/60">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-10 py-20 md:grid-cols-2 md:py-24">
        <div className="rounded-lg border border-border bg-card p-8">
          <h2 className="text-2xl text-charcoal">What usually goes wrong</h2>
          <ul className="mt-6 space-y-4">
            {industry.challenges.map((c) => (
              <li key={c} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive/70" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-marigold/40 bg-accent/40 p-8">
          <h2 className="text-2xl text-charcoal">How we solve it</h2>
          <ul className="mt-6 space-y-4">
            {industry.solutions.map((s) => (
              <li key={s} className="flex gap-3 text-sm leading-relaxed text-charcoal">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-marigold" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-card py-16">
          <div className="container-page">
            <h2 className="text-2xl text-charcoal">Related case study</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  to="/case-studies/$slug"
                  params={{ slug: c.slug }}
                  className="rounded-lg border border-border bg-background p-7 card-pop hover:border-marigold hover:shadow-[var(--shadow-elevated)]"
                >
                  <span className="eyebrow">{c.service}</span>
                  <h3 className="mt-3 text-lg text-charcoal">{c.client}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.challenge}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-20 md:py-24">
        <h2 className="text-2xl text-charcoal">Services commonly deployed here</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {services.map((s) => (
            <ServiceLink
              key={s.slug}
              service={s}
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-marigold hover:text-marigold"
            >
              {s.title}
            </ServiceLink>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <BookingDialog>
            <Button variant="charcoal" size="lg">
              <CalendarDays /> Book a Meeting
            </Button>
          </BookingDialog>
          <Button variant="outlineDark" size="lg" asChild>
            <a href={site.whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle /> Chat With Us
            </a>
          </Button>
        </div>
      </section>

      <CtaBand title={`Talk to us about ${industry.name.toLowerCase()} operations`} />
    </>
  );
}
