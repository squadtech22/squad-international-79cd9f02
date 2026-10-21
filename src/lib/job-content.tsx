import type { ComponentType, ReactNode } from "react";
import {
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { BRAND_PATHS, BrandIcon } from "@/lib/brand-marks";
import { RichContent, type RichNode } from "@/lib/rich-content";

/**
 * Job descriptions are typed in the admin portal, usually pasted from a social
 * post: "Label: value" lines dotted with emoji. Shown as-is that reads as a
 * chat message, so here the "Label: value" lines become a grid of facts with a
 * proper icon each, the emoji are dropped, and an emoji-led sentence becomes a
 * highlighted note. Anything else renders as ordinary formatted text.
 */

const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}\u{20E3}]/gu;
const LEADING_EMOJI = /^\s*\p{Extended_Pictographic}/u;
const FACT = /^([A-Za-z][A-Za-z &/()-]{1,40}?)\s*\**\s*:\s*\**\s*(.+)$/;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE = /\+?\d[\d\s-]{8,}\d/;

type IconType = ComponentType<{ className?: string }>;
type Fact = { label: string; value: string; icon: IconType; href?: string | undefined };
type Segment =
  | { kind: "rich"; nodes: RichNode[] }
  | { kind: "facts"; facts: Fact[] }
  | { kind: "note"; nodes: RichNode[] };

function WhatsAppIcon({ className }: { className?: string }) {
  return <BrandIcon path={BRAND_PATHS["WhatsApp"] ?? ""} className={className ?? ""} />;
}

const FACT_ICONS: [RegExp, IconType][] = [
  [/whats\s*app/i, WhatsAppIcon],
  [/e-?mail|apply|send cv/i, Mail],
  [/phone|call|contact|resume|cv/i, Phone],
  [/location|address|city|office|site/i, MapPin],
  [/position|role|title|designation|job/i, Briefcase],
  [/industry|department|sector|company/i, Building2],
  [/candidate|gender|male|female|who can/i, Users],
  [/shift|timing|hours|time|days/i, Clock],
  [/salary|pay|compensation|package|stipend/i, Wallet],
  [/education|qualification|degree/i, GraduationCap],
  [/experience/i, Award],
  [/requirement|skill|must/i, ClipboardCheck],
];

const textOf = (n: RichNode): string =>
  typeof n === "string" ? n : n.t === "br" ? "\n" : (n.c ?? []).map(textOf).join("");

const stripEmoji = (nodes: RichNode[]): RichNode[] =>
  nodes.map((n): RichNode =>
    typeof n === "string" || !n.c ? (typeof n === "string" ? n.replace(EMOJI, "") : n) : { ...n, c: stripEmoji(n.c) },
  );

/** Drops the stray brackets and asterisks that pasted posts leave around values. */
const tidy = (s: string) =>
  s
    .replace(EMOJI, "")
    .replace(/[[\]*]/g, "")
    .replace(/\s+/g, " ")
    .trim();

function toFact(text: string): Fact | null {
  const match = tidy(text).match(FACT);
  if (!match) return null;
  const label = (match[1] ?? "").trim();
  const value = (match[2] ?? "").trim();
  if (!value || label.split(" ").length > 5) return null;

  const icon = FACT_ICONS.find(([re]) => re.test(label))?.[1] ?? CheckCircle2;
  const email = value.match(EMAIL)?.[0];
  const phone = value.match(PHONE)?.[0];
  let href: string | undefined;
  if (email) href = `mailto:${email}`;
  else if (phone && /whats\s*app/i.test(label)) {
    // Local Pakistani numbers (03xx…) need the country code for wa.me.
    const digits = phone.replace(/\D/g, "").replace(/^0/, "92");
    href = `https://wa.me/${digits}`;
  } else if (phone) href = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return { label, value, icon, href };
}

/** Splits a block's children into its lines, at each line break. */
function linesOf(nodes: RichNode[]): RichNode[][] {
  let current: RichNode[] = [];
  const lines: RichNode[][] = [current];
  for (const n of nodes) {
    if (typeof n !== "string" && n.t === "br") lines.push((current = []));
    else current.push(n);
  }
  return lines.filter((l) => textOf({ t: "span", c: l }).trim() !== "");
}

function segment(nodes: RichNode[]): Segment[] {
  const out: Segment[] = [];
  const pushFact = (fact: Fact) => {
    const last = out[out.length - 1];
    if (last?.kind === "facts") last.facts.push(fact);
    else out.push({ kind: "facts", facts: [fact] });
  };

  for (const block of nodes) {
    if (typeof block === "string" || block.t !== "p") {
      out.push({ kind: "rich", nodes: stripEmoji([block]) });
      continue;
    }
    // Ordinary lines of one paragraph stay together as that paragraph.
    let pending: RichNode[] = [];
    const flush = () => {
      if (pending.length) out.push({ kind: "rich", nodes: [{ t: "p", c: pending }] });
      pending = [];
    };
    for (const line of linesOf(block.c ?? [])) {
      const text = textOf({ t: "span", c: line });
      const fact = toFact(text);
      if (fact) {
        flush();
        pushFact(fact);
      } else if (LEADING_EMOJI.test(text)) {
        flush();
        out.push({ kind: "note", nodes: stripEmoji(line) });
      } else {
        if (pending.length) pending.push({ t: "br" });
        pending.push(...stripEmoji(line));
      }
    }
    flush();
  }
  return out;
}

function FactItem({ fact }: { fact: Fact }) {
  const Icon = fact.icon;
  const body: ReactNode = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-marigold/10 text-marigold">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {fact.label}
        </span>
        <span className="mt-0.5 block break-words text-sm font-medium text-charcoal">{fact.value}</span>
      </span>
    </>
  );
  const base = "flex items-start gap-3 rounded-lg border border-border bg-background/60 p-3";
  return fact.href ? (
    <a
      href={fact.href}
      target={fact.href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={`${base} transition-colors hover:border-marigold hover:bg-marigold/5`}
    >
      {body}
    </a>
  ) : (
    <div className={base}>{body}</div>
  );
}

export function JobDescription({ nodes }: { nodes: RichNode[] }) {
  return (
    <div className="job-description space-y-4">
      {segment(nodes).map((s, i) => {
        if (s.kind === "facts") {
          return (
            <div key={i} className="grid gap-2.5 sm:grid-cols-2">
              {s.facts.map((f) => (
                <FactItem key={`${f.label}-${f.value}`} fact={f} />
              ))}
            </div>
          );
        }
        if (s.kind === "note") {
          return (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border-l-[3px] border-marigold bg-marigold/[0.07] px-4 py-3 text-sm text-charcoal"
            >
              <Sparkles className="mt-0.5 size-4 shrink-0 text-marigold" />
              <RichContent nodes={s.nodes} className="rich-job" />
            </div>
          );
        }
        return <RichContent key={i} nodes={s.nodes} className="rich-job text-[0.95rem] text-muted-foreground" />;
      })}
    </div>
  );
}
