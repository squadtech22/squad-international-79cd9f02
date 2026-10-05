import { useState } from "react";
import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
  CheckCircle2,
  Users,
  Clock,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BookingDialog } from "@/components/booking-dialog";
import { CtaBand } from "@/components/cta-band";
import { services, site } from "@/lib/site-data";

/**
 * Service lines whose URLs were once live. They redirect rather than 404, to the
 * closest current service where there is one and to the services index where the
 * capability has no successor.
 *
 * The first three date from the rename of the original delivery lines. The last
 * two come from the move to four services: e-commerce support became part of
 * customer support and keeps a direct equivalent, while bookkeeping was dropped
 * as a service line and has nowhere specific to send a visitor.
 */
const RETIRED_SLUGS = new Map<string, string>([
  ["dedicated-team-support", "/services"],
  ["operational-management", "/services"],
  ["growth-support", "/services"],
  ["ecommerce-customer-support", "/services/customer-support"],
  ["accounting-bookkeeping", "/services"],
]);

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) {
      const retiredTarget = RETIRED_SLUGS.get(params.slug);
      if (retiredTarget) throw redirect({ to: retiredTarget, statusCode: 301 });
      throw notFound();
    }
    return service;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
        { title: `${loaderData.title} | Squad International Services` },
        { name: "description", content: loaderData.short },
        { property: "og:title", content: `${loaderData.title} | Squad International` },
        { property: "og:description", content: loaderData.short },
        { property: "og:image", content: `${site.url}/og-image.jpg` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: `${site.url}/og-image.jpg` },
      ]
      : [],
  }),
  component: ServiceDetail,
});

function ServiceDetail() {
  const service = Route.useLoaderData();
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  /*
   * Which pricing model the panel is showing, by index: the list is short and
   * ordered, and the first entry is the one to land on. Falls back to the first
   * so the panel still reads if the index ever outruns the list.
   */
  const [priceModel, setPriceModel] = useState(0);
  const models = service.pricing ?? [];
  const price = models[priceModel] ?? models[0];
  /*
   * A model without a numeral is a basis rather than a figure, e.g. a share of
   * collections. Display type would make that read as a missing number, and
   * "Starting from" is the wrong label for it.
   */
  const priceIsFigure = price ? /\d/.test(price.amount) : false;

  return (
    <>
      <section className="relative overflow-hidden bg-offwhite">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-marigold/15 blur-3xl"
        />
        <div className="container-page relative flex flex-col items-center pb-24 pt-40 text-center md:pb-28 md:pt-44">
          <Breadcrumbs
            parent="/services"
            parentLabel="Services"
            current={service.title}
            tone="light"
            center
          />
          <h1 className="mt-6 max-w-4xl text-5xl leading-[0.92] tracking-tight text-charcoal md:text-7xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {service.summary}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <BookingDialog>
              <Button variant="marigold" size="lg">
                <CalendarDays /> Book a Meeting
              </Button>
            </BookingDialog>
            <Button variant="outlineDark" size="lg" asChild>
              <a href={site.whatsapp} target="_blank" rel="noreferrer">
                <MessageCircle /> Chat With Us
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="container-page grid gap-8 py-10 sm:grid-cols-3">
          {service.outcomes.map((o) => (
            <div key={o} className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-marigold" />
              <p className="text-sm font-medium text-charcoal">{o}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-14 py-20 lg:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div>
          <h2 className="text-3xl text-charcoal">What the team handles</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {service.capabilities.map((c) => (
              <li
                key={c}
                className="rounded-md border border-border bg-card px-5 py-4 text-sm text-charcoal"
              >
                {c}
              </li>
            ))}
          </ul>

          <h2 className="mt-16 text-3xl text-charcoal">Tools we work in</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            The team works inside your stack, not a portal of ours. These are the platforms this
            service is most often delivered on — if yours is not listed, we train on it.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {service.tools.map((t) => (
              <li
                key={t}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-charcoal"
              >
                {t}
              </li>
            ))}
          </ul>

          <h2 className="mt-16 text-3xl text-charcoal">How we deliver it</h2>
          <ol className="mt-8 space-y-6">
            {service.process.map((p, idx) => (
              <li key={p.step} className="flex gap-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-charcoal font-display text-lg text-marigold">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="text-lg text-charcoal">{p.step}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="h-fit rounded-lg border border-border bg-card p-8 lg:sticky lg:top-28">
          {/*
            Only where the line is sold on more than one basis, which today is
            medical billing alone. A radiogroup rather than tabs: it chooses how
            one figure below is expressed, it does not swap panels.
          */}
          {models.length > 1 && (
            <div className="mb-7">
              <span
                id="pricing-model-label"
                className="text-xs uppercase tracking-[0.18em] text-muted-foreground"
              >
                Pricing model
              </span>
              <div
                role="radiogroup"
                aria-labelledby="pricing-model-label"
                className="mt-3 grid grid-cols-2 gap-1 rounded-full border border-border bg-muted/60 p-1"
              >
                {models.map((m, i) => (
                  <button
                    key={m.label}
                    type="button"
                    role="radio"
                    aria-checked={i === priceModel}
                    onClick={() => setPriceModel(i)}
                    className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${i === priceModel
                        ? "bg-marigold text-charcoal"
                        : "text-muted-foreground hover:text-charcoal"
                      }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <h2 className="text-xl text-charcoal">Typical engagement</h2>
          <dl className="mt-5 space-y-4">
            {price && (
              <div className="flex gap-3">
                <Wallet className="mt-0.5 size-4 shrink-0 text-marigold" />
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {priceIsFigure ? "Starting from" : "Billed as"}
                  </dt>
                  <dd className="mt-1 text-sm text-charcoal">
                    {priceIsFigure ? (
                      <>
                        <span className="font-display text-2xl leading-none text-charcoal">
                          {price.amount}
                        </span>{" "}
                        {price.unit && <span className="text-muted-foreground">{price.unit}</span>}
                      </>
                    ) : (
                      <span className="font-semibold text-charcoal">{price.amount}</span>
                    )}
                  </dd>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{price.note}</p>
                </div>
              </div>
            )}
            {service.facts.map((f, i) => {
              /* Two facts, so the pair keeps the icons the fixed rows used. */
              const Icon = i === 0 ? Users : Clock;
              return (
                <div key={f.label} className="flex gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-marigold" />
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {f.label}
                    </dt>
                    <dd className="mt-1 text-sm text-charcoal">{f.value}</dd>
                  </div>
                </div>
              );
            })}
          </dl>

          <h2 className="mt-8 border-t border-border pt-6 text-xl text-charcoal">Ideal for</h2>
          <ul className="mt-5 space-y-3">
            {service.idealFor.map((i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-marigold" />
                {i}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-border pt-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Not sure which shape fits? A 30-minute call is usually enough to size the team.
            </p>
            <BookingDialog>
              <Button variant="marigold" className="mt-5 w-full" size="lg">
                <CalendarDays /> Book a Meeting
              </Button>
            </BookingDialog>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <h3 className="text-sm tracking-[0.18em] text-marigold">Other services</h3>
            <ul className="mt-4 space-y-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: o.slug }}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-charcoal hover:text-marigold"
                  >
                    {o.title} <ArrowRight className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <CtaBand title={`Let's scope your ${service.title.toLowerCase()} team`} />
    </>
  );
}
