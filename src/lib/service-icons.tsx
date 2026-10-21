import { Stethoscope, Workflow, Globe, Users, Briefcase, type LucideIcon } from "lucide-react";

/**
 * One icon per service, keyed by slug rather than array position so reordering
 * the services cannot silently reassign them.
 *
 * Shared by the header menu and the homepage cards so the two cannot drift. It
 * lives here rather than in site-data because these are React components and
 * that file is content only, with no React imports.
 */
const SERVICE_ICONS: Record<string, LucideIcon> = {
  "medical-billing-healthcare": Stethoscope,
  "ai-workflow-automation": Workflow,
  "website-design-development": Globe,
  "virtual-business-assistance": Users,
};

/**
 * The briefcase covers a service added later, so a new one is never the only
 * card without a mark beside its title.
 */
export function serviceIcon(slug: string): LucideIcon {
  return SERVICE_ICONS[slug] ?? Briefcase;
}

/**
 * The same lookup as an element, for callers rendering inside a list that has no
 * convenient place to bind the component to a name first.
 */
export function ServiceIcon({ slug, className }: { slug: string; className?: string }) {
  const Icon = serviceIcon(slug);
  return <Icon className={className} />;
}
