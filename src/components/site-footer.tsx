import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import { SubscribeForm } from "@/components/subscribe-form";
import { services, industries, site } from "@/lib/site-data";
import { BRAND_PATHS, BrandIcon, type IconLink } from "@/lib/brand-marks";
import logo from "@/assets/squad-logo.png";


export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-offwhite">
      <div className="mx-auto w-full max-w-[84rem]">
        {/* Tighter row gap than column gap: the socials/signup row sat too far below
          the link columns with a uniform 40px. */}
        <div className="grid gap-x-10 gap-y-6 px-8 pt-16 md:grid-cols-2 md:px-12 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src={logo}
                alt={`${site.name} logo`}
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-offwhite/65">
              {site.boilerplate}
            </p>
            <ul className="mt-5 space-y-2 text-sm text-offwhite/65">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-marigold" />
                <a href={`mailto:${site.email}`} className="hover:text-marigold">
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-marigold" />
                <a href={site.phoneHref} className="hover:text-marigold">
                  {site.phone}
                </a>
              </li>
            </ul>
          </div>

          <FooterCol title="Services">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="text-sm text-offwhite/65 transition-colors hover:text-marigold"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </FooterCol>

          {/* See the offices block below: the two tall columns span both rows so
            the short ones leave a row for it rather than a gap. */}
          <FooterCol title="Industries" className="lg:row-span-2">
            {industries.map((i) => (
              <li key={i.slug}>
                <Link
                  to="/industries/$slug"
                  params={{ slug: i.slug }}
                  className="text-sm text-offwhite/65 transition-colors hover:text-marigold"
                >
                  {i.name}
                </Link>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="Company" className="lg:row-span-2">
            {[
              { to: "/about", label: "About" },
              { to: "/case-studies", label: "Case Studies" },
              { to: "/blog", label: "Blog" },
              { to: "/careers", label: "Careers" },
              { to: "/faqs", label: "FAQs" },
              { to: "/contact", label: "Contact" },
              { to: "/privacy-policy", label: "Privacy Policy" },
              { to: "/terms-of-service", label: "Terms of Service" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-offwhite/65 transition-colors hover:text-marigold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </FooterCol>

          {/*
          City and country only. The addresses in full are on the contact page,
          which is where someone actually needs them; here they were three
          stacked blocks for information nobody reads out of a footer. Each city
          still links to its place on Maps.
        */}
          <div className="md:col-span-2">
            <p className="flex items-center gap-2 text-sm text-offwhite/65">
              <MapPin className="size-4 shrink-0 text-marigold" />
              Locations
            </p>
            <ul className="mt-3 space-y-1.5">
              {site.locations.map((loc) => (
                <li key={loc.city} className="flex items-baseline gap-2.5">
                  <span aria-hidden="true" className="text-marigold">
                    &bull;
                  </span>
                  {loc.mapUrl ? (
                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${loc.city} office on Google Maps`}
                      className="text-sm text-marigold transition-colors hover:text-offwhite"
                    >
                      {loc.city}, {loc.country}
                    </a>
                  ) : (
                    /*
                     * No Maps listing for this office, so it opens to show the
                     * address rather than linking to a search that only looks like
                     * a listing. A details element, so it needs no state and keeps
                     * the keyboard and screen reader behaviour browsers already
                     * give a disclosure.
                     */
                    <details className="group min-w-0">
                      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-sm text-marigold transition-colors marker:content-none hover:text-offwhite">
                        {loc.city}, {loc.country}
                        <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
                      </summary>
                      <address className="mt-1.5 not-italic text-sm text-offwhite/65">
                        {loc.lines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </address>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/*
        Socials under the brand column and the signup across the Services and
        Industries columns, so the field lines up with those headings. The same
        four-column track as above keeps that alignment now that this is a row of
        its own rather than the grid's second row.
      */}
        <div className="grid gap-x-10 gap-y-6 px-8 pb-16 pt-10 md:grid-cols-2 md:px-12 lg:grid-cols-4">
          {/*
          Socials only. The directory listings moved to a section of their own on
          the about and contact pages, where someone checking a supplier's
          credentials is already looking.
        */}
          <nav aria-label="Social media" className="flex flex-wrap gap-2">
            {(site.socials as IconLink[]).map((social) => {
              const path = BRAND_PATHS[social.name];
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  // The icon is decorative, so the link carries the accessible name.
                  aria-label={social.name}
                  title={social.name}
                  className="grid size-9 place-items-center rounded-full border border-offwhite/15 text-offwhite/65 transition-colors hover:border-marigold hover:text-marigold"
                >
                  {path ? (
                    <BrandIcon path={path} className="size-4" />
                  ) : (
                    /*
                     * Sized and cased to match the marks beside it. At 10px the
                     * lettering laid down 10-13px of ink against the icons' 16, and
                     * lowercase made it worse: "Cl" measured 10.4px where "GF"
                     * measured 12.9, so the two badges did not match each other
                     * either. Uppercasing here rather than in the data keeps a
                     * future badge consistent without the label carrying styling.
                     */
                    <span className="text-[13px] font-semibold uppercase leading-none">
                      {social.short ?? social.name.slice(0, 2)}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          <div className="md:col-span-2">
            <SubscribeForm />
          </div>
        </div>

        <div className="border-t border-offwhite/10">
          <div className="flex flex-col items-center justify-between gap-3 px-8 py-6 text-xs text-offwhite/50 sm:flex-row md:px-12">
            <p>
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <p>Business Process Outsourcing · Dedicated Teams · Business Support</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-sm tracking-[0.18em] text-marigold">{title}</h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

