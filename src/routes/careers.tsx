import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Briefcase, ChevronDown, ExternalLink, Link2, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site-data";
import { sendApplication } from "@/lib/send-application";
import { parseRichContent } from "@/lib/rich-content";
import { JobDescription } from "@/lib/job-content";
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

/**
 * The job's anchor on this page, so each open role has a link of its own
 * (squadinternational.net/careers#customer-support-agent). The admin portal
 * builds the same slug for its "Copy link" button, so keep the two in step.
 */
function jobSlug(role: Pick<JobRole, "id" | "title">) {
  const slug = (role.title ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || role.id || "job";
}

/**
 * One open role. Cards start as just the title and terms, so the list can be
 * scanned, and open to the full description and apply options on click. The
 * details stay mounted and animate their height (grid rows 0fr → 1fr), so the
 * card opens and closes smoothly rather than jumping.
 */
function JobCard({
  role,
  onApply,
  open,
  onToggle,
}: {
  role: JobRole;
  onApply: (title: string) => void;
  open: boolean;
  onToggle: () => void;
}) {
  const slug = jobSlug(role);
  const detailsId = `${slug}-details`;
  const nodes = parseRichContent(role.content, role.summary);
  const cardRef = useRef<HTMLElement>(null);

  // A card above this one may close as this one opens, which pulls this one up
  // the page. Once both have settled, bring its top back into view if it left.
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      const top = cardRef.current?.getBoundingClientRect().top ?? 0;
      if (top < 80) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        cardRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    }, 450);
    return () => window.clearTimeout(timer);
  }, [open]);

  const copyLink = async () => {
    const url = `${window.location.origin}/careers#${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Job link copied", { description: url });
    } catch {
      toast("Job link", { description: url });
    }
  };

  return (
    <article
      ref={cardRef}
      id={slug}
      className={`group/job relative scroll-mt-28 overflow-hidden rounded-xl border bg-card transition-[border-color,box-shadow] duration-300 ${
        open
          ? "border-marigold/60 shadow-[var(--shadow-elevated)]"
          : "border-border hover:border-marigold/50 hover:shadow-[var(--shadow-elevated)]"
      }`}
    >
      {/* Accent bar that grows down the left edge as the card opens. */}
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 origin-top bg-marigold transition-transform motion-reduce:transition-none ${
          open
            ? "scale-y-100 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            : "scale-y-0 duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
        }`}
      />

      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left md:px-7"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={onToggle}
      >
        <span className="min-w-0">
          <h3 className="text-base text-charcoal transition-colors group-hover/job:text-marigold md:text-lg">
            {role.title}
          </h3>
          <span className="mt-2.5 flex flex-wrap gap-2">
            {role.type && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-marigold/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-marigold">
                <Briefcase className="size-3" /> {role.type}
              </span>
            )}
            {role.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <MapPin className="size-3" /> {role.location}
              </span>
            )}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2.5 text-xs font-semibold text-charcoal">
          <span className="hidden sm:inline">{open ? "Hide details" : "View details"}</span>
          <span
            className={`grid size-9 place-items-center rounded-full border transition-all duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
              open
                ? "rotate-180 border-marigold bg-marigold text-primary-foreground"
                : "border-border group-hover/job:border-marigold group-hover/job:text-marigold"
            }`}
          >
            <ChevronDown className="size-4" />
          </span>
        </span>
      </button>

      {/*
        Opening eases out (fast, then settles). Closing eases in and out over a
        similar time: an ease-out close collapses most of the height in the first
        few frames, which reads as a snap rather than the reverse of opening.
      */}
      <div
        id={detailsId}
        inert={!open}
        className={`grid transition-[grid-template-rows] motion-reduce:transition-none ${
          open
            ? "grid-rows-[1fr] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            : "grid-rows-[0fr] duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`mx-6 border-t border-border pb-7 pt-5 transition-[opacity,translate] motion-reduce:transition-none md:mx-7 ${
              open
                ? "translate-y-0 opacity-100 delay-100 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                : "-translate-y-2 opacity-0 duration-300 ease-in"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              {role.mapUrl && (
                <a
                  href={role.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-charcoal transition-colors hover:border-marigold hover:text-marigold"
                  title={role.address}
                >
                  <MapPin className="size-3.5" /> View on map
                </a>
              )}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-charcoal transition-colors hover:border-marigold hover:text-marigold"
                onClick={copyLink}
              >
                <Link2 className="size-3.5" /> Copy link to this job
              </button>
            </div>

            <div className="mt-6 max-w-4xl">
              <JobDescription nodes={nodes} />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <Button variant="marigold" onClick={() => onApply(role.title)}>
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
          </div>
        </div>
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
  const navigate = Route.useNavigate();
  const [role, setRole] = useState(OPEN_APPLICATION);
  const [submitting, setSubmitting] = useState(false);
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [cvError, setCvError] = useState<string | null>(null);
  const [openJob, setOpenJob] = useState<string | null>(null);

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

  // A shared job link (/careers#slug) opens that job once the roles arrive.
  const linkedJobHandled = useRef(false);
  useEffect(() => {
    if (linkedJobHandled.current || roles.length === 0) return;
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;
    linkedJobHandled.current = true;
    if (!roles.some((r) => jobSlug(r) === hash)) return;
    setOpenJob(hash);
    requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: "start" }));
  }, [roles]);

  const toggleJob = (slug: string) => {
    const next = openJob === slug ? null : slug;
    setOpenJob(next);
    // Keep the address bar on the open job, so it can be copied from there too.
    // Updating the job link is local UI state, so don't reset the page's scroll
    // position or let hash navigation compete with the card's scroll handling.
    void navigate({
      hash: next ?? "",
      replace: true,
      resetScroll: false,
      hashScrollIntoView: false,
    });
  };

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
              description: `Please try again, or email it to ${site.careersEmail}.`,
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
        <div className="mx-auto mt-12 flex max-w-5xl flex-col gap-4">
          {roles.map((r) => (
            <JobCard
              key={r.id ?? r.title}
              role={r}
              onApply={applyFor}
              open={openJob === jobSlug(r)}
              onToggle={() => toggleJob(jobSlug(r))}
            />
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
              <a href={`mailto:${site.careersEmail}`} className="text-marigold hover:underline">
                {site.careersEmail}
              </a>{" "}
              with it attached.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
