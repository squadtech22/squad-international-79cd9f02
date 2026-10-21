import { ServiceLink } from "@/components/service-link";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/booking-dialog";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { services, site } from "@/lib/site-data";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Outsourcing Services | Squad International" },
      {
        name: "description",
        content:
          "Explore BPO, Medical Billing & RCM, Dedicated Team & Virtual Assistance, custom software and mobile apps, website development, and AI development and workflow automation.",
      },
      { property: "og:title", content: "Outsourcing Services | Squad International" },
      {
        property: "og:description",
        content: "Flexible support, built around your business.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Flexible support. Built around your business."
        description="Explore Business Process Outsourcing (BPO), Medical Billing & RCM, Dedicated Team & Virtual Assistance, Custom Software and Mobile App Development, Website Design & Development, and AI Development & Workflow Automation. Build the operational capacity and technology your business needs."
      >
        <BookingDialog>
          <Button variant="marigold" size="lg">
            <CalendarDays /> Book a Free Consultation
          </Button>
        </BookingDialog>
      </PageHero>

      <section className="container-page py-20 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s, index) => (
            <article
              key={s.slug}
              className="flex flex-col rounded-lg border border-border bg-card p-8 card-pop hover:border-marigold hover:shadow-[var(--shadow-elevated)]"
            >
              <span className="text-xs uppercase tracking-[0.18em] text-marigold">
                Service {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 text-2xl text-charcoal">{s.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.pitch}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {s.offerings.map((h) => (
                  <li
                    key={h}
                    className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-charcoal"
                  >
                    {h}
                  </li>
                ))}
              </ul>
              <dl className="mt-6 grid flex-1 gap-3 border-t border-border pt-5 text-sm sm:grid-cols-2">
                {s.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {f.label}
                    </dt>
                    <dd className="mt-1 text-charcoal">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8">
                <Button variant="charcoal" asChild>
                  <ServiceLink service={s}>
                    View service <ArrowRight />
                  </ServiceLink>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-dark py-20 md:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Next step"
            title="You stay focused on the business. We help keep the work moving."
            description="Tell us where your business needs support. We'll help you build the right outsourced team around your workflow — giving you more capacity while keeping operating costs under control."
            tone="light"
          />
          <div className="mt-10 flex flex-wrap gap-3">
            <BookingDialog>
              <Button variant="marigold" size="lg">
                <CalendarDays /> Book a Free Consultation
              </Button>
            </BookingDialog>
            <Button variant="outlineLight" size="lg" asChild>
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
