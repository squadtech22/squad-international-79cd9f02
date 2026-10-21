/**
 * Writes public/sitemap.xml from the routes and the content in src/lib/site-data.ts.
 *
 * Runs as part of `npm run build`, so the sitemap cannot drift out of step with
 * the content. Override the host with SITE_URL when deploying elsewhere.
 *
 * site-data.ts is TypeScript, so rather than pull in a TS loader this reads the
 * slugs out of the source directly. Each array is sliced by name first so, for
 * example, blog post slugs can't leak into the services list.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = (process.env.SITE_URL || "https://squadinternational.net").replace(/\/+$/, "");

const source = readFileSync(resolve(root, "src/lib/site-data.ts"), "utf8");

function arrayBody(name) {
  const start = source.indexOf(`export const ${name}`);
  if (start < 0) throw new Error(`site-data.ts has no export named ${name}`);
  const end = source.indexOf("\n];", start);
  if (end < 0) throw new Error(`could not find the end of ${name}`);
  return source.slice(start, end);
}

const slugsOf = (name) => [...arrayBody(name).matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

const externalServices = new Set(
  [...arrayBody("services").matchAll(/slug:\s*"([^"]+)",\s*externalUrl:/g)].map((m) => m[1]),
);
const services = slugsOf("services").filter((slug) => !externalServices.has(slug));
const industries = slugsOf("industries");
const caseStudies = slugsOf("caseStudies");
const posts = slugsOf("posts");

// Blog posts carry a date, which makes a meaningful lastmod.
const postDates = new Map(
  [...arrayBody("posts").matchAll(/slug:\s*"([^"]+)"[\s\S]*?date:\s*"([^"]+)"/g)].map((m) => [
    m[1],
    m[2],
  ]),
);

const staticPaths = [
  "/",
  "/services",
  "/industries",
  "/case-studies",
  "/blog",
  "/about",
  "/founder",
  "/careers",
  "/faqs",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
];

const urls = [
  ...staticPaths.map((path) => ({ path })),
  ...services.map((slug) => ({ path: `/services/${slug}` })),
  ...industries.map((slug) => ({ path: `/industries/${slug}` })),
  ...caseStudies.map((slug) => ({ path: `/case-studies/${slug}` })),
  ...posts.map((slug) => ({ path: `/blog/${slug}`, lastmod: postDates.get(slug) })),
];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map(({ path, lastmod }) =>
    [
      "  <url>",
      `    <loc>${BASE}${path}</loc>`,
      lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  ),
  "</urlset>",
  "",
].join("\n");

const out = resolve(root, "public/sitemap.xml");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, xml, "utf8");

console.log(`sitemap.xml: ${urls.length} URLs at ${BASE}`);
