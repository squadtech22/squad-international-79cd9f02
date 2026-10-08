import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Clock, Globe, LoaderCircle, Video, Calendar, Send, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { site, services } from "@/lib/site-data";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "sonner";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

const CALENDLY_SRC = "https://assets.calendly.com/assets/external/widget.js";

/** Shared across dialog instances so widget.js is only ever fetched once. */
let loader: Promise<void> | null = null;

function loadCalendly(): Promise<void> {
  if (window.Calendly) return Promise.resolve();
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SRC}"]`);
    const script = existing ?? document.createElement("script");

    script.addEventListener(
      "load",
      () =>
        window.Calendly
          ? resolve()
          : reject(new Error("Calendly widget.js loaded without exposing window.Calendly")),
      { once: true },
    );
    script.addEventListener("error", () => reject(new Error("Calendly widget.js failed to load")), {
      once: true,
    });

    if (!existing) {
      script.src = CALENDLY_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  });

  loader.catch(() => {
    loader = null;
  });

  return loader;
}

function CalendlyInline({ onReady }: { onReady: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;

    const params = new URLSearchParams({
      hide_gdpr_banner: "1",
      background_color: "ffffff",
      text_color: "2b2f36",
      primary_color: "e0a33a",
    });
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) params.set("timezone", timezone);

    loadCalendly()
      .then(() => {
        if (cancelled || !containerRef.current) return;
        window.Calendly?.initInlineWidget({
          url: `${site.calendly}?${params.toString()}`,
          parentElement: containerRef.current,
        });
        containerRef.current
          .querySelector("iframe")
          ?.addEventListener("load", onReady, { once: true });
      })
      .catch((error: unknown) => {
        console.error(error);
        if (!cancelled) onReady();
      });

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, [onReady]);

  useEffect(() => {
    const onMessage = async (event: MessageEvent) => {
      let data = event.data as { event?: string; payload?: Record<string, unknown> } | string | null;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          // not JSON
        }
      }
      const eventData = data as { event?: string; payload?: Record<string, unknown> } | null;
      const name = eventData?.event;
      if (typeof name === "string") {
        if (name.startsWith("calendly.")) onReady();
        if (name === "calendly.event_scheduled") {
          try {
            const payload = (eventData?.payload || {}) as Record<string, any>;
            const eventUri = payload?.event?.uri || "";
            const inviteeUri = payload?.invitee?.uri || "";

            // 1. Add Meeting to Firestore
            await addDoc(collection(db, "meetings"), {
              title: "Discovery Call (Calendly)",
              clientName: "Calendly Invitee",
              company: "Web Schedule",
              email: "",
              date: new Date().toISOString().split("T")[0],
              time: "Booked via Calendly",
              duration: "30 mins",
              type: "Discovery Call",
              platform: "Google Meet",
              link: site.calendly,
              source: "Calendly",
              calendlyEventUri: eventUri,
              calendlyInviteeUri: inviteeUri,
              status: "confirmed",
              notes: `Meeting successfully scheduled via Calendly widget.${eventUri ? ` Ref: ${eventUri}` : ""}`,
              createdAt: new Date().toISOString(),
            });

            // 2. Add Lead so it also appears in Leads Management
            try {
              await addDoc(collection(db, "leads"), {
                name: "Calendly Invitee",
                company: "Web Discovery Call",
                email: "",
                phone: "",
                service: "Discovery Call",
                message: "Discovery call scheduled via Calendly live calendar. Check your Calendly dashboard and invitation email for full attendee details.",
                status: "prospects",
                source: "Calendly Live Booking",
                date: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                docs: [],
                notes: [
                  {
                    id: `note-${Date.now()}`,
                    author: "Calendly System",
                    text: "New meeting booked via embedded Calendly widget.",
                    date: new Date().toLocaleString(),
                  },
                ],
              });
            } catch (lErr) {
              console.warn("Calendly lead sync:", lErr);
            }

            toast.success("Meeting Scheduled", {
              description: "Your meeting has been synced to our operations calendar.",
            });
          } catch (e) {
            console.warn("Calendly Firestore sync:", e);
          }
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onReady]);

  return <div ref={containerRef} className="h-[520px] w-full" />;
}

