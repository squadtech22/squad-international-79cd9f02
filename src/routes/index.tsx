import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Users,
  LineChart,
  Workflow,
  TrendingUp,
  Wallet,
  Gauge,
  Layers,
  Handshake,
  Headset,
} from "lucide-react";
import heroImage from "@/assets/hero-operations.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import { assetUrl } from "@/lib/asset-url";
import teamImage from "@/assets/team-about.jpg";
import whySquadImage from "@/assets/why-squad-analytics.jpg";
import industriesImage from "@/assets/industries-operations.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/booking-dialog";
import { CtaBand } from "@/components/cta-band";
import { GoogleReviews } from "@/components/google-reviews";
import { ClientSpotlight } from "@/components/client-spotlight";
import { FeatureSplit, FlowMedia, OrbitMedia } from "@/components/feature-split";
import { ClientLogos } from "@/components/client-logos";

import { SectionHeading } from "@/components/section-heading";
import { StatValue } from "@/components/stat-value";
import { ServiceIcon } from "@/lib/service-icons";
import { services, industries, caseStudies, stats, faqs, site } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Squad International | Your Business Companion" },
      {
        name: "description",
        content:
          "Scale your business with dedicated offshore teams for customer support, lead generation, virtual assistance and back-office ops. Trusted since 2019.",
      },
      {
        property: "og:title",
        content: "Squad International | Your Business Companion",
      },
      {
        property: "og:description",
        content:
          "Scale your business with dedicated offshore teams for customer support, lead generation, virtual assistance and back-office ops. Trusted since 2019.",
      },
    ],
  }),
  component: Home,
});

/**
 * Flip to true once genuine, verified client results replace the placeholder
 * figures the copy deck flagged (11-minute response, 93% CSAT, $2.4M pipeline
 * and the rest).
 */
const SHOW_CASE_STUDIES = false;

const bpoBenefits = [
  {
    icon: Wallet,
    title: "Lower operating costs",
    body: "Add support without carrying the full overhead of building every function in-house.",
  },
  {
    icon: Gauge,
    title: "Greater efficiency",
    body: "Move repetitive, process-driven work off your core team so they can focus on priorities.",
  },
  {
    icon: Layers,
    title: "More capacity",
    body: "Add dedicated resources as your workload, customer base and business requirements grow.",
  },
];

const differentiators = [
  {
    icon: Workflow,
    title: "Built around your business",
    body: "We tailor teams, workflows and responsibilities so your support fits the way the business already runs day to day.",
  },
  {
    icon: TrendingUp,
    title: "Flexible scaling",
    body: "Start with the support you need today and scale your team as your workload, customer base and requirements grow.",
  },
  {
    icon: Users,
    title: "Dedicated & reliable teams",
    body: "Your work is handled by dedicated people who understand your processes, follow your standards and deliver consistent support.",
  },
  {
    icon: Handshake,
    title: "Partnership mindset",
    body: "We work as an extension of your team, taking on your priorities and helping keep the whole business moving forward.",
  },
  {
    icon: Headset,
    title: "Customer & operational support",
    body: "We take on repetitive, process-driven work that consumes internal time, while holding consistency and accountability.",
  },
  {
    icon: LineChart,
    title: "Growth support",
    body: "From prospecting and lead generation to follow-ups and appointment setting, our teams keep your pipeline moving.",
  },
];

