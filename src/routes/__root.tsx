import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import logoUrl from "@/assets/squad-logo.png";
import { site } from "@/lib/site-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  // In the effect rather than in render: a boundary re-renders, and React would
  // otherwise log the same error again each time, twice over under StrictMode.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Squad International | Your Business Companion" },
      {
        name: "description",
        content:
          "Dedicated offshore teams for customer support, business assistance, lead generation and operational delivery.",
      },
      { name: "author", content: "Squad International" },
      { property: "og:title", content: "Squad International | Your Business Companion" },
      {
        property: "og:description",
        content:
          "Dedicated offshore teams for customer support, business assistance, lead generation and operational delivery.",
      },
      { property: "og:image", content: `${site.url}/og-image.jpg` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${site.url}/og-image.jpg` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    /**
     * Google Analytics 4, on the root route so it loads once for every page.
     * HeadContent renders these into <head>, which is where gtag wants to be.
     *
     * The loader is async so it does not block rendering; the snippet below it is
     * inline and synchronous on purpose, because it has to define dataLayer and
     * gtag before the loader finishes and starts reading them.
     */
    scripts: [
      /**
       * Organization, on the root so it is served with every page rather than
       * only the home page. Ties the site to the profiles it is listed on:
       * sameAs is what tells a search engine the Clutch, Trustpilot and Upwork
       * listings are this same company.
       *
       * No aggregateRating, deliberately. The Google rating is real, but a
       * business marking up its own rating on its own site is self-serving
       * review markup, which Google's policy excludes from rich results and
       * treats as a spam signal. The rating stays visible on the page, where it
       * is fine; it just is not claimed in schema.
       */
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${site.url}/#organization`,
          name: site.name,
          url: `${site.url}/`,
          logo: `${site.url}${logoUrl}`,
          description: site.boilerplate,
          email: site.email,
          telephone: site.phone,
          address: site.locations.map((l) => ({ "@type": "PostalAddress", ...l.address })),
          founder: {
            "@type": "Person",
            name: site.founder.name,
            jobTitle: site.founder.role,
            sameAs: site.founder.profiles.map((p) => p.url),
          },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: site.email,
            telephone: site.phone,
            // Two offices share a country, so the list is deduplicated.
            areaServed: [...new Set(site.locations.map((l) => l.address.addressCountry))],
          },
          sameAs: [...site.socials.map((s) => s.url), ...site.profiles.map((p) => p.url)],
        }),
      },
      { src: "https://www.googletagmanager.com/gtag/js?id=G-Q80EHWPPBW", async: true },
      {
        children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-Q80EHWPPBW');`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Routes that render without the site chrome: no nav, no footer, no floating
 * WhatsApp button. Campaign landing pages, where every link off the page is a
 * link away from converting. They supply their own masthead and legal footer.
 */
const BARE_ROUTES = new Set(["/get-started"]);

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isBare = BARE_ROUTES.has(pathname.replace(/\/+$/, "") || "/");

  if (isBare) {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        {/*
          The header is fixed, so it is out of the flow. Clearance for it lives in the
          top padding of each page's first section rather than here — padding on main
          paints the page background, which showed as a pale band above dark heroes.
        */}
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <WhatsAppFab />
      <Toaster />
    </QueryClientProvider>
  );
}