export function BookingDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"calendly" | "direct">("calendly");
  const [submittingDirect, setSubmittingDirect] = useState(false);

  const [directForm, setDirectForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "02:00 PM EST",
    service: services[0]?.title || "Medical Billing & RCM",
    notes: "",
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) setIsLoading(true);
  };
  const handleReady = useCallback(() => setIsLoading(false), []);

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directForm.name || !directForm.email || !directForm.date) {
      toast.error("Please fill in your name, email, and preferred date.");
      return;
    }

    setSubmittingDirect(true);
    try {
      await addDoc(collection(db, "meetings"), {
        title: `Discovery: ${directForm.service}`,
        clientName: directForm.name,
        company: directForm.company || "Independent",
        email: directForm.email,
        phone: directForm.phone || "",
        date: directForm.date,
        time: directForm.time,
        duration: "30 mins",
        type: "Discovery Call",
        platform: "Google Meet",
        link: "https://meet.google.com/new",
        status: "confirmed",
        source: "Direct Meeting Booking",
        notes: directForm.notes || `Preferred service: ${directForm.service}. Requested via Web Direct Booking.`,
        createdAt: new Date().toISOString(),
      });

      // Also create a lead entry so admin tracks both
      try {
        await addDoc(collection(db, "leads"), {
          name: directForm.name,
          company: directForm.company || "Direct Booking",
          email: directForm.email,
          phone: directForm.phone || "",
          service: directForm.service,
          message: `Scheduled discovery meeting for ${directForm.date} at ${directForm.time}. Notes: ${directForm.notes || "None"}`,
          status: "prospects",
          source: "Direct Meeting Booking",
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          docs: [],
          notes: [
            {
              id: `note-${Date.now()}`,
              author: "System",
              text: `Meeting booked for ${directForm.date} at ${directForm.time}.`,
              date: new Date().toLocaleString(),
            },
          ],
        });
      } catch (lErr) {
        console.warn("Lead creation from meeting error:", lErr);
      }

      toast.success("Meeting Scheduled!", {
        description: `We've confirmed your discovery call for ${directForm.date} at ${directForm.time}. Check your email shortly.`,
      });
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Could not schedule meeting. Please try again or WhatsApp us directly.");
    } finally {
      setSubmittingDirect(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[95vw] gap-0 overflow-hidden border-border bg-background p-0 sm:max-w-4xl">
        <DialogTitle className="sr-only">Book a discovery call</DialogTitle>
        <div className="grid md:grid-cols-[minmax(0,260px)_1fr]">
          <aside className="border-b border-border bg-offwhite p-6 md:border-b-0 md:border-r">
            <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {site.name}
            </span>
            <h3 className="font-display mt-5 text-2xl uppercase leading-tight tracking-tight text-charcoal">
              Discovery Call
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A 30-minute call to scope your roles, volumes and timelines — and show you exactly how
              a dedicated pod would run.
            </p>
            <span className="mt-5 block h-1 w-12 bg-marigold" />
            <ul className="mt-5 space-y-3 text-sm text-charcoal">
              <li className="flex items-center gap-2">
                <Clock className="size-4 text-marigold" /> 30 minutes
              </li>
              <li className="flex items-center gap-2">
                <Video className="size-4 text-marigold" /> Google Meet / Zoom
              </li>
              <li className="flex items-center gap-2">
                <Globe className="size-4 text-marigold" /> Your local time zone
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-border/60">
              <span className="text-xs font-semibold text-charcoal block mb-2">Booking method:</span>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("calendly")}
                  className={`text-left text-xs px-3 py-2 rounded-md font-medium transition-colors ${
                    activeTab === "calendly"
                      ? "bg-marigold text-charcoal font-semibold"
                      : "bg-background border border-border text-muted-foreground hover:text-charcoal"
                  }`}
                >
                  Calendly Live Calendar
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("direct")}
                  className={`text-left text-xs px-3 py-2 rounded-md font-medium transition-colors ${
                    activeTab === "direct"
                      ? "bg-marigold text-charcoal font-semibold"
                      : "bg-background border border-border text-muted-foreground hover:text-charcoal"
                  }`}
                >
                  Direct Booking Form
                </button>
              </div>
            </div>
          </aside>

          <div className="relative bg-background p-4 sm:p-6 overflow-y-auto max-h-[600px]">
            {activeTab === "calendly" ? (
              <>
                {isLoading && open && (
                  <div className="absolute inset-0 z-10 grid place-items-center bg-background">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <LoaderCircle className="size-7 animate-spin text-marigold" aria-hidden="true" />
                      <p className="text-sm font-medium text-charcoal">Loading available times…</p>
                    </div>
                  </div>
                )}
                {open ? <CalendlyInline onReady={handleReady} /> : null}
              </>
            ) : (
              <form onSubmit={handleDirectSubmit} className="space-y-4 py-2">
                <div>
                  <h4 className="text-lg font-bold text-charcoal">Select Preferred Meeting Date & Time</h4>
                  <p className="text-xs text-muted-foreground">Directly synched with Squad International operations.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">Your Full Name *</label>
                    <input
                      required
                      placeholder="Jane Doe"
                      className="w-full text-xs rounded-md border border-input bg-background p-2.5 outline-none focus:border-marigold"
                      value={directForm.name}
                      onChange={(e) => setDirectForm({ ...directForm, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">Company *</label>
                    <input
                      required
                      placeholder="Acme Health or Logistics"
                      className="w-full text-xs rounded-md border border-input bg-background p-2.5 outline-none focus:border-marigold"
                      value={directForm.company}
                      onChange={(e) => setDirectForm({ ...directForm, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">Work Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="jane@company.com"
                      className="w-full text-xs rounded-md border border-input bg-background p-2.5 outline-none focus:border-marigold"
                      value={directForm.email}
                      onChange={(e) => setDirectForm({ ...directForm, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">Phone / WhatsApp</label>
                    <input
                      placeholder="+1 (555) 000-0000"
                      className="w-full text-xs rounded-md border border-input bg-background p-2.5 outline-none focus:border-marigold"
                      value={directForm.phone}
                      onChange={(e) => setDirectForm({ ...directForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">Preferred Meeting Date *</label>
                    <input
                      required
                      type="date"
                      className="w-full text-xs rounded-md border border-input bg-background p-2.5 outline-none focus:border-marigold"
                      value={directForm.date}
                      onChange={(e) => setDirectForm({ ...directForm, date: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal block mb-1">Preferred Time Window *</label>
                    <select
                      className="w-full text-xs rounded-md border border-input bg-background p-2.5 outline-none focus:border-marigold"
                      value={directForm.time}
                      onChange={(e) => setDirectForm({ ...directForm, time: e.target.value })}
                    >
                      <option value="10:00 AM EST">10:00 AM EST (Morning)</option>
                      <option value="01:00 PM EST">01:00 PM EST (Early Afternoon)</option>
                      <option value="03:00 PM EST">03:00 PM EST (Late Afternoon)</option>
                      <option value="05:00 PM EST">05:00 PM EST (Evening)</option>
                      <option value="02:00 PM GMT">02:00 PM GMT (UK/Europe)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Service of Interest</label>
                  <select
                    className="w-full text-xs rounded-md border border-input bg-background p-2.5 outline-none focus:border-marigold"
                    value={directForm.service}
                    onChange={(e) => setDirectForm({ ...directForm, service: e.target.value })}
                  >
                    {services.map((s) => (
                      <option key={s.title} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal block mb-1">Scope or Agenda Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Briefly tell us what you would like to discuss during the call..."
                    className="w-full text-xs rounded-md border border-input bg-background p-2.5 outline-none focus:border-marigold"
                    value={directForm.notes}
                    onChange={(e) => setDirectForm({ ...directForm, notes: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingDirect}
                  className="w-full bg-marigold text-charcoal font-bold text-xs py-3 rounded-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
                >
                  {submittingDirect ? <LoaderCircle className="size-4 animate-spin" /> : <Send size={14} />}
                  <span>Confirm Discovery Call Booking</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

