import type { JSX, ReactNode } from "react";

/**
 * Formatted content written in the admin portal (job descriptions, articles).
 *
 * The portal stores it as a JSON tree rather than HTML, so it renders here as
 * plain React elements: nothing is injected as markup, and it works the same
 * during SSR. A node is a string (text) or { t, c, href? }.
 */
export type RichNode = string | { t: string; c?: RichNode[]; href?: string };

const TAGS = new Set(["p", "h2", "h3", "ul", "ol", "li", "blockquote", "strong", "em", "u"]);

function safeHref(href?: string) {
  const value = String(href ?? "").trim();
  return /^(https?:|mailto:|tel:)/i.test(value) ? value : null;
}

/** Reads stored content, falling back to plain text split into paragraphs. */
export function parseRichContent(content: unknown, fallback?: string | string[]): RichNode[] {
  if (typeof content === "string" && content.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed as RichNode[];
    } catch {
      /* fall through to the plain text */
    }
  }
  const paragraphs = Array.isArray(fallback)
    ? fallback
    : String(fallback ?? "")
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
  return paragraphs.map((p) => ({ t: "p", c: [p] }));
}

function render(nodes: RichNode[], prefix: string): ReactNode[] {
  return nodes.map((n, i) => {
    const key = `${prefix}-${i}`;
    if (typeof n === "string") return n;
    if (n.t === "br") return <br key={key} />;
    const children = render(n.c ?? [], key);
    if (n.t === "a") {
      const href = safeHref(n.href);
      return href ? (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <span key={key}>{children}</span>
      );
    }
    const Tag = (TAGS.has(n.t) ? n.t : "span") as keyof JSX.IntrinsicElements;
    return <Tag key={key}>{children}</Tag>;
  });
}

export function RichContent({ nodes, className }: { nodes: RichNode[]; className?: string }) {
  return <div className={`rich-content ${className ?? ""}`}>{render(nodes, "n")}</div>;
}