function Home() {
  return (
    <>
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-charcoal">
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0">
          <video
            src={assetUrl(heroVideo)}
            poster={heroImage}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Offshore support agents working on an operations floor"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/90 via-charcoal/60 to-charcoal" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl px-6 pb-20 pt-32 text-center md:pt-36">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-marigold" />
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-marigold">
              {site.tagline}
            </span>
            <div className="h-px w-8 bg-marigold" />
          </div>

          {/*
            "Built Around Your Business." is kept on one line from md up, which caps
            the type size: at 128px the line needs 1340px and no viewport can give it
            that, so the steps below are the largest that still fit their breakpoint.
            Phones are too narrow for it at any readable size and wrap as before.
          */}
          <h1 className="font-display text-5xl uppercase leading-none tracking-tight text-offwhite md:text-6xl lg:text-7xl xl:text-8xl">
            Dedicated Teams. <br /> Built Around{" "}
            <span className="text-marigold">Your Business.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg font-light leading-relaxed text-offwhite/70 md:text-xl">
            Scale your business with reliable outsourced support built around your workflow, so you
            can increase capacity, reduce operating costs and keep your internal team focused.
          </p>

          <div className="mt-10 flex justify-center">
            <BookingDialog>
              <Button variant="marigold" size="xl" className="uppercase tracking-widest">
                <CalendarDays /> Book a Free Consultation
              </Button>
            </BookingDialog>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] uppercase tracking-[0.5em] text-offwhite">Scroll</span>
          <div className="h-12 w-px bg-marigold" />
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="container-page grid grid-cols-2 gap-8 py-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-4xl text-charcoal">
                <StatValue value={s.value} />
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <ClientLogos />

      <section className="container-page py-20 md:py-28">
        <SectionHeading
          eyebrow="Why businesses choose BPO"
          title="Lower costs. Greater efficiency. More capacity."
        />
        <div className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          <p>
            Building every business function internally can quickly increase payroll, management
            workload and operating costs. Outsourcing gives businesses a more flexible way to add
            the people and support they need while keeping internal overhead under control.
          </p>
          <p>
            Squad International helps you move suitable customer-facing, administrative and
            operational work to dedicated resources, without losing consistency, accountability or
            visibility.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {bpoBenefits.map((b) => (
            <div
              key={b.title}
              className="rounded-lg border border-border bg-card p-7 card-pop hover:border-marigold hover:shadow-[var(--shadow-elevated)]"
            >
              <b.icon className="size-7 text-marigold" />
              <h3 className="mt-5 text-lg text-charcoal">{b.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="What we do"
            title="Capabilities you can switch on"
            description="Four service lines built around the way your business works."
          />
          <Button variant="outlineDark" asChild>
            <Link to="/services">
              All services <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group flex flex-col rounded-lg border border-border bg-card p-7 card-pop hover:border-marigold hover:shadow-[var(--shadow-elevated)]"
            >
              {/*
                Reserve the tallest wrap the two-column layout produces, a two-line
                title over four lines of copy, so every row is the same height
                wherever each string happens to break. Character counts alone cannot
                do this: two of these summaries are the same length and still wrap
                differently. The icon shares the title's line and narrows it, which
                this reservation already absorbs. From xl the container stops growing
                and every card settles at one title line over three, which is what
                these reset to.
              */}
              <h3 className="flex items-start gap-2.5 text-xl text-charcoal md:min-h-14 xl:min-h-7">
                <ServiceIcon slug={s.slug} className="mt-1 size-5 shrink-0 text-marigold" />
                <span>{s.title}</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:min-h-[calc(4*1.625em)] xl:min-h-[calc(3*1.625em)]">
                {s.short}
              </p>
              <ul className="mt-5 flex flex-1 flex-wrap content-start gap-2">
                {s.offerings.map((h) => (
                  <li
                    key={h}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-charcoal"
                  >
                    {h}
                  </li>
                ))}
              </ul>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-charcoal group-hover:text-marigold">
                View service <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <figure className="group relative h-64 overflow-hidden rounded-xl md:h-72">
            <img
              src={heroImage}
              alt="Support specialists collaborating in an operations centre"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/90 to-transparent px-6 pb-6 pt-16 text-sm font-medium text-offwhite">
              Teams trained in your tools and workflows
            </figcaption>
          </figure>
          <figure className="group relative h-64 overflow-hidden rounded-xl md:h-72">
            <img
              src={teamImage}
              alt="Dedicated team members collaborating on client work"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/90 to-transparent px-6 pb-6 pt-16 text-sm font-medium text-offwhite">
              Named specialists accountable to your outcomes
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="surface-dark py-20 md:py-28">
        <div className="container-page">
          {/* Same proportions and figure height as the Industries section below. */}
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.85fr]">
            <SectionHeading
              eyebrow="Why Squad"
              title="Outsourcing without the usual trade-offs"
              description="The reason clients stay with us is simple and deliberate: dependable people, clear responsibilities and consistent execution. We build support around your business instead of forcing your business into a fixed outsourcing model."
              tone="light"
            />
            <figure className="relative h-48 overflow-hidden rounded-xl border border-offwhite/10 md:h-56">
              <img
                src={whySquadImage}
                alt="A Squad analytics team reviewing performance dashboards in a glass-walled office"
                loading="lazy"
                className="h-full w-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/20 to-transparent" />
              <figcaption className="absolute bottom-6 left-6 max-w-xs text-lg leading-snug text-offwhite">
                Clear ownership, visible quality and reporting that holds up.
              </figcaption>
            </figure>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((d) => (
              <div
                key={d.title}
                className="card-pop rounded-lg border border-offwhite/10 bg-offwhite/[0.04] p-7 hover:border-marigold/60 hover:bg-offwhite/[0.07]"
              >
                <d.icon className="size-7 text-marigold" />
                <h3 className="mt-5 text-lg text-offwhite">{d.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-offwhite/65">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeatureSplit
        eyebrow="Our process"
        title="From business needs to business impact"
        description="A simple, structured process designed to make outsourcing easy."
        actions={
          <BookingDialog>
            <Button variant="marigold" size="lg">
              <CalendarDays /> Book a Meeting
            </Button>
          </BookingDialog>
        }
        media={
          <FlowMedia
            steps={[
              { label: "01 Discover", value: "Understand your needs" },
              { label: "02 Design", value: "Build your solution" },
              { label: "03 Deploy", value: "Build your team" },
              { label: "04 Deliver", value: "Execute & manage" },
              { label: "05 Scale", value: "Grow with your business" },
            ]}
          />
        }
      />

      <FeatureSplit
        tone="muted"
        reverse
        eyebrow="Built around you"
        title="A dedicated team built around your workflow"
        description="We structure dedicated resources around the functions your business needs, giving you additional capacity without having to build every role internally."
        bullets={[
          "Dedicated resources: built around your specific business requirements",
          "Your processes: your team works around your workflows, tools and standards",
          "Flexible scaling: add or adjust support as your requirements change",
        ]}
        actions={
          <Button variant="outlineDark" size="lg" asChild>
            <Link to="/services">
              Explore services <ArrowRight />
            </Link>
          </Button>
        }
        media={
          <OrbitMedia
            center="Example Team Structure"
            roles={[
              "Support Agent",
              "Team Lead",
              "QA Analyst",
              "Virtual Assistant",
              "SDR",
              "Back Office",
            ]}
          />
        }
      />

      <ClientSpotlight />

      <section className="container-page py-20 md:py-28">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.85fr]">
          <SectionHeading
            eyebrow="Industries"
            title="Operating knowledge, not generic scripts"
            description="Every industry has different workflows, customer expectations and operational demands. We build support around the realities of your industry while adapting the team to the way your business works."
          />
          <figure className="relative h-48 overflow-hidden rounded-xl md:h-56">
            <img
              src={industriesImage}
              alt="An operations floor with dashboards and sector set-ups for healthcare, retail and industrial work"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/35" />
          </figure>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((i) => (
            <Link
              key={i.slug}
              to="/industries/$slug"
              params={{ slug: i.slug }}
              className="group rounded-lg border border-border bg-card p-7 card-pop hover:border-marigold hover:shadow-[var(--shadow-elevated)]"
            >
              <h3 className="text-lg text-charcoal group-hover:text-marigold">{i.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{i.tagline}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <Button variant="outlineDark" asChild>
            <Link to="/industries">
              Explore industries <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      {/*
        Case studies are hidden per the landing page copy deck, which names the exact
        figures and says not to publish them: "Remove or temporarily hide the
        case-study cards until verified Squad International client results are
        provided." The data still lives in site-data and /case-studies still renders
        it, so restoring this section is a matter of deleting this guard once the
        results are verified.
      */}
      {SHOW_CASE_STUDIES && (
        <section className="bg-card py-20 md:py-28">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Proof"
                title="Results our clients can point at"
                description="Three engagements, three very different problems."
              />
              <Button variant="outlineDark" asChild>
                <Link to="/case-studies">
                  All case studies <ArrowRight />
                </Link>
              </Button>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {caseStudies.map((c) => (
                <Link
                  key={c.slug}
                  to="/case-studies/$slug"
                  params={{ slug: c.slug }}
                  className="group flex flex-col rounded-lg border border-border bg-background p-7 card-pop hover:border-marigold hover:shadow-[var(--shadow-elevated)]"
                >
                  <span className="eyebrow">{c.industry}</span>
                  <h3 className="mt-3 text-lg text-charcoal">{c.client}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {c.challenge}
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5">
                    {c.results.map((r) => (
                      <div key={r.label}>
                        <p className="font-display text-xl text-marigold">{r.value}</p>
                        <p className="mt-1 text-[11px] leading-tight text-muted-foreground">
                          {r.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="FAQs"
            title="Questions before you outsource?"
            description="If yours isn't here, the FAQ page goes deeper, or just ask us directly."
          />
          {/*
            Collapsed by default, matching /faqs so the two behave the same. Because
            an answer is now opened deliberately rather than sitting open, each item
            carries the whole answer instead of the first paragraph the static list
            was limited to.

            The first item is open on load so the section does not read as four bare
            headings with nothing under them.
          */}
          <div className="border-t border-border">
            <Accordion type="single" collapsible defaultValue="faq-0">
              {faqs.slice(0, 4).map((f, index) => (
                <AccordionItem key={f.q} value={`faq-${index}`} className="border-border">
                  <AccordionTrigger className="py-5 text-left text-base text-charcoal hover:text-marigold">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {f.a.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="py-6">
              <Button variant="outlineDark" asChild>
                <Link to="/faqs">
                  View all FAQs <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <GoogleReviews />

      <CtaBand
        title="Ready to add capacity without adding the overhead?"
        description="Tell us where your business needs support. Book a 30-minute discovery call or message us on WhatsApp to discuss your workload, current challenges and where outsourcing could make the biggest difference."
      />
    </>
  );
}
