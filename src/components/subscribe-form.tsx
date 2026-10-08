import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { subscribe } from "@/lib/subscribe";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

/**
 * Footer email capture for visitors who read to the bottom but are not ready to
 * book a call.
 */
export function SubscribeForm() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const values = new FormData(form);
    const email = String(values.get("email") ?? "").trim();
    const companyWebsite = String(values.get("company_website") ?? "").trim();

    if (!email) return;

    setSubmitting(true);
    try {
      // 1. Save to Firebase Firestore "subscriptions" collection
      if (!companyWebsite) {
        try {
          await addDoc(collection(db, "subscriptions"), {
            email,
            source: "Website Footer Newsletter",
            status: "active",
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn("Firestore subscription log:", dbErr);
        }
      }

      // 2. Also try Resend subscription
      const result = await subscribe({
        data: {
          email,
          company_website: companyWebsite,
        },
      });

      form.reset();
      toast.success("You're subscribed", {
        description:
          "We'll send the occasional note on outsourcing and operations. Unsubscribe any time.",
      });
    } catch (error) {
      console.error(error);
      form.reset();
      toast.success("You're subscribed", {
        description: "Thank you for subscribing to Squad International insights.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex gap-2">
        <input
          id="subscribe-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Subscribe for insights"
          // The visible label is gone, so the field needs its name from here — a
          // placeholder is not an accessible name and disappears once typing starts.
          aria-label="Email address to subscribe for insights"
          className="min-w-0 flex-1 rounded-full border border-offwhite/20 bg-offwhite/[0.06] px-4 py-2 text-sm text-offwhite placeholder:text-offwhite/35 focus-visible:border-marigold focus-visible:outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          aria-label="Subscribe"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-marigold text-charcoal transition-colors hover:brightness-105 disabled:opacity-60"
        >
          {submitting ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="subscribe-company-website">Company website</label>
        <input
          id="subscribe-company-website"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <p className="mt-2 text-xs leading-relaxed text-offwhite/40">
        Occasional notes on outsourcing and operations. No spam, unsubscribe any time.
      </p>
    </form>
  );
}
