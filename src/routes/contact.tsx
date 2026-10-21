import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MessageCircle, Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/booking-dialog";
import { EnquiryForm } from "@/components/enquiry-form";
import { BusinessProfiles } from "@/components/business-profiles";
import { PageHero } from "@/components/page-hero";
import { site } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Squad International | Book a Discovery Call" },
      {
        name: "description",
        content:
          "Talk to Squad International about dedicated offshore teams. Book a 30-minute discovery call, message us on WhatsApp, or send an enquiry.",
      },
      { property: "og:title", content: "Contact Squad International" },
      {
        property: "og:description",
        content: "Book a discovery call or start a WhatsApp conversation with our team.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's scope the team you need"
        description="A 30-minute call is usually enough to size the roles, coverage and cost. Prefer messaging? WhatsApp gets the fastest reply."
      >
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
      </PageHero>

      <section className="container-page grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] md:py-24">
        <EnquiryForm />

        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="text-xl text-charcoal">Direct contact</h2>
            <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-marigold" />
                <a href={`mailto:${site.infoEmail}`} className="hover:text-marigold">
                  {site.infoEmail}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-marigold" />
                <a href={site.phoneHref} className="hover:text-marigold">
                  {site.phone}
                </a>
              </li>
              {/* All three, since this is the page someone opens to find us. */}
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-marigold" />
                <span className="space-y-2">
                  {/*
                    The address is already written out here, so an office with no
                    Maps listing simply is not a link. An anchor without an href
                    is not one either, and reads as broken.
                  */}
                  {site.locations.map((loc) =>
                    loc.mapUrl ? (
                      <a
                        key={loc.city}
                        href={loc.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${loc.city} office on Google Maps`}
                        className="block transition-colors hover:text-marigold"
                      >
                        <span className="font-semibold text-charcoal">{loc.city}</span>{" "}
                        {loc.lines.join(" ")}
                      </a>
                    ) : (
                      <span key={loc.city} className="block">
                        <span className="font-semibold text-charcoal">{loc.city}</span>{" "}
                        {loc.lines.join(" ")}
                      </span>
                    ),
                  )}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-marigold" />
                Replies within one working day; WhatsApp usually within the hour.
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-marigold/40 bg-accent/40 p-8">
            <h2 className="text-xl text-charcoal">What happens on the call</h2>
            <ol className="mt-5 space-y-3 text-sm text-charcoal">
              <li>1. We map the work, volumes and tools involved.</li>
              <li>2. We propose a team shape, coverage model and indicative cost.</li>
              <li>3. If it fits, we agree SLAs and a start date.</li>
            </ol>
            <BookingDialog>
            <Button variant="charcoal" className="mt-6 w-full" size="lg">
              <CalendarDays /> Book a Meeting
            </Button>
          </BookingDialog>
          </div>
        </aside>
      </section>

      {/* Plus the link hub, which the about page does not carry. */}
      <BusinessProfiles items={[...site.profiles, site.linkHub]} />
    </>
  );
}
