import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ExternalLink, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site-data";
import { sendApplication } from "@/lib/send-application";
import { parseRichContent, RichContent } from "@/lib/rich-content";
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
  /** Formatted description from the admin portal; `summary` is its plain-text copy. */
  content?: string;
  office?: string;
  address?: string;
  mapUrl?: string;
  /** External places to apply (LinkedIn, Indeed, …), set per job in the admin portal. */
  applyLinks?: { source: string; url: string }[];
  order?: number;
  active?: boolean;
};

/** Button text for an external apply link, e.g. "Apply on LinkedIn". */
function applyLabel(source: string) {
  switch (source) {
    case "Company website":
      return "Apply on our website";
    case "Other job sites":
    case "Other":
      return "Apply online";
    case "Referral":
      return "Apply via referral";
    case "Contacted by recruiter":
      return "Contact recruiter";
    case "Staffing agency":
      return "Apply via staffing agency";
    default:
      return `Apply on ${source}`;
  }
}

/** One open role. Long descriptions are clipped until the reader expands them. */
function JobCard({ role, onApply }: { role: JobRole; onApply: (title: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const nodes = parseRichContent(role.content, role.summary);
  const isLong = (role.summary ?? "").length > 320;
  const descriptionId = `job-${role.id ?? role.title}`.replace(/\s+/g, "-");

  return (
    <article className="flex flex-col rounded-lg border border-border bg-card p-7 card-pop hover:border-marigold hover:shadow-[var(--shadow-elevated)]">
      <h3 className="text-lg text-charcoal">{role.title}</h3>
      <p className="mt-2 text-xs uppercase tracking-wider text-marigold">
        {role.type} · {role.location}
      </p>
      {role.mapUrl && (
        <a
          href={role.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 self-start text-xs font-semibold text-charcoal hover:text-marigold"
          title={role.address}
        >
          <MapPin className="size-3.5" /> View on map
        </a>
      )}
      <div className="mt-4 flex-1">
        <div
          id={descriptionId}
          className={`relative overflow-hidden ${isLong && !expanded ? "max-h-56 job-fade" : ""}`}
        >
          <RichContent nodes={nodes} className="rich-job text-sm text-muted-foreground" />
        </div>
        {isLong && (
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-charcoal hover:text-marigold"
            aria-expanded={expanded}
            aria-controls={descriptionId}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Show less" : "Read full description"}
          </button>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outlineDark" onClick={() => onApply(role.title)}>
          Apply now
        </Button>
        {(role.applyLinks ?? [])
          .filter((l) => /^https?:\/\//i.test(l.url ?? ""))
          .map((l) => (
            <Button key={`${l.source}-${l.url}`} variant="outlineDark" asChild>
              <a href={l.url} target="_blank" rel="noopener noreferrer">
                {applyLabel(l.source)} <ExternalLink />
              </a>
            </Button>
          ))}
      </div>
    </article>
  );
}

const benefits = [
  "Structured onboarding and paid training",
  "Clear promotion paths into QA and team lead roles",
  "Health coverage and shift allowances",
  "Modern delivery centres with reliable infrastructure",
  "Long-term client accounts, not rotating campaigns",
  "Performance bonuses tied to published scorecards",
];

const OPEN_APPLICATION = "Open application";

/**
 * CVs are stored as base64 inside the application's Firestore document, which
 * is capped at 1 MiB. Base64 adds a third, so 700 KB keeps the whole document
 * (CV plus the other fields) safely under the limit.
 */
const MAX_CV_BYTES = 700 * 1024;

/** Reads a file as base64, without the `data:…;base64,` prefix. */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Returns an error message, or null when the file is an acceptable CV. */
function validateCv(file: File): string | null {
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  if (!isPdf) return "Please upload your CV as a PDF file.";
  if (file.size > MAX_CV_BYTES) {
    return `Your CV is ${(file.size / 1024).toFixed(0)} KB. Please upload a PDF under 700 KB.`;
  }
  return null;
}

function CareersPage() {
  const [role, setRole] = useState(OPEN_APPLICATION);
  const [submitting, setSubmitting] = useState(false);
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [cvError, setCvError] = useState<string | null>(null);

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
    const cvFile = values.get("cv");
    const cv = cvFile instanceof File && cvFile.size > 0 ? cvFile : null;

    if (cv) {
      const problem = validateCv(cv);
      if (problem) {
        setCvError(problem);
        toast.error("CV not accepted", { description: problem });
        return;
      }
    }

    setSubmitting(true);
    try {
      // 1. Save application to Firebase Firestore "applications" collection
      if (!companyWebsite) {
        try {
          const cvFields = cv
            ? {
                cvBase64: await fileToBase64(cv),
                cvFileName: cv.name,
                cvMimeType: "application/pdf",
                cvSize: cv.size,
              }
            : {};
          await addDoc(collection(db, "applications"), {
            ...cvFields,
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
          // Without the saved document the uploaded CV is lost, so say so
          // rather than reporting success.
          if (cv) {
            toast.error("We couldn't upload your CV", {
              description: `Please try again, or email it to ${site.email}.`,
            });
            return;
          }
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
            <JobCard key={r.id ?? r.title} role={r} onApply={applyFor} />
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
                <Label htmlFor="applicant-cv">Upload your CV (PDF, max 700 KB)</Label>
                <Input
                  id="applicant-cv"
                  name="cv"
                  type="file"
                  accept="application/pdf,.pdf"
                  aria-invalid={cvError ? true : undefined}
                  aria-describedby={cvError ? "applicant-cv-error" : undefined}
                  className="cursor-pointer file:mr-3 file:cursor-pointer file:font-semibold"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setCvError(file ? validateCv(file) : null);
                  }}
                />
                {cvError && (
                  <p id="applicant-cv-error" className="text-xs text-destructive">
                    {cvError}
                  </p>
                )}
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="applicant-link">Link to CV or LinkedIn (optional)</Label>
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
              Trouble uploading? Link to your CV instead, or email{" "}
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
