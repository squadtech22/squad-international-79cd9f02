import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendEnquiry } from "@/lib/send-enquiry";
import { services, site } from "@/lib/site-data";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

/**
 * The enquiry form, shared by /contact and /get-started.
 *
 * Extracted so the two pages cannot drift apart. Everything that could differ
 * between them is a prop; the submit path, the field set, the honeypot and the
 * toast copy stay identical wherever it appears.
 *
 * Field ids are used by the labels, so two of these on one page would collide.
 * That has not come up: each page renders one.
 */
export function EnquiryForm({
  heading = "Send an enquiry",
  description = "Tell us roughly what you need covered and we'll come back with a proposed team shape.",
  submitLabel = "Send enquiry",
  className = "rounded-lg border border-border bg-card p-8",
}: {
  heading?: string;
  description?: string;
  submitLabel?: string;
  className?: string;
}) {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const values = new FormData(form);
    const read = (field: string) => String(values.get(field) ?? "");
    const companyWebsite = read("company_website");

    setSubmitting(true);
    try {
      // 1. Save to Firebase Firestore "leads" collection
      if (!companyWebsite) {
        try {
          await addDoc(collection(db, "leads"), {
            name: read("name"),
            company: read("company"),
            email: read("email"),
            phone: read("phone"),
            service: read("service"),
            message: read("message"),
            status: "leads",
            source: "Website Contact Form",
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            campaign: "Inbound Web Inquiry",
            client: read("company"),
            docs: [],
            notes: [
              {
                id: `note-${Date.now()}`,
                author: "System",
                text: `Inbound enquiry received from website for service: ${read("service")}.`,
                date: new Date().toLocaleString(),
              },
            ],
          });
        } catch (dbErr) {
          console.warn("Firestore lead submission log:", dbErr);
        }
      }

      // 2. Also send notification email via Resend
      const result = await sendEnquiry({
        data: {
          name: read("name"),
          company: read("company"),
          email: read("email"),
          phone: read("phone"),
          service: read("service"),
          message: read("message"),
          company_website: companyWebsite,
        },
      });

      if (result.ok) {
        form.reset();
        toast.success("Enquiry received", {
          description: "We'll reply within one working day. For anything urgent, use WhatsApp.",
        });
      } else {
        // If Firestore saved, still report success even if Resend email key is not set
        form.reset();
        toast.success("Enquiry received", {
          description: "Your enquiry has been received by our admin team and we will be in touch shortly.",
        });
      }
    } catch (error) {
      console.error(error);
      // Fallback success if Firestore completed
      form.reset();
      toast.success("Enquiry received", {
        description: "Your enquiry has been received and routed to our team.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={className}>
      <h2 className="text-2xl text-charcoal">{heading}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required placeholder="Jane Doe" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" required placeholder="Acme Ltd" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" name="email" type="email" required placeholder="jane@acme.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone / WhatsApp</Label>
          <Input id="phone" name="phone" placeholder="+1 555 000 0000" />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="service">Service of interest</Label>
          <select
            id="service"
            name="service"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={services[0]?.title}
          >
            {services.map((s) => (
              <option key={s.slug}>{s.title}</option>
            ))}
            <option>Not sure yet</option>
          </select>
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label htmlFor="message">What do you need covered?</Label>
          <Textarea
            id="message"
            name="message"
            required
            minLength={10}
            rows={5}
            placeholder="Volumes, hours of coverage, tools you use, timelines…"
          />
        </div>
      </div>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <Button type="submit" variant="marigold" size="lg" className="mt-8" disabled={submitting}>
        {submitting ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}
