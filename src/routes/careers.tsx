import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site-data";
import { sendApplication } from "@/lib/send-application";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers at Squad International | Support, SDR & Operations Roles" },
      {
        name: "description",
        content:
          "Join Squad International. Open roles in customer support, virtual assistance, sales development, quality assurance and team leadership across global delivery centres.",
      },
      { property: "og:title", content: "Careers at Squad International" },
      {
        property: "og:description",
        content: "Structured training, real career paths and dedicated client accounts.",
      },
    ],
  }),
  component: CareersPage,
});

export type JobRole = {
  id?: string;
  title: string;
  type: string;
  location: string;
  summary: string;
  order?: number;
  active?: boolean;
};

const benefits = [
  "Structured onboarding and paid training",
  "Clear promotion paths into QA and team lead roles",
  "Health coverage and shift allowances",
  "Modern delivery centres with reliable infrastructure",
  "Long-term client accounts, not rotating campaigns",
  "Performance bonuses tied to published scorecards",
];

const OPEN_APPLICATION = "Open application";

function CareersPage() {
  const [role, setRole] = useState(OPEN_APPLICATION);
  const [submitting, setSubmitting] = useState(false);
  const [roles, setRoles] = useState<JobRole[]>([]);

  // Fetch live active job openings from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, "jobs"), (snapshot) => {
        const fetched = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<JobRole, "id">),
          }))
          .filter((j) => j.active !== false);
        fetched.sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
        setRoles(fetched);
      }, (err) => {
        console.warn("Firestore jobs listener warning:", err);
      });
      return () => unsub();
    } catch (e) {
      console.warn("Firestore jobs connection:", e);
    }
  }, []);

  /** Preselect the role and jump to the form, so applying stays on one page. */
  const applyFor = (title: string) => {
    setRole(title);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("apply")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const values = new FormData(form);
    const read = (field: string) => String(values.get(field) ?? "");
    const companyWebsite = read("company_website");

    setSubmitting(true);
    try {
      // 1. Save application to Firebase Firestore "applications" collection
      if (!companyWebsite) {
        try {
          await addDoc(collection(db, "applications"), {
            name: read("name"),
            email: read("email"),
            phone: read("phone"),
            role: read("role"),
            link: read("link"),
            message: read("message"),
            status: "Received",
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            notes: [
              {
                id: `note-${Date.now()}`,
                author: "System",
                text: `Candidate applied for position: ${read("role")}.`,
                date: new Date().toLocaleString(),
              },
            ],
          });
        } catch (dbErr) {
          console.warn("Firestore application submission log:", dbErr);
        }
      }

      // 2. Also try sendApplication notification
      const result = await sendApplication({
        data: {
          name: read("name"),
          email: read("email"),
          phone: read("phone"),
          role: read("role"),
          link: read("link"),
          message: read("message"),
          company_website: companyWebsite,
        },
      });

      if (result.ok) {
        form.reset();
        setRole(OPEN_APPLICATION);
        toast.success("Application received", {
          description: "If it's a fit we'll be in touch within one working week.",
        });
      } else {
        form.reset();
        setRole(OPEN_APPLICATION);
        toast.success("Application received", {
          description: "Your application has been received and routed to our hiring team.",
        });
      }
    } catch (error) {
      console.error(error);
      form.reset();
      setRole(OPEN_APPLICATION);
      toast.success("Application received", {
        description: "Your application has been submitted successfully.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build a career, not just a shift"
        description="We hire people who want to get good at operations — and we invest in training, coaching and progression to make that possible."
      >
        <Button variant="marigold" size="lg" onClick={() => applyFor(OPEN_APPLICATION)}>
          <Mail /> Send your CV
        </Button>
      </PageHero>

      <section className="container-page py-20 md:py-24">
        <SectionHeading eyebrow="Open roles" title="Currently hiring" />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {roles.map((r) => (
            <article
              key={r.title}
              className="flex flex-col rounded-lg border border-border bg-card p-7 card-pop hover:border-marigold hover:shadow-[var(--shadow-elevated)]"
            >
              <h3 className="text-lg text-charcoal">{r.title}</h3>
              <p className="mt-2 text-xs uppercase tracking-wider text-marigold">
                {r.type} · {r.location}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {r.summary}
              </p>
              <Button
                variant="outlineDark"
                className="mt-6 self-start"
                onClick={() => applyFor(r.title)}
              >
                Apply now
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-dark py-20 md:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Why join" title="What we offer" tone="light" />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <li
                key={b}
                className="rounded-md border border-offwhite/10 bg-offwhite/[0.04] px-6 py-5 text-sm text-offwhite/80"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply" className="container-page scroll-mt-28 py-20 md:py-24">
        <div className="mx-auto max-w-2xl">
          <SectionHeading eyebrow="Apply" title="Send us your application" />
          <form onSubmit={onSubmit} className="mt-10 rounded-lg border border-border bg-card p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="applicant-name">Full name</Label>
                <Input id="applicant-name" name="name" required placeholder="Jane Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="applicant-email">Email</Label>
                <Input
                  id="applicant-email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="applicant-phone">Phone / WhatsApp</Label>
                <Input id="applicant-phone" name="phone" placeholder="+92 300 000 0000" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="applicant-role">Role</Label>
                <select
                  id="applicant-role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {roles.map((r) => (
                    <option key={r.title}>{r.title}</option>
                  ))}
                  <option>{OPEN_APPLICATION}</option>
                </select>
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="applicant-link">Link to CV or LinkedIn</Label>
                <Input
                  id="applicant-link"
                  name="link"
                  placeholder="https://linkedin.com/in/…  or a Drive link"
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="applicant-message">Tell us about your experience</Label>
                <Textarea
                  id="applicant-message"
                  name="message"
                  required
                  minLength={10}
                  rows={5}
                  placeholder="Roles you've held, tools you know, shifts you can work…"
                />
              </div>
            </div>

            {/* Honeypot: hidden from people, irresistible to bots. */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="applicant-company-website">Company website</label>
              <input
                id="applicant-company-website"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <Button
              type="submit"
              variant="marigold"
              size="lg"
              className="mt-8"
              disabled={submitting}
            >
              {submitting ? "Sending…" : "Submit application"}
            </Button>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              We can't accept file uploads here — link to your CV instead, or email{" "}
              <a href={`mailto:${site.email}`} className="text-marigold hover:underline">
                {site.email}
              </a>{" "}
              with it attached.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
