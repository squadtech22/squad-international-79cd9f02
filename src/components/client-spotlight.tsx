import { CalendarDays, MessageCircle, Users } from "lucide-react";
import dataWallImage from "@/assets/spotlight-data-wall.png";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/booking-dialog";
import { site } from "@/lib/site-data";

export function ClientSpotlight() {
  return (
    <section className="bg-card py-20 md:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="eyebrow">
            <span className="h-px w-8 bg-marigold" /> An extension of your team
          </span>
          <h2 className="mt-4 font-display text-4xl leading-[0.95] tracking-tight text-charcoal md:text-5xl">
            Support that works
            <br />
            like part of your business
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Add dependable capacity across customer support, sales, administration and day-to-day
            operations, while your internal team stays focused on higher-value work. We build the
            support around your requirements, processes and workload so outsourcing feels like
            adding capacity rather than adding another problem to manage.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BookingDialog>
              <Button variant="marigold" size="lg">
                <CalendarDays /> Book a Free Consultation
              </Button>
            </BookingDialog>
            <Button variant="outlineDark" size="lg" asChild>
              <a href={site.whatsapp} target="_blank" rel="noreferrer">
                <MessageCircle /> WhatsApp Us
              </a>
            </Button>
          </div>
        </div>

        <div className="relative">
          <img
            src={dataWallImage}
            alt="A wall of live dashboards tracking performance, volumes and market data"
            loading="lazy"
            className="ml-auto h-[420px] w-full max-w-xl rounded-xl object-cover"
          />

          <div className="absolute left-0 top-14 w-64 rounded-lg border border-border bg-background p-5 text-center shadow-xl">
            <Users className="mx-auto size-5 text-marigold" />
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-marigold">
              Dedicated pod
            </p>
            <p className="mt-1 font-display text-lg text-charcoal">New Client Onboarding</p>
            <p className="mt-1 text-xs text-muted-foreground">Coverage across US &amp; UK hours</p>
          </div>

          <div className="absolute bottom-8 left-4 flex w-64 items-center gap-3 rounded-lg border border-border bg-background p-4 shadow-xl">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-charcoal font-display text-sm text-marigold">
              TL
            </span>
            <div className="text-left">
              <p className="text-sm text-charcoal">Team lead assigned</p>
              <p className="text-sm font-medium text-marigold">SLA reporting weekly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
